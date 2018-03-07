import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import Radium from 'radium'
import { retrieveCloudStorageToken } from '../../actions/cloudStorageActions'

import { createEventFormContainerStyle, createEventFormBoxShadow, createEventFormLeftPanelStyle, greyTintStyle, eventDescriptionStyle, eventDescContainerStyle, eventWarningStyle, createEventFormRightPanelStyle, attachmentsStyle, bookingNotesContainerStyle } from '../../Styles/styles'

import SingleLocationSelection from '../location/SingleLocationSelection'
import DateTimePicker from '../eventFormComponents/DateTimePicker'
import BookingDetails from '../eventFormComponents/BookingDetails'
import LocationAlias from '../eventFormComponents/LocationAlias'
import Notes from '../eventFormComponents/Notes'
import AttachmentsRework from '../eventFormComponents/AttachmentsRework'
import SaveCancelDelete from '../eventFormComponents/SaveCancelDelete'
import ScheduleOfEvents from '../eventFormComponents/ScheduleOfEvents'

import { createActivity } from '../../apollo/activity'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { queryItinerary } from '../../apollo/itinerary'

import { removeAllAttachments } from '../../helpers/cloudStorage'
import { allCurrenciesList } from '../../helpers/countriesToCurrencyList'
import newEventLoadSeqAssignment from '../../helpers/newEventLoadSeqAssignment'
import latestTime from '../../helpers/latestTime'
import moment from 'moment'
import { constructGooglePlaceDataObj, constructLocationDetails } from '../../helpers/location'
import { validateOpeningHours } from '../../helpers/openingHoursValidation'
import checkStartAndEndTime from '../../helpers/checkStartAndEndTime'

import { validateIntervals } from '../../helpers/intervalValidationTesting'

