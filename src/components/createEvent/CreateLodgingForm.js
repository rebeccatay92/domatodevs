import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import Radium from 'radium'
// import { retrieveCloudStorageToken } from '../../actions/cloudStorageActions'

import { createEventFormContainerStyle, createEventFormBoxShadow, createEventFormLeftPanelStyle, greyTintStyle, eventDescriptionStyle, eventDescContainerStyle, createEventFormRightPanelStyle, attachmentsStyle, bookingNotesContainerStyle } from '../../Styles/styles'

import SingleLocationSelection from '../location/SingleLocationSelection'
import DateTimePicker from '../eventFormComponents/DateTimePicker'
import BookingDetails from '../eventFormComponents/BookingDetails'
import LocationAlias from '../eventFormComponents/LocationAlias'
import Notes from '../eventFormComponents/Notes'
import AttachmentsRework from '../eventFormComponents/AttachmentsRework'
import SaveCancelDelete from '../eventFormComponents/SaveCancelDelete'
import ScheduleOfEvents from '../eventFormComponents/ScheduleOfEvents'

import { createLodging } from '../../apollo/lodging'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { queryItinerary } from '../../apollo/itinerary'

import { retrieveToken, removeAllAttachments } from '../../helpers/cloudStorage'
import { allCurrenciesList } from '../../helpers/countriesToCurrencyList'
import newEventLoadSeqAssignment from '../../helpers/newEventLoadSeqAssignment'
import latestTime from '../../helpers/latestTime'
// import moment from 'moment'
import { constructGooglePlaceDataObj, constructLocationDetails } from '../../helpers/location'
import newEventTimelineValidation from '../../helpers/newEventTimelineValidation'

import { validateIntervals } from '../../helpers/intervalValidationTesting'

