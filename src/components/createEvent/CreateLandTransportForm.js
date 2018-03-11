import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import Radium, { Style } from 'radium'
import { retrieveCloudStorageToken } from '../../actions/cloudStorageActions'

import { createEventFormContainerStyle, createEventFormBoxShadow, createEventFormLeftPanelStyle, greyTintStyle, eventDescriptionStyle, eventDescContainerStyle, createEventFormRightPanelStyle, attachmentsStyle, bookingNotesContainerStyle } from '../../Styles/styles'

import TransportLocationSelection from '../location/TransportLocationSelection'

import DateTimePicker from '../eventFormComponents/DateTimePicker'
import BookingDetails from '../eventFormComponents/BookingDetails'
import LocationAlias from '../eventFormComponents/LocationAlias'
import Notes from '../eventFormComponents/Notes'
import AttachmentsRework from '../eventFormComponents/AttachmentsRework'
import SaveCancelDelete from '../eventFormComponents/SaveCancelDelete'
import ScheduleOfEvents from '../eventFormComponents/ScheduleOfEvents'

import { createLandTransport } from '../../apollo/landtransport'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { queryItinerary } from '../../apollo/itinerary'

import { removeAllAttachments } from '../../helpers/cloudStorage'
import { allCurrenciesList } from '../../helpers/countriesToCurrencyList'
import newEventLoadSeqAssignment from '../../helpers/newEventLoadSeqAssignment'
import latestTime from '../../helpers/latestTime'
import moment from 'moment'
import { constructGooglePlaceDataObj, constructLocationDetails } from '../../helpers/location'
import { validateIntervals } from '../../helpers/intervalValidationTesting'

