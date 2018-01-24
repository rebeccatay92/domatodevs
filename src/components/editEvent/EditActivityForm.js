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
import Attachments from '../eventFormComponents/Attachments'
import SaveCancelDelete from '../eventFormComponents/SaveCancelDelete'

import { updateActivity, deleteActivity } from '../../apollo/activity'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { queryItinerary } from '../../apollo/itinerary'

import { removeAllAttachments } from '../../helpers/cloudStorage'
import { allCurrenciesList } from '../../helpers/countriesToCurrencyList'
import updateEventLoadSeqAssignment from '../../helpers/updateEventLoadSeqAssignment'
import moment from 'moment'
import { constructGooglePlaceDataObj, constructLocationDetails } from '../../helpers/location'
import { validateOpeningHours } from '../../helpers/openingHoursValidation'
import newEventTimelineValidation from '../../helpers/newEventTimelineValidation'
import checkStartAndEndTime from '../../helpers/checkStartAndEndTime'

const defaultBackground = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}activityDefaultBackground.jpg`


class EditActivityForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: this.props.event.id, // activity id
      startDay: 0,
      endDay: 0,
      startTime: null, // if setstate, will change to unix
      endTime: null, // if setstate, will change to unix
      locationAlias: '',
      description: '',
      notes: '',
      cost: 0,
      currency: '',
      currencyList: [],
      bookedThrough: '',
      bookingConfirmation: '',
      attachments: [], // entire arr user sees. not sent to backend.
      holderNewAttachments: [],
      holderDeleteAttachments: [],
      backgroundImage: defaultBackground,
      googlePlaceData: {},
      locationDetails: {
        address: null,
        telephone: null,
        openingHours: null // text for selected day
      },
      openingHoursValidation: null,
      allDayEvent: null
    }
  }

  updateDayTime (field, value) {
    this.setState({
      [field]: value
    }, () => console.log('after handledaytime', this.state))
  }

  handleChange (e, field) {
    this.setState({
      [field]: e.target.value
    }, () => console.log('after handle change', this.state))
  }

  // ONLY SEND UPDATED FIELDS. delete all in holderDeleteAttachments. send holderNewAttachments to backend

  handleSubmit () {
    var updatesObj = {
      id: this.state.id
    }
    // remove openingHoursValidation from backend if planner can use openingHours helper ok
    var fieldsToCheck = ['locationAlias', 'startDay', 'endDay', 'description', 'currency', 'cost', 'bookedThrough', 'bookingConfirmation', 'notes', 'backgroundImage', 'openingHoursValidation', 'startTime', 'endTime']
    fieldsToCheck.forEach(field => {
      if (this.props.event[field] !== this.state[field]) {
        updatesObj[field] = this.state[field]
      }
    })
    // if cost was updated, it is a str. make int.
    if (updatesObj.cost) {
      updatesObj.cost = parseInt(updatesObj.cost, 10)
    }
    // then manually add booking status, googlePlaceData, attachments, allDayEvent
    var bookingStatus = this.state.bookingConfirmation ? true : false
    if (bookingStatus !== this.props.event.bookingStatus) {
      updatesObj.bookingStatus = bookingStatus
    }
    // if location changed, it doesnt contain the id field
    if (!this.state.googlePlaceData.id) {
      updatesObj.googlePlaceData = this.state.googlePlaceData
    }
    if (this.state.holderNewAttachments.length) {
      updatesObj.addAttachments = this.state.holderNewAttachments
    }
    // removeAttachments obj only takes id
    if (this.state.holderDeleteAttachments.length) {
      // removing holderDeleteAttachments from cloud
      removeAllAttachments(this.state.holderDeleteAttachments, this.apiToken)
      // set up removeAttachments[ID] arr for backend
      updatesObj.removeAttachments = this.state.holderDeleteAttachments.map(e => {
        return e.id
      })
    }

    // if allDayEvent, and time happens to change to exactly identical unix as what was saved, fieldsToCheck doesnt detect change. hence check if state is not null (since onComponentMount will set state to null if allDayEvent)
    // IF ALLDAYEVENT GETS ASSIGNED TIME, CHANGE ALLDAYEVENT BOOLEAN
    if (this.props.event.allDayEvent) {
      if (typeof (this.state.startTime) === 'number') {
        updatesObj.startTime = this.state.startTime
        updatesObj.allDayEvent = false
      }
      if (typeof (this.state.endTime) === 'number') {
        updatesObj.endTime = this.state.endTime
        updatesObj.allDayEvent = false
      }
    }
    // IF NON-ALLDAYEVENT HAS MISSING TIME FIELDS, ASSIGN VALUES / ALLDAY BOOLEAN. IF ALLDAYEVENT TIMING NOT CHANGED, ALSO ASSIGN TIMINGS (SINCE INITIALIZED TO NULL). EVENTSARR NEED TO REMOVE THE EVENT FIRST.
    var eventsArr = this.props.events.filter(e => {
      var isUpdatingEvent = (e.type === 'Activity' && e.modelId === this.state.id)
      return !isUpdatingEvent
    })
    // use checkStartAndEndTime on eventsArr (doesnt contain currently editing event)
    if (typeof (this.state.startTime) !== 'number' && typeof (this.state.endTime) !== 'number') {
      var timeAssignedEvent = checkStartAndEndTime(eventsArr, this.state, 'allDayEvent')
      console.log('timeAssignedEvent', timeAssignedEvent)
      updatesObj.startTime = timeAssignedEvent.startTime
      updatesObj.endTime = timeAssignedEvent.endTime
      updatesObj.allDayEvent = true
    } else if (typeof (this.state.startTime) !== 'number') {
      timeAssignedEvent = checkStartAndEndTime(eventsArr, this.state, 'startTimeMissing')
      console.log('timeAssignedEvent', timeAssignedEvent)
      updatesObj.startTime = timeAssignedEvent.startTime
    } else if (typeof (this.state.endTime) !== 'number') {
      timeAssignedEvent = checkStartAndEndTime(eventsArr, this.state, 'endTimeMissing')
      console.log('timeAssignedEvent', timeAssignedEvent)
      updatesObj.endTime = timeAssignedEvent.endTime
    }

    console.log('handlesubmit', updatesObj)

    // check if updatesObj has fields other than id. if yes, then send to backend
    if (Object.keys(updatesObj).length <= 1) {
      this.resetState()
      this.props.toggleEditEventType()
    }

    // if time or day changes, reassign load seq. if googlePlaceData changes, run anyway (utcOffset might change)
    if (updatesObj.startDay || updatesObj.endDay || updatesObj.startTime || updatesObj.endTime || updatesObj.googlePlaceData) {
      // add utcOffset into obj
      var updateEvent = {
        startDay: this.state.startDay,
        endDay: this.state.endDay,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        utcOffset: this.state.googlePlaceData.utcOffset
      }
      console.log('updateEvent before helper', updateEvent)
      var helperOutput = updateEventLoadSeqAssignment(this.props.events, 'Activity', this.state.id, updateEvent)
      console.log('helperOutput', helperOutput)

      updatesObj.loadSequence = helperOutput.updateEvent.loadSequence
      var loadSequenceInput = helperOutput.loadSequenceInput
      if (loadSequenceInput.length) {
        this.props.changingLoadSequence({
          variables: {
            input: loadSequenceInput
          }
        })
      }
    }
    this.props.updateActivity({
      variables: updatesObj,
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.ItineraryId }
      }]
    })

    this.resetState()
    this.props.toggleEditEventType()

    // VALIDATE PLANNER TIMINGS
    // var output = newEventTimelineValidation(this.props.events, 'Activity', newActivity)
    // console.log('output', output)
    //
    // if (!output.isValid) {
    //   window.alert(`time ${newActivity.startTime} --- ${newActivity.endTime} clashes with pre existing events.`)
    //   console.log('ERROR ROWS', output.errorRows)
    // }
  }

  // changes are not saved. remove all holderNewAttachments. ignore holderDeleteAttachments
  closeForm () {
    removeAllAttachments(this.state.holderNewAttachments, this.apiToken)
    this.resetState()
    this.props.toggleEditEventType()
  }

  deleteEvent () {
    var eventType = 'Activity'
    var modelId = this.state.id

    // REASSIGN LOAD SEQ AFTER DELETING
    function constructLoadSeqInputObj (event, correctLoadSeq) {
      var inputObj = {
        type: event.type === 'Flight' ? 'FlightInstance' : event.type,
        id: event.type === 'Flight' ? event.Flight.FlightInstance.id : event.modelId,
        loadSequence: correctLoadSeq,
        day: event.day
      }
      if (event.type === 'Flight' || event.type === 'LandTransport' || event.type === 'SeaTransport' || event.type === 'Train' || event.type === 'Lodging') {
        inputObj.start = event.start
      }
      return inputObj
    }
    // console.log('all events', this.props.events)
    var loadSequenceInputArr = []
    var eventsArr = this.props.events
    // remove deleted rows from eventsArr
    var newEventsArr = eventsArr.filter(e => {
      var isDeletedEvent = (e.type === eventType && e.modelId === modelId)
      return (!isDeletedEvent)
    })
    // console.log('newEventsArr', newEventsArr)
    // find how many days with events exist in eventsArr, split by day
    var daysArr = []
    newEventsArr.forEach(e => {
      if (!daysArr.includes(e.day)) {
        daysArr.push(e.day)
      }
    })
    // console.log('daysArr', daysArr)
    // check load seq and reassign
    daysArr.forEach(day => {
      var dayEvents = newEventsArr.filter(e => {
        return e.day === day
      })
      dayEvents.forEach(event => {
        var correctLoadSeq = dayEvents.indexOf(event) + 1
        if (event.loadSequence !== correctLoadSeq) {
          var loadSequenceInputObj = constructLoadSeqInputObj(event, correctLoadSeq)
          loadSequenceInputArr.push(loadSequenceInputObj)
        }
      })
    })
    console.log('loadSequenceInputArr', loadSequenceInputArr)
    this.props.changingLoadSequence({
      variables: {
        input: loadSequenceInputArr
      }
    })
    this.props.deleteActivity({
      variables: {
        id: modelId
      },
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.ItineraryId }
      }]
    })

    this.resetState()
    this.props.toggleEditEventType()
  }

  resetState () {
    this.setState({
      startDay: 0,
      endDay: 0,
      startTime: null,
      endTime: null,
      locationAlias: '',
      description: '',
      notes: '',
      cost: 0,
      currency: '',
      currencyList: [],
      bookedThrough: '',
      bookingConfirmation: '',
      attachments: [],
      holderNewAttachments: [],
      holderDeleteAttachments: [],
      backgroundImage: defaultBackground,
      googlePlaceData: {},
      locationDetails: {
        address: null,
        telephone: null,
        openingHours: null // text for selected day
      },
      openingHoursValidation: null,
      allDayEvent: null
    })
    this.apiToken = null
  }

  selectLocation (place) {
    var googlePlaceData = constructGooglePlaceDataObj(place)
    this.setState({googlePlaceData: googlePlaceData}, () => {
      var locationDetails = constructLocationDetails(this.state.googlePlaceData, this.props.dates, this.state.startDay)
      this.setState({locationDetails: locationDetails})
    })
  }

  handleFileUpload (attachmentInfo) {
    this.setState({attachments: this.state.attachments.concat([attachmentInfo])})
    // new attachment that are not in db go into holding area
    this.setState({holderNewAttachments: this.state.holderNewAttachments.concat([attachmentInfo])})
  }

  removeUpload (index) {
    var files = this.state.attachments
    var holderNew = this.state.holderNewAttachments

    var fileToDelete = files[index]
    var fileNameToRemove = fileToDelete.fileName
    if (this.state.backgroundImage.indexOf(fileNameToRemove) > -1) {
      this.setState({backgroundImage: defaultBackground})
    }

    var isRecentUpload = holderNew.includes(fileToDelete)

    // removing from attachments arr
    var newFilesArr = (files.slice(0, index)).concat(files.slice(index + 1))
    this.setState({attachments: newFilesArr})

    var uriBase = process.env.REACT_APP_CLOUD_DELETE_URI
    var objectName = fileToDelete.fileName
    objectName = objectName.replace('/', '%2F')
    var uriFull = uriBase + objectName

    if (isRecentUpload) {
      console.log('isRecentUpload')
      // remove from holding area, send delete http req
      var holdingIndex = holderNew.indexOf(fileToDelete)
      var newArr = (holderNew.slice(0, holdingIndex)).concat(holderNew.slice(holdingIndex + 1))
      this.setState({holderNewAttachments: newArr})

      fetch(uriFull, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      })
      .then(response => {
        if (response.status === 204) {
          console.log('delete from cloud storage succeeded')
        }
      })
      .catch(err => {
        console.log(err)
      })
    } else {
      // add to holderDeleteAttachments. dont send req
      this.setState({holderDeleteAttachments: this.state.holderDeleteAttachments.concat([fileToDelete])})
    }
  }

  setBackground (previewUrl) {
    previewUrl = previewUrl.replace(/ /gi, '%20')
    this.setState({backgroundImage: `${previewUrl}`})
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.googlePlaceData) {
      if (prevState.startDay !== this.state.startDay) {
        var locationDetails = constructLocationDetails(this.state.googlePlaceData, this.props.dates, this.state.startDay)
        this.setState({locationDetails: locationDetails})
      }
      // if location/day/time changed, validate opening hours
      if (prevState.locationDetails !== this.state.locationDetails || prevState.startDay !== this.state.startDay || prevState.endDay !== this.state.endDay || (prevState.startTime !== this.state.startTime) || (prevState.endTime !== this.state.endTime)) {
        var openingHoursError = validateOpeningHours(this.state.googlePlaceData, this.props.dates, this.state.startDay, this.state.endDay, this.state.startTime, this.state.endTime)
        this.setState({openingHoursValidation: openingHoursError}, () => console.log('state', this.state.openingHoursValidation))
      }
    }
  }

  componentDidMount () {
    this.props.retrieveCloudStorageToken()
    this.props.cloudStorageToken.then(obj => {
      this.apiToken = obj.token
    })
    // DROPDOWN WITH ALL CURRENCIES.
    var currencyList = allCurrenciesList()
    this.setState({currencyList: currencyList})

    var openingHoursError = validateOpeningHours(this.state.googlePlaceData, this.props.dates, this.props.event.startDay, this.props.event.endDay, this.props.event.startTime, this.props.event.endTime)
    this.setState({openingHoursValidation: openingHoursError})

    var startTime = this.props.event.startTime
    var endTime = this.props.event.endTime
    var defaultStartTime = moment.utc(this.props.event.startTime * 1000).format('HH:mm')
    var defaultEndTime = moment.utc(this.props.event.endTime * 1000).format('HH:mm')

    // if all day event, datetimepicker displays null instead of midnight. start/end time unix is also null
    if (this.props.event.allDayEvent) {
      console.log('all day event')
      defaultStartTime = null
      defaultEndTime = null
      startTime = null
      endTime = null
    }

    // INSTANTIATE STATE TO BE WHATEVER WAS IN DB
    console.log('event', this.props.event)
    this.setState({
      startDay: this.props.event.startDay,
      endDay: this.props.event.endDay,
      startTime: startTime, // unix or null for all day
      endTime: endTime,
      defaultStartTime: defaultStartTime, // 'HH:mm' string
      defaultEndTime: defaultEndTime,
      description: this.props.event.description,
      locationAlias: this.props.event.locationAlias || '',
      currency: this.props.event.currency,
      cost: this.props.event.cost,
      bookedThrough: this.props.event.bookedThrough || '',
      bookingConfirmation: this.props.event.bookingConfirmation || '',
      notes: this.props.event.notes || '',
      backgroundImage: this.props.event.backgroundImage,
      googlePlaceData: this.props.event.location,
      attachments: this.props.event.attachments,
      allDayEvent: this.props.event.allDayEvent
    }, () => console.log('edit form did mount', this.state))
  }

  render () {
    return (
      <div style={createEventFormContainerStyle}>

        {/* BOX SHADOW WRAPS LEFT AND RIGHT PANEL ONLY */}
        <div style={createEventFormBoxShadow}>

          {/* LEFT PANEL --- BACKGROUND, LOCATION, DATETIME */}
          <div style={createEventFormLeftPanelStyle(this.state.backgroundImage)}>
            <div style={greyTintStyle} />

            <div style={{...eventDescContainerStyle, ...{marginTop: '120px'}}}>
              <SingleLocationSelection selectLocation={place => this.selectLocation(place)} currentLocation={this.state.googlePlaceData} locationDetails={this.state.locationDetails} />
            </div>
            <div style={eventDescContainerStyle}>
              <input className='left-panel-input' placeholder='Input Description' type='text' name='description' value={this.state.description} onChange={(e) => this.handleChange(e, 'description')} autoComplete='off' style={eventDescriptionStyle(this.state.backgroundImage)} />
            </div>
            {/* CONTINUE PASSING DATE AND DATESARR DOWN */}
            <DateTimePicker updateDayTime={(field, value) => this.updateDayTime(field, value)} dates={this.props.dates} date={this.props.date} startDay={this.state.startDay} endDay={this.state.endDay} defaultStartTime={this.state.defaultStartTime} defaultEndTime={this.state.defaultEndTime} />

            {this.state.openingHoursValidation &&
              <div>
                <h4 style={eventWarningStyle(this.state.backgroundImage)}>Warning: {this.state.openingHoursValidation}</h4>
              </div>
            }

          </div>
          {/* RIGHT PANEL --- SUBMIT/CANCEL, BOOKINGNOTES */}
          <div style={createEventFormRightPanelStyle()}>
            <div style={bookingNotesContainerStyle}>
              <h4 style={{fontSize: '24px'}}>Booking Details</h4>

              <BookingDetails handleChange={(e, field) => this.handleChange(e, field)} currency={this.state.currency} currencyList={this.state.currencyList} cost={this.state.cost} bookedThrough={this.state.bookedThrough} bookingConfirmation={this.state.bookingConfirmation} />
              <h4 style={{fontSize: '24px', marginTop: '50px'}}>
                  Additional Notes
              </h4>

              <LocationAlias locationAlias={this.state.locationAlias} handleChange={(e) => this.handleChange(e, 'locationAlias')} />

              <Notes notes={this.state.notes} handleChange={(e, field) => this.handleChange(e, field)} />
              <SaveCancelDelete delete handleSubmit={() => this.handleSubmit()} closeForm={() => this.closeForm()} deleteEvent={() => this.deleteEvent()} />
            </div>
          </div>
        </div>

        {/* BOTTOM PANEL --- ATTACHMENTS */}
        <div style={attachmentsStyle}>
          <Attachments handleFileUpload={(e) => this.handleFileUpload(e)} attachments={this.state.attachments} ItineraryId={this.props.ItineraryId} formType={'edit'} removeUpload={i => this.removeUpload(i)} setBackground={url => this.setBackground(url)} />
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
  graphql(updateActivity, {name: 'updateActivity'}),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'}),
  graphql(deleteActivity, {name: 'deleteActivity'})
)(Radium(EditActivityForm)))