const defaultBackground = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}activityDefaultBackground.jpg`


class CreateActivityForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      startDay: this.props.day,
      endDay: this.props.day,
      googlePlaceData: {},
      locationAlias: '',
      description: '',
      notes: '',
      defaultTime: null,
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
      openingHoursValidation: null
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

    var newActivity = {
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
      notes: this.state.notes,
      attachments: this.state.attachments,
      backgroundImage: this.state.backgroundImage,
      openingHoursValidation: this.state.openingHoursValidation
    }
    if (this.state.googlePlaceData.placeId) {
      newActivity.googlePlaceData = this.state.googlePlaceData
      newActivity.utcOffset = this.state.googlePlaceData.utcOffset
    }
    // IF LOCATION MISSING, CHECK DAY'S EVENTS AND ASSIGN A UTC OFFSET.
    if (!this.state.googlePlaceData.placeId) {
      var daysEvents = this.props.events.filter(e => {
        return e.day === newActivity.startDay
      })
      console.log('daysEvents', daysEvents)
      if (!daysEvents.length) {
        newActivity.utcOffset = 0
      } else {
        var utcOffsetHolder = daysEvents[0].utcOffset
        var isDifferent = false
        daysEvents.forEach(event => {
          if (event.utcOffset !== utcOffsetHolder) {
            isDifferent = true
          }
        })
        if (isDifferent) {
          newActivity.utcOffset = 0
        } else {
          newActivity.utcOffset = utcOffsetHolder
        }
      }
    }

    // VALIDATE AND ASSIGN MISSING TIMINGS.
    if (typeof (newActivity.startTime) !== 'number' && typeof (newActivity.endTime) !== 'number') {
      newActivity = checkStartAndEndTime(this.props.events, newActivity, 'allDayEvent')
      newActivity.allDayEvent = true
    } else if (typeof (newActivity.startTime) !== 'number') {
      newActivity = checkStartAndEndTime(this.props.events, newActivity, 'startTimeMissing')
    } else if (typeof (newActivity.endTime) !== 'number') {
      newActivity = checkStartAndEndTime(this.props.events, newActivity, 'endTimeMissing')
    }

    // REWRITE FUNCTION TO VALIDATE
    var eventObj = {
      startDay: newActivity.startDay,
      endDay: newActivity.endDay,
      startTime: newActivity.startTime,
      endTime: newActivity.endTime,
      utcOffset: newActivity.utcOffset
    }

    var isError = validateIntervals(this.props.events, eventObj, 'Activity')
    console.log('isError', isError)
    if (isError) {
      window.alert('timing clashes detected')
    }

    var helperOutput = newEventLoadSeqAssignment(this.props.events, 'Activity', newActivity)

    console.log('helperOutput', helperOutput)

    this.props.changingLoadSequence({
      variables: {
        input: helperOutput.loadSequenceInput
      }
    })

    this.props.createActivity({
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
      googlePlaceData: {},
      locationAlias: '',
      description: '',
      notes: '',
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
      openingHoursValidation: null
    })
    this.apiToken = null
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

  setBackground (url) {
    this.setState({backgroundImage: `${url}`})
  }

  componentDidMount () {
    console.log(this.state)
    this.props.retrieveCloudStorageToken()

    this.props.cloudStorageToken.then(obj => {
      this.apiToken = obj.token
    })

    var currencyList = allCurrenciesList()
    this.setState({currencyList: currencyList})
    this.setState({currency: currencyList[0]})

    var defaultUnix = latestTime(this.props.events, this.props.day)
    var defaultTime = moment.utc(defaultUnix * 1000).format('HH:mm')
    this.setState({defaultTime: defaultTime})
    this.setState({startTime: defaultUnix, endTime: defaultUnix})
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.googlePlaceData) {
      if (prevState.startDay !== this.state.startDay) {
        var locationDetails = constructLocationDetails(this.state.googlePlaceData, this.props.dates, this.state.startDay)
        this.setState({locationDetails: locationDetails})
      }
      // if location/day/time changed, validate opening hours. if no error -> null, else str
      if (prevState.locationDetails !== this.state.locationDetails || prevState.startDay !== this.state.startDay || prevState.endDay !== this.state.endDay || (prevState.startTime !== this.state.startTime) || (prevState.endTime !== this.state.endTime)) {
        var openingHoursError = validateOpeningHours(this.state.googlePlaceData, this.props.dates, this.state.startDay, this.state.endDay, this.state.startTime, this.state.endTime)
        this.setState({openingHoursValidation: openingHoursError})
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

            <span style={{position: 'relative', paddingBottom: '8px', fontSize: '55px', fontWeight: '100', display: 'inline'}}>ACTIVITY</span>

            <div style={eventDescContainerStyle}>
              <p style={{color: 'white', position: 'relative', fontWeight: '300', fontSize: '16px', margin: '0 0 16px 0'}}>Description</p>
              <input className='left-panel-input' type='text' name='description' value={this.state.description} onChange={(e) => this.handleChange(e, 'description')} autoComplete='off' style={eventDescriptionStyle(this.state.backgroundImage)} />
            </div>
            <div style={eventDescContainerStyle}>
              <SingleLocationSelection selectLocation={place => this.selectLocation(place)} currentLocation={this.state.googlePlaceData} locationDetails={this.state.locationDetails} eventType={this.props.eventType} />
            </div>
            {/* CONTINUE PASSING DATE AND DATESARR DOWN */}
            <DateTimePicker updateDayTime={(field, value) => this.updateDayTime(field, value)} dates={this.props.dates} date={this.props.date} startDay={this.state.startDay} endDay={this.state.endDay} defaultTime={this.state.defaultTime} daysArr={this.props.daysArr} />

            {this.state.openingHoursValidation &&
              <div>
                <h4 style={eventWarningStyle(this.state.backgroundImage)}>Warning: {this.state.openingHoursValidation}</h4>
              </div>
            }

            <ScheduleOfEvents dates={this.props.dates} events={this.props.events} daysArr={this.props.daysArr} />

          </div>
          {/* RIGHT PANEL --- SUBMIT/CANCEL, BOOKINGNOTES */}
          <div style={createEventFormRightPanelStyle()}>
            <div style={bookingNotesContainerStyle}>
              <h4 style={{fontSize: '24px', margin: '0 0 16px 0', fontWeight: '300'}}>Booking Details</h4>
              <BookingDetails handleChange={(e, field) => this.handleChange(e, field)} currency={this.state.currency} currencyList={this.state.currencyList} cost={this.state.cost} />
              {this.state.googlePlaceData.name &&
                <LocationAlias handleChange={(e) => this.handleChange(e, 'locationAlias')} placeholder={`Location in  ${this.state.googlePlaceData.name}`} />
              }
              {!this.state.googlePlaceData.name &&
                <LocationAlias handleChange={(e) => this.handleChange(e, 'locationAlias')} placeholder={'Location'} />
              }
              <Notes handleChange={(e) => this.handleChange(e, 'notes')} label={'Notes'} />

              <AttachmentsRework attachments={this.state.attachments} ItineraryId={this.props.ItineraryId} handleFileUpload={(e) => this.handleFileUpload(e)} removeUpload={i => this.removeUpload(i)} setBackground={(url) => this.setBackground(url)} backgroundImage={this.state.backgroundImage} />

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
  graphql(createActivity, {name: 'createActivity'}),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'})
)(Radium(CreateActivityForm)))