const defaultBackground = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}landTransportDefaultBackground.jpg`

class CreateLandTransportForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      startDay: 1,
      endDay:1,
      departureGooglePlaceData: {},
      arrivalGooglePlaceData: {},
      departureLocationAlias: '',
      arrivalLocationAlias: '',
      departureNotes: '',
      arrivalNotes: '',
      // start and end time need to be unix
      startTime: null, // if setstate, will change to unix
      endTime: null, // if setstate, will change to unix
      cost: 0,
      currency: '',
      currencyList: [],
      bookedThrough: '',
      bookingConfirmation: '',
      attachments: [], // all attachments
      backgroundImage: defaultBackground,
      departureLocationDetails: {
        address: null,
        telephone: null,
        openingHours: null
      },
      arrivalLocationDetails: {
        address: null,
        telephone: null,
        openingHours: null
      },
      selectedTab: 'departure'
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

    var newLandTransport = {
      ItineraryId: this.props.ItineraryId,
      departureLocationAlias: this.state.departureLocationAlias,
      arrivalLocationAlias: this.state.arrivalLocationAlias,
      startDay: this.state.startDay,
      endDay: this.state.endDay,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      currency: this.state.currency,
      cost: parseInt(this.state.cost, 10),
      bookingStatus: bookingStatus,
      bookedThrough: this.state.bookedThrough,
      bookingConfirmation: this.state.bookingConfirmation,
      departureNotes: this.state.departureNotes,
      arrivalNotes: this.state.arrivalNotes,
      attachments: this.state.attachments,
      backgroundImage: this.state.backgroundImage
    }

    if (this.state.departureGooglePlaceData.placeId) {
      newLandTransport.departureGooglePlaceData = this.state.departureGooglePlaceData
      newLandTransport.departureUtcOffset = this.state.departureGooglePlaceData.utcOffset
    } else {
      window.alert('location is missing')
      return
    }
    if (this.state.arrivalGooglePlaceData.placeId) {
      newLandTransport.arrivalGooglePlaceData = this.state.arrivalGooglePlaceData
      newLandTransport.arrivalUtcOffset = this.state.arrivalGooglePlaceData.utcOffset
    } else {
      window.alert('location is missing')
      return
    }

    // VALIDATE START AND END TIMES
    if (typeof (newLandTransport.startTime) !== 'number' || typeof (newLandTransport.endTime) !== 'number') {
      window.alert('time is missing')
      return
    }

    // REWRITTEN FUNCTION TO VALIDATE
    var eventObj = {
      startDay: newLandTransport.startDay,
      endDay: newLandTransport.endDay,
      startTime: newLandTransport.startTime,
      endTime: newLandTransport.endTime,
      departureUtcOffset: this.state.departureGooglePlaceData.utcOffset,
      arrivalUtcOffset: this.state.arrivalGooglePlaceData.utcOffset
    }
    var isError = validateIntervals(this.props.events, eventObj)
    console.log('isError', isError)

    if (isError) {
      window.alert('timing clashes detected')
    }

    // console.log('newLandTransport', newLandTransport)
    var helperOutput = newEventLoadSeqAssignment(this.props.events, 'LandTransport', newLandTransport)
    console.log('helper output', helperOutput)

    this.props.changingLoadSequence({
      variables: {
        input: helperOutput.loadSequenceInput
      }
    })

    this.props.createLandTransport({
      variables: helperOutput.newEvent,
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.ItineraryId }
      }]
    })

    this.resetState()
    this.props.toggleCreateEventType()
  }

  closeForm () {
    removeAllAttachments(this.state.attachments, this.apiToken)
    this.resetState()
    this.props.toggleCreateEventType()
  }

  resetState () {
    this.setState({
      startDay: 1,
      endDay: 1,
      departureGooglePlaceData: {},
      arrivalGooglePlaceData: {},
      departureLocationAlias: '',
      arrivalLocationAlias: '',
      departureNotes: '',
      arrivalNotes: '',
      startTime: null, // should be Int
      endTime: null, // should be Int
      cost: 0,
      currency: '',
      currencyList: [],
      bookedThrough: '',
      bookingConfirmation: '',
      attachments: [],
      backgroundImage: defaultBackground,
      departureLocationDetails: {
        address: null,
        telephone: null,
        openingHours: null
      },
      arrivalLocationDetails: {
        address: null,
        telephone: null,
        openingHours: null
      },
      selectedTab: 'departure'
    })
    this.apiToken = null
  }

  // need to select either departure or arrival
  selectLocation (place, type) {
    var googlePlaceData = constructGooglePlaceDataObj(place)
    googlePlaceData
    .then(resolved => {
      console.log('resolved', resolved)
      this.setState({[`${type}GooglePlaceData`]: resolved}, () => {
        if (type === 'departure') {
          var locationDetails = constructLocationDetails(this.state.departureGooglePlaceData, this.props.dates, this.state.startDay)
          this.setState({departureLocationDetails: locationDetails})
        } else if (type === 'arrival') {
          locationDetails = constructLocationDetails(this.state.arrivalGooglePlaceData, this.props.dates, this.state.endDay)
          this.setState({arrivalLocationDetails: locationDetails})
        }
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

  setBackground (previewUrl) {
    this.setState({backgroundImage: `${previewUrl}`})
  }

  componentDidMount () {
    this.props.retrieveCloudStorageToken()

    this.props.cloudStorageToken.then(obj => {
      this.apiToken = obj.token
    })

    var currencyList = allCurrenciesList()
    this.setState({currencyList: currencyList})
    this.setState({currency: currencyList[0]})

    // INITIALIZE STATE TO DEFAULT VALUES (IF PASSED FROM MAP POPUP)

    // if open within planner defaultGooglePlaceData = undefined
    if (this.props.defaultDepartureGooglePlaceData && this.props.defaultDepartureGooglePlaceData.placeId) {
      this.setState({departureGooglePlaceData: this.props.defaultDepartureGooglePlaceData})
    }
    if (this.props.defaultArrivalGooglePlaceData && this.props.defaultArrivalGooglePlaceData.placeId) {
      this.setState({arrivalGooglePlaceData: this.props.defaultArrivalGooglePlaceData})
    }
    // CONSTRUCTOR INITIALIZED STARTDAY, ENDDAY TO 1.
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
      var defaultUnix = latestTime(this.props.events, this.props.day)
      this.setState({startTime: defaultUnix, endTime: defaultUnix})
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.departureGooglePlaceData) {
      if (prevState.startDay !== this.state.startDay) {
        var departureLocationDetails = constructLocationDetails(this.state.departureGooglePlaceData, this.props.dates, this.state.startDay)
        this.setState({departureLocationDetails: departureLocationDetails})
      }
    }
    if (this.state.arrivalGooglePlaceData) {
      if (prevState.endDay !== this.state.endDay) {
        var arrivalLocationDetails = constructLocationDetails(this.state.arrivalGooglePlaceData, this.props.dates, this.state.endDay)
        this.setState({arrivalLocationDetails: arrivalLocationDetails})
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

            <p style={{textDecoration: 'underline', position: 'relative', fontSize: '64px'}}>ROAD</p>

            <div style={eventDescContainerStyle}>
              <TransportLocationSelection selectLocation={(place, type) => this.selectLocation(place, type)} departureLocation={this.state.departureGooglePlaceData} arrivalLocation={this.state.arrivalGooglePlaceData} departureLocationDetails={this.state.departureLocationDetails} arrivalLocationDetails={this.state.arrivalLocationDetails} eventType={this.props.eventType} />
            </div>

            <DateTimePicker updateDayTime={(field, value) => this.updateDayTime(field, value)} dates={this.props.dates} startDay={this.state.startDay} endDay={this.state.endDay} startTimeUnix={this.state.startTime} endTimeUnix={this.state.endTime} daysArr={this.props.daysArr} />

            <ScheduleOfEvents dates={this.props.dates} events={this.props.events} />

          </div>

          {/* RIGHT PANEL --- SUBMIT/CANCEL, BOOKINGNOTES */}
          <div style={createEventFormRightPanelStyle()}>
            <div style={bookingNotesContainerStyle}>
              <h4 style={{fontSize: '24px'}}>Booking Details</h4>
              <BookingDetails handleChange={(e, field) => this.handleChange(e, field)} currency={this.state.currency} currencyList={this.state.currencyList} cost={this.state.cost} />

              {/* TABS FOR DEPARTURE/ARRIVAL */}
              <div>
                {this.state.departureGooglePlaceData.name &&
                  <h4 style={{display: 'inline-block', marginRight: '20px'}} onClick={() => this.switchTab('departure')}>{this.state.departureGooglePlaceData.name}</h4>
                }
                {!this.state.departureGooglePlaceData.name &&
                  <h4 style={{display: 'inline-block', marginRight: '20px'}} onClick={() => this.switchTab('departure')}>DEPARTURE LOCATION</h4>
                }
                {this.state.arrivalGooglePlaceData.name &&
                  <h4 style={{display: 'inline-block', marginRight: '20px'}} onClick={() => this.switchTab('arrival')}>{this.state.arrivalGooglePlaceData.name}</h4>
                }
                {!this.state.arrivalGooglePlaceData.name &&
                  <h4 style={{display: 'inline-block', marginRight: '20px'}} onClick={() => this.switchTab('arrival')}>ARRIVAL LOCATION</h4>
                }
              </div>

              {/* ATTACHMENT COMPONENT RECEIVES SEPARATE DEPARTURE, ARRIVAL ATTACHMENTS. BUT BOTH UPDATE THE SAME THIS.STATE.ATTACHMENTS */}
              {this.state.selectedTab === 'departure' &&
                <div>
                  {this.state.departureGooglePlaceData.name &&
                    <LocationAlias locationAlias={this.state.departureLocationAlias} handleChange={(e) => this.handleChange(e, 'departureLocationAlias')} placeholder={`Detailed Location (${this.state.departureGooglePlaceData.name})`} />
                  }
                  {!this.state.departureGooglePlaceData.name &&
                    <LocationAlias locationAlias={this.state.departureLocationAlias} handleChange={(e) => this.handleChange(e, 'departureLocationAlias')} placeholder={'Detailed Location (Departure)'} />
                  }
                  <Notes notes={this.state.departureNotes} handleChange={(e) => this.handleChange(e, 'departureNotes')} label={'Departure Notes'} />
                  <AttachmentsRework attachments={this.state.attachments.filter(e => { return e.arrivalDeparture === 'departure' })} ItineraryId={this.props.ItineraryId} handleFileUpload={(e) => this.handleFileUpload(e, 'departure')} removeUpload={i => this.removeUpload(i)} setBackground={(url) => this.setBackground(url)} backgroundImage={this.state.backgroundImage} />
                </div>
              }
              {this.state.selectedTab === 'arrival' &&
                <div>
                  {this.state.arrivalGooglePlaceData.name &&
                    <LocationAlias locationAlias={this.state.arrivalLocationAlias} handleChange={(e) => this.handleChange(e, 'arrivalLocationAlias')} placeholder={`Detailed Location (${this.state.arrivalGooglePlaceData.name})`} />
                  }
                  {!this.state.arrivalGooglePlaceData.name &&
                    <LocationAlias locationAlias={this.state.arrivalLocationAlias} handleChange={(e) => this.handleChange(e, 'arrivalLocationAlias')} placeholder={'Detailed Location (Arrival)'} />
                  }
                  <Notes notes={this.state.arrivalNotes} handleChange={(e) => this.handleChange(e, 'arrivalNotes')} label={'Arrival Notes'} />
                  <AttachmentsRework attachments={this.state.attachments.filter(e => { return e.arrivalDeparture === 'arrival' })} ItineraryId={this.props.ItineraryId} handleFileUpload={(e) => this.handleFileUpload(e, 'arrival')} removeUpload={i => this.removeUpload(i)} setBackground={(url) => this.setBackground(url)} backgroundImage={this.state.backgroundImage} />
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
    cloudStorageToken: state.cloudStorageToken
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    retrieveCloudStorageToken: () => {
      dispatch(retrieveCloudStorageToken())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(createLandTransport, {name: 'createLandTransport'}),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'})
)(Radium(CreateLandTransportForm)))
