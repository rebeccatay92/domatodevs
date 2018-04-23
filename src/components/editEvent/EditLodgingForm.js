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

import { updateLodging, deleteLodging } from '../../apollo/lodging'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { queryItinerary } from '../../apollo/itinerary'

import { removeAllAttachments } from '../../helpers/cloudStorage'
import { allCurrenciesList } from '../../helpers/countriesToCurrencyList'
import updateEventLoadSeqAssignment from '../../helpers/updateEventLoadSeqAssignment'
import moment from 'moment'
import { constructGooglePlaceDataObj, constructLocationDetails } from '../../helpers/location'
import { deleteEventReassignSequence } from '../../helpers/deleteEventReassignSequence'

const defaultBackground = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}lodgingDefaultBackground.jpg`

class EditLodgingForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: this.props.event.id,
      startDay: 1,
      endDay: 1,
      startTime: null, // if setstate, will change to unix
      endTime: null, // if setstate, will change to unix
      locationAlias: '',
      description: '',
      arrivalNotes: '',
      departureNotes: '',
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
    var updatesObj = {
      id: this.state.id,
      startDay: this.state.startDay,
      endDay: this.state.endDay,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      description: this.state.description,
      currency: this.state.currency,
      cost: this.state.cost,
      locationAlias: this.state.locationAlias,
      bookedThrough: this.state.bookedThrough,
      bookingConfirmation: this.state.bookingConfirmation,
      bookingStatus: this.state.bookingConfirmation ? true : false,
      backgroundImage: this.state.backgroundImage,
      departureNotes: this.state.departureNotes,
      arrivalNotes: this.state.arrivalNotes
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
      // removeAllAttachments(this.state.holderDeleteAttachments, this.apiToken)
      removeAllAttachments(this.state.holderDeleteAttachments, this.props.googleCloudToken.token)
      // set up removeAttachments[ID] arr for backend
      updatesObj.removeAttachments = this.state.holderDeleteAttachments.map(e => {
        return e.id
      })
    }

    // CHECK START AND END TIMES ARE PRESENT. ELSE PREVENT SUBMIT
    if (typeof (this.state.startTime) !== 'number' || typeof (this.state.endTime) !== 'number') {
      window.alert('time is missing')
      return
    }
    if (!this.state.googlePlaceData.placeId) {
      window.alert('location is missing')
      return
    }

    console.log('handlesubmit', updatesObj)

    // check if updatesObj has fields other than id. if yes, then send to backend
    // if (Object.keys(updatesObj).length <= 1) {
    //   this.resetState()
    //   this.props.toggleEditEventType()
    // }

    // if time or day changes, reassign load seq
    // if (updatesObj.startDay || updatesObj.endDay || updatesObj.startTime || updatesObj.endTime || updatesObj.googlePlaceData) {
    //   var updateEvent = {
    //     startDay: this.state.startDay,
    //     endDay: this.state.endDay,
    //     startTime: this.state.startTime,
    //     endTime: this.state.endTime,
    //     utcOffset: this.state.googlePlaceData.utcOffset
    //   }
    //   var helperOutput = updateEventLoadSeqAssignment(this.props.events, 'Lodging', this.state.id, updateEvent)
    //   console.log('helperOutput', helperOutput)
    //   updatesObj.startLoadSequence = helperOutput.updateEvent.startLoadSequence
    //   updatesObj.endLoadSequence = helperOutput.updateEvent.endLoadSequence
    //   var loadSequenceInput = helperOutput.loadSequenceInput
    //   if (loadSequenceInput.length) {
    //     this.props.changingLoadSequence({
    //       variables: {
    //         input: loadSequenceInput
    //       }
    //     })
    //   }
    // }

    var loadSequenceHelperParams = {
      startDay: updatesObj.startDay,
      endDay: updatesObj.endDay,
      startTime: updatesObj.startTime,
      endTime: updatesObj.endTime,
      utcOffset: this.state.googlePlaceData.utcOffset
    }
    var helperOutput = updateEventLoadSeqAssignment(this.props.events, 'Lodging', this.state.id, loadSequenceHelperParams)
    updatesObj.startLoadSequence = helperOutput.updateEvent.startLoadSequence
    updatesObj.endLoadSequence = helperOutput.updateEvent.endLoadSequence
    var loadSequenceChanges = helperOutput.loadSequenceInput
    if (loadSequenceChanges.length) {
      this.props.changingLoadSequence({
        variables: {
          input: loadSequenceChanges
        }
      })
    }

    this.props.updateLodging({
      variables: updatesObj,
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.ItineraryId }
      }]
    }).then(resolved => {
      if (this.props.openedFromMap) {
        var focusEventObj = {
          modelId: resolved.data.updateLodging.id,
          eventType: 'Lodging',
          flightInstanceId: null
        }
        // focus obj depends on map currently clicked is start or end row
        if (this.props.currentlyFocusedEvent.start) {
          focusEventObj.day = updatesObj.startDay
          focusEventObj.start = true
          focusEventObj.loadSequence = updatesObj.startLoadSequence
        } else {
          focusEventObj.day = updatesObj.endDay
          focusEventObj.start = false
          focusEventObj.loadSequence = updatesObj.endLoadSequence
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

  deleteEvent () {
    var loadSequenceInputArr = deleteEventReassignSequence(this.props.events, 'Lodging', this.state.id)
    this.props.changingLoadSequence({
      variables: {
        input: loadSequenceInputArr
      }
    })
    this.props.deleteLodging({
      variables: {
        id: this.state.id
      },
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.ItineraryId }
      }]
    }).then(resolved => {
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
      arrivalNotes: '',
      departureNotes: '',
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
      selectedTab: 'arrival'
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

  handleFileUpload (attachmentInfo, arrivalDeparture) {
    attachmentInfo.arrivalDeparture = arrivalDeparture
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

  setBackground (previewUrl) {
    this.setState({backgroundImage: `${previewUrl}`})
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.googlePlaceData) {
      if (prevState.startDay !== this.state.startDay) {
        var locationDetails = constructLocationDetails(this.state.googlePlaceData, this.props.dates, this.state.startDay)
        this.setState({locationDetails: locationDetails})
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

    var startTime = this.props.event.startTime
    var endTime = this.props.event.endTime

    // INSTANTIATE STATE TO BE WHATEVER WAS IN DB
    console.log('event', this.props.event)
    this.setState({
      startDay: this.props.event.startDay,
      endDay: this.props.event.endDay,
      startTime: startTime, // unix or null for all day
      endTime: endTime,
      description: this.props.event.description,
      locationAlias: this.props.event.locationAlias || '',
      currency: this.props.event.currency,
      cost: this.props.event.cost,
      bookedThrough: this.props.event.bookedThrough || '',
      bookingConfirmation: this.props.event.bookingConfirmation || '',
      // notes: this.props.event.notes || '',
      arrivalNotes: this.props.event.arrivalNotes || '',
      departureNotes: this.props.event.departureNotes || '',
      backgroundImage: this.props.event.backgroundImage,
      googlePlaceData: this.props.event.location,
      attachments: this.props.event.attachments
    }, () => console.log('edit form did mount', this.state))

    // OVERRIDE WITH MAP POPUP VALUES (IF EXIST)
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

              <LocationAlias locationAlias={this.state.locationAlias} handleChange={(e) => this.handleChange(e, 'locationAlias')} />

              {/* TABS FOR CHECKIN/CHECKOUT */}
              <div>
                <h4 style={{display: 'inline-block', marginRight: '20px'}} onClick={() => this.switchTab('arrival')}>CHECK-IN</h4>
                <h4 style={{display: 'inline-block', marginRight: '20px'}} onClick={() => this.switchTab('departure')}>CHECK-OUT</h4>
              </div>

              {this.state.selectedTab === 'arrival' &&
                <div>
                  <Notes notes={this.state.arrivalNotes} handleChange={(e) => this.handleChange(e, 'arrivalNotes')} label={'Check-In Notes'} />
                  <AttachmentsRework attachments={this.state.attachments.filter(e => { return e.arrivalDeparture === 'arrival' })} ItineraryId={this.props.ItineraryId} handleFileUpload={(e) => this.handleFileUpload(e, 'arrival')} removeUpload={i => this.removeUpload(i)} setBackground={(url) => this.setBackground(url)} formType={'edit'} backgroundImage={this.state.backgroundImage} />
                </div>
              }
              {this.state.selectedTab === 'departure' &&
                <div>
                  <Notes notes={this.state.departureNotes} handleChange={(e) => this.handleChange(e, 'departureNotes')} label={'Check-Out Notes'} />
                  <AttachmentsRework attachments={this.state.attachments.filter(e => { return e.arrivalDeparture === 'departure' })} ItineraryId={this.props.ItineraryId} handleFileUpload={(e) => this.handleFileUpload(e, 'departure')} removeUpload={i => this.removeUpload(i)} setBackground={(url) => this.setBackground(url)} formType={'edit'} backgroundImage={this.state.backgroundImage} />
                </div>
              }

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
    googleCloudToken: state.googleCloudToken,
    currentlyFocusedEvent: state.currentlyFocusedEvent
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
  graphql(updateLodging, {name: 'updateLodging'}),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'}),
  graphql(deleteLodging, {name: 'deleteLodging'})
)(Radium(EditLodgingForm)))
