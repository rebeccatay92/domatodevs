import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import Radium from 'radium'
import { clearCurrentlyFocusedEvent } from '../../actions/mapPlannerActions'

import { createEventFormContainerStyle, createEventFormBoxShadow, createEventFormLeftPanelStyle, greyTintStyle, eventDescriptionStyle, eventDescContainerStyle, eventWarningStyle, createEventFormRightPanelStyle, attachmentsStyle, bookingNotesContainerStyle } from '../../Styles/styles'

import SingleLocationSelection from '../location/SingleLocationSelection'
import DateTimePicker from '../eventFormComponents/DateTimePicker'
import BookingDetails from '../eventFormComponents/BookingDetails'
import LocationAlias from '../eventFormComponents/LocationAlias'
import Notes from '../eventFormComponents/Notes'
import AttachmentsRework from '../eventFormComponents/AttachmentsRework'
import SaveCancelDelete from '../eventFormComponents/SaveCancelDelete'

import { updateActivity, deleteActivity } from '../../apollo/activity'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { queryItinerary } from '../../apollo/itinerary'

import { removeAllAttachments } from '../../helpers/cloudStorage'
import { allCurrenciesList } from '../../helpers/countriesToCurrencyList'
import updateEventLoadSeqAssignment from '../../helpers/updateEventLoadSeqAssignment'
// import moment from 'moment'
import { constructGooglePlaceDataObj, constructLocationDetails } from '../../helpers/location'
import { validateOpeningHours } from '../../helpers/openingHoursValidation'
import newEventTimelineValidation from '../../helpers/newEventTimelineValidation'
import checkStartAndEndTime from '../../helpers/checkStartAndEndTime'
import { deleteEventReassignSequence } from '../../helpers/deleteEventReassignSequence'