const defaultBackground = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}lodgingDefaultBackground.jpg`

class CreateLodgingForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ItineraryId: this.props.ItineraryId,
      startDay: 1,
      endDay: 1,
      googlePlaceData: {},
      locationAlias: '',
      description: '',
      arrivalNotes: '',
      departureNotes: '',
      startTime: null, // if setstate, will change to unix
      endTime: null, // if setstate, will change to unix
      cost: 0,
      currency: '',
      currencyList: [],
      bookedThrough: '',
      bookingConfirmation: '',
      attachments: [],
      backgroundImage: defaultBackground,
      locationDetails: {
        address: null,
        telephone: null,
        openingHours: null
      },
      selectedTab: 'arrival'
    }
  }

  switchTab (arrivalDeparture) {
    this.setState({selectedTab: arrivalDeparture})
  }

  updateDayTime (field, value) {
    this.setState({
      [field]: value
    })
  }

  handleChange (e, field) {
    this.setState({
      [field]: e.target.value
    })
  }

  handleSubmit () {
    var bookingStatus = this.state.bookingConfirmation ? true : false

    var newLodging = {
      ItineraryId: this.props.ItineraryId,
      locationAlias: this.state.locationAlias,
      startDay: this.state.startDay,
      endDay: this.state.endDay,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      description: this.state.description,
      currency: this.state.currency,
      cost: parseInt(this.state.cost, 10),
      bookingStatus: bookingStatus,
      bookedThrough: this.state.bookedThrough,
      bookingConfirmation: this.state.bookingConfirmation,
      arrivalNotes: this.state.arrivalNotes,
      departureNotes: this.state.departureNotes,
      attachments: this.state.attachments,
      backgroundImage: this.state.backgroundImage
    }
    if (this.state.googlePlaceData.placeId) {
      newLodging.googlePlaceData = this.state.googlePlaceData
    } else {
      window.alert('location is missing!')
      return
    }

    // VALIDATE START AND END TIMES
    if (typeof (newLodging.startTime) !== 'number' || typeof (newLodging.endTime) !== 'number') {
      window.alert('time is missing')
      return
    }

    // REWRITTEN FUNCTION TO VALIDATE
    var eventObj = {
      startDay: newLodging.startDay,
      endDay: newLodging.endDay,
      startTime: newLodging.startTime,
      endTime: newLodging.endTime,
      utcOffset: this.state.googlePlaceData.utcOffset
    }
    var isError = validateIntervals(this.props.events, eventObj)
    if (isError) {
      window.alert('timing clashes detected')
    }

    var helperOutput = newEventLoadSeqAssignment(this.props.events, 'Lodging', newLodging)
    console.log('helper output', helperOutput)

    newLodging = helperOutput.newEvent
    console.log('newLodging', newLodging)

    this.props.changingLoadSequence({
      variables: {
        input: helperOutput.loadSequenceInput
      }
    })

    this.props.createLodging({
      variables: newLodging,
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.ItineraryId }
      }]
    }).then(resolved => {
      if (this.props.openedFromMap) {
        var focusEventObj = {
          modelId: resolved.data.createLodging.id,
          eventType: 'Lodging',
          flightInstanceId: null,
          day: helperOutput.newEvent.startDay,
          start: null,
          loadSequence: helperOutput.newEvent.startLoadSequence
        }
        this.resetState()

        this.props.mapCreateEventFormSuccess(focusEventObj)
      } else {
        this.resetState()
        this.props.toggleCreateEventType()
      }
    })

    this.resetState()
    this.props.toggleCreateEventType()
  }

  closeForm () {
    // removeAllAttachments(this.state.attachments, this.apiToken)
    removeAllAttachments(this.state.attachments, this.props.googleCloudToken.token)
    this.resetState()
    if (this.props.openedFromMap) {
      this.props.mapCreateEventFormCancel()
    } else {
      this.props.toggleCreateEventType()
    }
  }

  resetState () {
    this.setState({
      startDay: 1,
      endDay: 1,
      googlePlaceData: {},
      locationAlias: '',
      description: '',
      arrivalNotes: '',
      departureNotes: '',
      startTime: null, // should be Int
      endTime: null, // should be Int
      cost: 0,
      currency: this.state.currencyList[0],
      bookedThrough: '',
      bookingConfirmation: '',
      attachments: [],
      backgroundImage: defaultBackground,
      locationDetails: {
        address: null,
        telephone: null,
        openingHours: null
      },
      selectedTab: 'arrival'
    })
    // this.apiToken = null
  }

  selectLocation (place) {
    var googlePlaceData = constructGooglePlaceDataObj(place)
    googlePlaceData
    .then(resolved => {
      console.log('resolved', resolved)
      this.setState({googlePlaceData: resolved}, () => {
        var locationDetails = constructLocationDetails(this.state.googlePlaceData, this.props.dates, this.state.startDay)
        this.setState({locationDetails: locationDetails})
      })
    })
  }

  handleFileUpload (attachmentInfo, arrivalDeparture) {
    attachmentInfo.arrivalDeparture = arrivalDeparture
    this.setState({attachments: this.state.attachments.concat([attachmentInfo])})
  }

  removeUpload (index) {
    var fileToRemove = this.state.attachments[index]
    var fileNameToRemove = fileToRemove.fileName
    if (this.state.backgroundImage.indexOf(fileNameToRemove) > -1) {
      this.setState({backgroundImage: defaultBackground})
    }

    var files = this.state.attachments
    var newFilesArr = (files.slice(0, index)).concat(files.slice(index + 1))

    this.setState({attachments: newFilesArr})
  }

  setBackground (url) {
    this.setState({backgroundImage: `${url}`})
  }

  componentDidMount () {
    this.props.retrieveCloudStorageToken()

    this.props.cloudStorageToken.then(obj => {
      this.apiToken = obj.token
    })

    var currencyList = allCurrenciesList()
    this.setState({currencyList: currencyList})
    this.setState({currency: currencyList[0]})

    // initialize day to whatever day form was opened in
    this.setState({
      startDay: this.props.day,
      endDay: this.props.day
    })

    // INITIALIZE STATE TO DEFAULT VALUES (IF PASSED FROM MAP POPUP)
    if (this.props.defaultDescription) {
      this.setState({description: this.props.defaultDescription})
    }

    if (this.props.defaultGooglePlaceData && this.props.defaultGooglePlaceData.placeId) {
      this.setState({googlePlaceData: this.props.defaultGooglePlaceData})
    }

    if (this.props.defaultStartDay) {
      this.setState({startDay: this.props.defaultStartDay})
    }
    if (this.props.defaultEndDay) {
      this.setState({endDay: this.props.defaultEndDay})
    }

    // SET START AND END TIME DEPENDING ON DEFAULTS
    if (typeof (this.props.defaultStartTime) === 'number') {
      this.setState({startTime: this.props.defaultStartTime})
    }
    if (typeof (this.props.defaultEndTime) === 'number') {
      this.setState({endTime: this.props.defaultEndTime})
    }

    // if no time values at all set as latest time
    if (typeof (this.props.defaultStartTime) !== 'number' && typeof (this.props.defaultEndTime) !== 'number') {
      var defaultUnix = latestTime(this.props.events, this.state.startDay)
      this.setState({startTime: defaultUnix, endTime: defaultUnix})
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.googlePlaceData) {
      if (prevState.startDay !== this.state.startDay) {
        var locationDetails = constructLocationDetails(this.state.googlePlaceData, this.props.dates, this.state.startDay)
        this.setState({locationDetails: locationDetails})
      }
    }
  }

  render () {
    return (
      <div className='eventFormContainer' style={createEventFormContainerStyle}>
        {/* BOX SHADOW WRAPS LEFT AND RIGHT PANEL ONLY */}
        <div style={createEventFormBoxShadow}>
          {/* LEFT PANEL --- BACKGROUND, LOCATION, DATETIME */}
          <div style={createEventFormLeftPanelStyle(this.state.backgroundImage)}>
            <div style={greyTintStyle} />

            <p style={{position: 'relative', paddingBottom: '8px', fontSize: '55px', fontWeight: '100', display: 'inline'}}>LODGING</p>

            <div style={eventDescContainerStyle}>
              <p style={{color: 'white', position: 'relative', fontWeight: '300', fontSize: '16px', margin: '0 0 16px 0'}}>Room Description</p>
              <input className='left-panel-input' type='text' name='description' value={this.state.description} onChange={(e) => this.handleChange(e, 'description')} autoComplete='off' style={eventDescriptionStyle(this.state.backgroundImage)} />
            </div>
            <div style={eventDescContainerStyle}>
              <SingleLocationSelection selectLocation={place => this.selectLocation(place)} currentLocation={this.state.googlePlaceData} locationDetails={this.state.locationDetails} eventType={this.props.eventType} />
            </div>

            <DateTimePicker updateDayTime={(field, value) => this.updateDayTime(field, value)} dates={this.props.dates} startDay={this.state.startDay} endDay={this.state.endDay} startTimeUnix={this.state.startTime} endTimeUnix={this.state.endTime} daysArr={this.props.daysArr} />

            <ScheduleOfEvents dates={this.props.dates} events={this.props.events} />

          </div>

          {/* RIGHT PANEL --- SUBMIT/CANCEL, BOOKINGNOTES */}
          <div style={createEventFormRightPanelStyle()}>
            <div style={bookingNotesContainerStyle}>
              <h4 style={{fontSize: '24px'}}>Booking Details</h4>
              <BookingDetails handleChange={(e, field) => this.handleChange(e, field)} currency={this.state.currency} currencyList={this.state.currencyList} cost={this.state.cost} />
              <LocationAlias handleChange={(e) => this.handleChange(e, 'locationAlias')} />

              {/* TABS FOR CHECKIN/CHECKOUT */}
              <div>
                <h4 style={{display: 'inline-block', marginRight: '20px'}} onClick={() => this.switchTab('arrival')}>CHECK-IN</h4>
                <h4 style={{display: 'inline-block', marginRight: '20px'}} onClick={() => this.switchTab('departure')}>CHECK-OUT</h4>
              </div>

              {this.state.selectedTab === 'arrival' &&
                <div>
                  <Notes notes={this.state.arrivalNotes} handleChange={(e) => this.handleChange(e, 'arrivalNotes')} label={'Check-In Notes'} />
                  <AttachmentsRework attachments={this.state.attachments.filter(e => { return e.arrivalDeparture === 'arrival' })} ItineraryId={this.props.ItineraryId} handleFileUpload={(e) => this.handleFileUpload(e, 'arrival')} removeUpload={i => this.removeUpload(i)} setBackground={(url) => this.setBackground(url)} backgroundImage={this.state.backgroundImage} />
                </div>
              }
              {this.state.selectedTab === 'departure' &&
                <div>
                  <Notes notes={this.state.departureNotes} handleChange={(e) => this.handleChange(e, 'departureNotes')} label={'Check-Out Notes'} />
                  <AttachmentsRework attachments={this.state.attachments.filter(e => { return e.arrivalDeparture === 'departure' })} ItineraryId={this.props.ItineraryId} handleFileUpload={(e) => this.handleFileUpload(e, 'departure')} removeUpload={i => this.removeUpload(i)} setBackground={(url) => this.setBackground(url)} backgroundImage={this.state.backgroundImage} />
                </div>
              }

              <SaveCancelDelete handleSubmit={() => this.handleSubmit()} closeForm={() => this.closeForm()} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.plannerActivities,
    googleCloudToken: state.googleCloudToken
    // cloudStorageToken: state.cloudStorageToken
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     retrieveCloudStorageToken: () => {
//       dispatch(retrieveCloudStorageToken())
//     }
//   }
// }

export default connect(mapStateToProps)(compose(
  graphql(createLodging, {name: 'createLodging'}),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'})
)(Radium(CreateLodgingForm)))
