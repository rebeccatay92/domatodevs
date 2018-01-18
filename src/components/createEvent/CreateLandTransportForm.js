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
import Attachments from '../eventFormComponents/Attachments'
import SubmitCancelForm from '../eventFormComponents/SubmitCancelForm'

import { createLandTransport } from '../../apollo/landtransport'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { queryItinerary } from '../../apollo/itinerary'

import { removeAllAttachments } from '../../helpers/cloudStorage'
import { allCurrenciesList } from '../../helpers/countriesToCurrencyList'
import newEventLoadSeqAssignment from '../../helpers/newEventLoadSeqAssignment'
import latestTime from '../../helpers/latestTime'
import moment from 'moment'
import { constructGooglePlaceDataObj, constructLocationDetails } from '../../helpers/location'
import newEventTimelineValidation from '../../helpers/newEventTimelineValidation'

import { validateIntervals } from '../../helpers/intervalValidationTesting'

const defaultBackground = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}landTransportDefaultBackground.jpg`

class CreateLandTransportForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ItineraryId: this.props.ItineraryId,
      startDay: this.props.day,
      endDay: this.props.day,
      departureGooglePlaceData: {},
      arrivalGooglePlaceData: {},
      departureLocationAlias: '',
      arrivalLocationAlias: '',
      notes: '',
      defaultTime: null, // 24 hr str 'HH:mm'
      // start and end time need to be unix
      startTime: null, // if setstate, will change to unix
      endTime: null, // if setstate, will change to unix
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
      }
    }
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
      ItineraryId: parseInt(this.state.ItineraryId, 10),
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
      notes: this.state.notes,
      attachments: this.state.attachments,
      backgroundImage: this.state.backgroundImage
    }

    if (this.state.departureGooglePlaceData.placeId) {
      newLandTransport.departureGooglePlaceData = this.state.departureGooglePlaceData
    } else {
      window.alert('location is missing')
      return
    }
    if (this.state.arrivalGooglePlaceData.placeId) {
      newLandTransport.arrivalGooglePlaceData = this.state.arrivalGooglePlaceData
    } else {
      window.alert('location is missing')
      return
    }

    // VALIDATE START AND END TIMES
    if (typeof (newLandTransport.startTime) !== 'number' || typeof (newLandTransport.endTime) !== 'number') {
      window.alert('time is missing')
      return
    }

    // VALIDATE PLANNER TIMINGS
    // var output = newEventTimelineValidation(this.props.events, 'Transport', newLandTransport)
    // console.log('output', output)
    // if (!output.isValid) {
    //   window.alert(`time ${newLandTransport.startTime} // ${newLandTransport.endTime} clashes with pre existing events.`)
    //   console.log('ERROR ROWS', output.errorRows)
    // }

    // REWRITTEN FUNCTION TO VALIDATE
    var eventObj = {
      startDay: newLandTransport.startDay,
      endDay: newLandTransport.endDay,
      startTime: newLandTransport.startTime,
      endTime: newLandTransport.endTime
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
      startDay: this.props.startDay,
      endDay: this.props.endDay,
      departureGooglePlaceData: {},
      arrivalGooglePlaceData: {},
      departureLocationAlias: '',
      arrivalLocationAlias: '',
      notes: '',
      startTime: null, // should be Int
      endTime: null, // should be Int
      cost: 0,
      currency: this.state.currencyList[0],
      bookedThrough: '',
      bookingConfirmation: '',
      attachments: [],
      backgroundImage: defaultBackground
    })
    this.apiToken = null
  }

  // need to select either departure or arrival
  selectLocation (place, type) {
    var googlePlaceData = constructGooglePlaceDataObj(place)
    this.setState({[`${type}GooglePlaceData`]: googlePlaceData}, () => {
      // construct location details for both departure/arrival, start/end day
      if (type === 'departure') {
        var locationDetails = constructLocationDetails(this.state.departureGooglePlaceData, this.props.dates, this.state.startDay)
        this.setState({departureLocationDetails: locationDetails})
      } else if (type === 'arrival') {
        locationDetails = constructLocationDetails(this.state.arrivalGooglePlaceData, this.props.dates, this.state.endDay)
        this.setState({arrivalLocationDetails: locationDetails})
      }
    })
  }

  handleFileUpload (attachmentInfo) {
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
    previewUrl = previewUrl.replace(/ /gi, '%20')
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

    // find latest time for that day and assign to start/endTime
    var defaultUnix = latestTime(this.props.events, this.props.day)

    // time is at utc 0
    var defaultTime = moment.utc(defaultUnix * 1000).format('HH:mm')
    // datepicker take 'hh:mm' 24 hr format

    // set default time string that datepicker uses
    this.setState({defaultTime: defaultTime})

    // set default start and end unix for saving
    this.setState({startTime: defaultUnix, endTime: defaultUnix})
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
    // transport doesnt need opening hours validation
  }

  render () {
    return (
      <div style={createEventFormContainerStyle}>

        {/* BOX SHADOW WRAPS LEFT AND RIGHT PANEL ONLY */}
        <div style={createEventFormBoxShadow}>

          {/* LEFT PANEL --- BACKGROUND, LOCATION, DATETIME */}
          <div style={createEventFormLeftPanelStyle(this.state.backgroundImage)}>
            <div style={greyTintStyle} />

            <div style={eventDescContainerStyle}>
              <TransportLocationSelection selectLocation={(place, type) => this.selectLocation(place, type)} departureLocation={this.state.departureGooglePlaceData} arrivalLocation={this.state.arrivalGooglePlaceData} departureLocationDetails={this.state.departureLocationDetails} arrivalLocationDetails={this.state.arrivalLocationDetails} />
            </div>

            {/* CONTINUE PASSING DATE AND DATESARR DOWN */}
            <DateTimePicker updateDayTime={(field, value) => this.updateDayTime(field, value)} dates={this.props.dates} date={this.props.date} startDay={this.state.startDay} endDay={this.state.endDay} defaultTime={this.state.defaultTime} />
          </div>

          {/* RIGHT PANEL --- SUBMIT/CANCEL, BOOKINGNOTES */}
          <div style={createEventFormRightPanelStyle()}>
            <div style={bookingNotesContainerStyle}>
              <SubmitCancelForm handleSubmit={() => this.handleSubmit()} closeForm={() => this.closeForm()} />
              <h4 style={{fontSize: '24px'}}>Booking Details</h4>
              <BookingDetails handleChange={(e, field) => this.handleChange(e, field)} currency={this.state.currency} currencyList={this.state.currencyList} cost={this.state.cost} />
              <h4 style={{fontSize: '24px', marginTop: '50px'}}>
                  Additional Notes
              </h4>

              <LocationAlias handleChange={(e) => this.handleChange(e, 'departureLocationAlias')} placeholder={'Detailed Location (Departure)'} />

              <LocationAlias handleChange={(e) => this.handleChange(e, 'arrivalLocationAlias')} placeholder={'Detailed Location (Arrival)'} />

              <Notes handleChange={(e, field) => this.handleChange(e, field)} />
            </div>
          </div>
        </div>

        {/* BOTTOM PANEL --- ATTACHMENTS */}
        <div style={attachmentsStyle}>
          <Attachments handleFileUpload={(e) => this.handleFileUpload(e)} attachments={this.state.attachments} ItineraryId={this.state.ItineraryId} removeUpload={i => this.removeUpload(i)} setBackground={url => this.setBackground(url)} />
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