const defaultBackground = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}activityDefaultBackground.jpg`


class EditActivityForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: this.props.event.id, // activity id
      startDay: 1,
      endDay: 1,
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
    }
  }

  updateDayTime (field, value) {
    this.setState({
      [field]: value
    }, () => console.log('after handledaytime', this.state))
  }

  handleChange (e, field) {
    if (field !== 'cost') {
      this.setState({
        [field]: e.target.value
      })
    } else {
      this.setState({
        cost: parseInt(e.target.value, 10)
      })
    }
  }

  handleSubmit () {
    // always construct for day, time so load seq is always assigned.
    var updatesObj = {
      id: this.state.id,
      startDay: this.state.startDay,
      endDay: this.state.endDay,
      description: this.state.description,
      currency: this.state.currency,
      cost: this.state.cost,
      locationAlias: this.state.locationAlias,
      bookedThrough: this.state.bookedThrough,
      bookingConfirmation: this.state.bookingConfirmation,
      bookingStatus: this.state.bookingConfirmation ? true : false,
      notes: this.state.notes,
      backgroundImage: this.state.backgroundImage,
      openingHoursValidation: this.state.openingHoursValidation
    }
    // if location changed, it doesnt contain the id field, updatesObj will hv googlePlaceData and the utc offset
    if (!this.state.googlePlaceData.id) {
      updatesObj.googlePlaceData = this.state.googlePlaceData
      updatesObj.utcOffset = this.state.googlePlaceData.utcOffset
    }

    if (this.state.holderNewAttachments.length) {
      updatesObj.addAttachments = this.state.holderNewAttachments
    }
    // removeAttachments obj only takes id
    if (this.state.holderDeleteAttachments.length) {
      // removeAllAttachments(this.state.holderDeleteAttachments, this.apiToken)
      removeAllAttachments(this.state.holderDeleteAttachments, this.props.googleCloudToken.token)
      updatesObj.removeAttachments = this.state.holderDeleteAttachments.map(e => {
        return e.id
      })
    }

    // how to check if start/end time is all day event or not? if all day event -> componentdidmount set state to null, even if db has value.
    if (this.props.event.startTime !== this.state.startTime) {
      updatesObj.startTime = this.state.startTime
    }
    if (this.props.event.endTime !== this.state.endTime) {
      updatesObj.endTime = this.state.endTime
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
    // if (Object.keys(updatesObj).length <= 1) {
    //   this.resetState()
    //   this.props.toggleEditEventType()
    // }

    // if time or day changes, reassign load seq. if googlePlaceData changes, run anyway (utcOffset might change)
    // if (updatesObj.startDay || updatesObj.endDay || updatesObj.startTime || updatesObj.endTime || updatesObj.googlePlaceData) {
    //   // if googlePlaceData was changed, utc comes from there, else stay the same as what was in db
    //   var utcOffset = null
    //   if (updatesObj.googlePlaceData) {
    //     utcOffset = updatesObj.googlePlaceData.utcOffset
    //   } else {
    //     utcOffset = this.props.event.utcOffset
    //   }
    //
    //   var updateEvent = {
    //     startDay: this.state.startDay,
    //     endDay: this.state.endDay,
    //     startTime: this.state.startTime,
    //     endTime: this.state.endTime,
    //     utcOffset: utcOffset
    //   }
    //   console.log('updateEvent before helper', updateEvent)
    //   var helperOutput = updateEventLoadSeqAssignment(this.props.events, 'Activity', this.state.id, updateEvent)
    //   console.log('helperOutput', helperOutput)
    //
    //   updatesObj.loadSequence = helperOutput.updateEvent.loadSequence
    //   var loadSequenceInput = helperOutput.loadSequenceInput
    //   if (loadSequenceInput.length) {
    //     this.props.changingLoadSequence({
    //       variables: {
    //         input: loadSequenceInput
    //       }
    //     })
    //   }
    // }

    // always run load seq assignment even if day, time, location didnt change
    var loadSequenceHelperParams = {
      startDay: updatesObj.startDay,
      endDay: updatesObj.endDay,
      // either user input or helper added times
      startTime: updatesObj.startTime,
      endTime: updatesObj.endTime,
      utcOffset: this.state.googlePlaceData.utcOffset
    }
    var helperOutput = updateEventLoadSeqAssignment(this.props.events, 'Activity', this.state.id, loadSequenceHelperParams)
    updatesObj.loadSequence = helperOutput.updateEvent.loadSequence
    var loadSequenceChanges = helperOutput.loadSequenceInput
    if (loadSequenceChanges.length) {
      this.props.changingLoadSequence({
        variables: {
          input: loadSequenceChanges
        }
      })
    }

    this.props.updateActivity({
      variables: updatesObj,
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.ItineraryId }
      }]
    }).then(resolved => {
      if (this.props.openedFromMap) {
        var focusEventObj = {
          modelId: resolved.data.updateActivity.id,
          eventType: 'Activity',
          flightInstanceId: null,
          day: updatesObj.startDay,
          start: null,
          loadSequence: updatesObj.loadSequence
        }
        // console.log('updated. new focusEvent', focusEventObj)
        this.resetState()
        this.props.mapEditEventFormSuccess(focusEventObj)
      } else {
        // from planner route
        this.resetState()
        this.props.toggleEditEventType()
      }
    })
  }

  // changes are not saved. remove all holderNewAttachments. ignore holderDeleteAttachments
  closeForm () {
    // removeAllAttachments(this.state.holderNewAttachments, this.apiToken)
    removeAllAttachments(this.state.holderNewAttachments, this.props.googleCloudToken.token)
    this.resetState()
    if (this.props.openedFromMap) {
      this.props.mapEditEventFormCancel()
    } else {
      this.props.toggleEditEventType()
    }
  }

  // IF DELETE EVENT FROM MAP ROUTE, NEED TO CLEAR PLANNER FOCUS, CLEAR OPENEDITFORMPARAMS.
  deleteEvent () {
    var loadSequenceInputArr = deleteEventReassignSequence(this.props.events, 'Activity', this.state.id)

    this.props.changingLoadSequence({
      variables: {
        input: loadSequenceInputArr
      }
    })
    this.props.deleteActivity({
      variables: {
        id: this.state.id
      },
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.ItineraryId }
      }]
    }).then(resolved => {
      // if delete from map, this.closeForm() will trigger clearOpenEditFormParams. additionally need to clear focusedEvent from map.
      if (this.props.openedFromMap) {
        this.props.clearCurrentlyFocusedEvent()
      }
      this.closeForm()
    })
  }

  resetState () {
    this.setState({
      startDay: 1,
      endDay: 1,
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

  handleFileUpload (attachmentInfo) {
    this.setState({attachments: this.state.attachments.concat([attachmentInfo])})
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
          'Authorization': `Bearer ${this.props.googleCloudToken.token}`
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

  setBackground (url) {
    this.setState({backgroundImage: `${url}`})
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
    // this.props.retrieveCloudStorageToken()
    // this.props.cloudStorageToken.then(obj => {
    //   this.apiToken = obj.token
    // })
    // DROPDOWN WITH ALL CURRENCIES.
    var currencyList = allCurrenciesList()
    this.setState({currencyList: currencyList})

    var openingHoursError = validateOpeningHours(this.state.googlePlaceData, this.props.dates, this.props.event.startDay, this.props.event.endDay, this.props.event.startTime, this.props.event.endTime)
    this.setState({openingHoursValidation: openingHoursError})

    var startTime = this.props.event.startTime
    var endTime = this.props.event.endTime
    // if all day event, datetimepicker displays null instead of midnight. start/end time unix is also null
    if (this.props.event.allDayEvent) {
      console.log('all day event')
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
      utcOffset: this.props.event.utcOffset,
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

    // FURTHER INSTANTIATE STATE IF FORM WAS OPENED FROM MAP. OVERIRDE VALUES WITH WHATEVER EDITS WERE MADE.
    if (this.props.defaultStartDay) {
      this.setState({startDay: this.props.defaultStartDay})
    }
    if (this.props.defaultEndDay) {
      this.setState({endDay: this.props.defaultEndDay})
    }
    if (typeof (this.props.defaultStartTime) === 'number') {
      this.setState({startTime: this.props.defaultStartTime})
    }
    if (typeof (this.props.defaultEndTime) === 'number') {
      this.setState({endTime: this.props.defaultEndTime})
    }
    if (this.props.defaultDescription) {
      this.setState({description: this.props.defaultDescription})
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

            <div style={{...eventDescContainerStyle, ...{marginTop: '120px'}}}>
              <SingleLocationSelection selectLocation={place => this.selectLocation(place)} currentLocation={this.state.googlePlaceData} locationDetails={this.state.locationDetails} />
            </div>
            <div style={eventDescContainerStyle}>
              <input className='left-panel-input' placeholder='Input Description' type='text' name='description' value={this.state.description} onChange={(e) => this.handleChange(e, 'description')} autoComplete='off' style={eventDescriptionStyle(this.state.backgroundImage)} />
            </div>

            <DateTimePicker updateDayTime={(field, value) => this.updateDayTime(field, value)} dates={this.props.dates} startDay={this.state.startDay} endDay={this.state.endDay} startTimeUnix={this.state.startTime} endTimeUnix={this.state.endTime} daysArr={this.props.daysArr} />

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
              {this.state.googlePlaceData.name &&
                <LocationAlias locationAlias={this.state.locationAlias} handleChange={(e) => this.handleChange(e, 'locationAlias')} placeholder={`Detailed Location (${this.state.googlePlaceData.name})`} />
              }
              {!this.state.googlePlaceData.name &&
                <LocationAlias locationAlias={this.state.locationAlias} handleChange={(e) => this.handleChange(e, 'locationAlias')} placeholder={`Detailed Location`} />
              }

              <Notes notes={this.state.notes} handleChange={(e) => this.handleChange(e, 'notes')} label={'Notes'} />

              <AttachmentsRework attachments={this.state.attachments} ItineraryId={this.props.ItineraryId} handleFileUpload={(e) => this.handleFileUpload(e)} removeUpload={i => this.removeUpload(i)} setBackground={(url) => this.setBackground(url)} formType={'edit'} backgroundImage={this.state.backgroundImage} />

              <SaveCancelDelete delete handleSubmit={() => this.handleSubmit()} closeForm={() => this.closeForm()} deleteEvent={() => this.deleteEvent()} />
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearCurrentlyFocusedEvent: () => {
      dispatch(clearCurrentlyFocusedEvent())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(updateActivity, {name: 'updateActivity'}),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'}),
  graphql(deleteActivity, {name: 'deleteActivity'})
)(Radium(EditActivityForm)))
