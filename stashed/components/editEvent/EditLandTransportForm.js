import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import Radium from 'radium'
import { clearCurrentlyFocusedEvent } from '../../actions/mapPlannerActions'

import { createEventFormContainerStyle, createEventFormBoxShadow, createEventFormLeftPanelStyle, greyTintStyle, eventDescriptionStyle, eventDescContainerStyle, eventWarningStyle, createEventFormRightPanelStyle, attachmentsStyle, bookingNotesContainerStyle } from '../../Styles/styles'

import TransportLocationSelection from '../location/TransportLocationSelection'
import DateTimePicker from '../eventFormComponents/DateTimePicker'
import BookingDetails from '../eventFormComponents/BookingDetails'
import LocationAlias from '../eventFormComponents/LocationAlias'
import Notes from '../eventFormComponents/Notes'
import AttachmentsRework from '../eventFormComponents/AttachmentsRework'
import SaveCancelDelete from '../eventFormComponents/SaveCancelDelete'

// import { updateLandTransport, deleteLandTransport } from '../../apollo/landtransport'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { queryItinerary } from '../../apollo/itinerary'
//
// import { removeAllAttachments } from '../../helpers/cloudStorage'
// import { allCurrenciesList } from '../../helpers/countriesToCurrencyList'
// import updateEventLoadSeqAssignment from '../../helpers/updateEventLoadSeqAssignment'
// import moment from 'moment'
// import { constructGooglePlaceDataObj, constructLocationDetails } from '../../helpers/location'
// import { deleteEventReassignSequence } from '../../helpers/deleteEventReassignSequence'

const defaultBackground = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}landTransportDefaultBackground.jpg`

class EditLandTransportForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: this.props.event.id,
      startDay: 1,
      endDay: 1,
      startTime: null,
      endTime: null,
      departureLocationAlias: '',
      arrivalLocationAlias: '',
      departureNotes: '',
      arrivalNotes: '',
      cost: 0,
      currency: '',
      currencyList: [],
      bookedThrough: '',
      bookingConfirmation: '',
      attachments: [],
      holderNewAttachments: [],
      holderDeleteAttachments: [],
      backgroundImage: defaultBackground,
      departureGooglePlaceData: {},
      arrivalGooglePlaceData: {},
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
    console.log('submit state', this.state)

    var updatesObj = {
      id: this.state.id,
      startDay: this.state.startDay,
      endDay: this.state.endDay,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      currency: this.state.currency,
      cost: this.state.cost,
      departureLocationAlias: this.state.departureLocationAlias,
      arrivalLocationAlias: this.state.arrivalLocationAlias,
      bookedThrough: this.state.bookedThrough,
      bookingConfirmation: this.state.bookingConfirmation,
      bookingStatus: this.state.bookingConfirmation ? true : false,
      backgroundImage: this.state.backgroundImage,
      departureNotes: this.state.departureNotes,
      arrivalNotes: this.state.arrivalNotes
    }

    // if location changed, it doesnt contain the id field
    if (!this.state.departureGooglePlaceData.id) {
      updatesObj.departureGooglePlaceData = this.state.departureGooglePlaceData
    }
    if (!this.state.arrivalGooglePlaceData.id) {
      updatesObj.arrivalGooglePlaceData = this.state.arrivalGooglePlaceData
    }

    if (this.state.holderNewAttachments.length) {
      console.log('ADD ATTACHMENTS')
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
    if (!this.state.departureGooglePlaceData.placeId || !this.state.arrivalGooglePlaceData.placeId) {
      window.alert('location is missing')
      return
    }

    console.log('handlesubmit', updatesObj)

    // check if updatesObj has fields other than id. if yes, then send to backend
    // if (Object.keys(updatesObj).length <= 1) {
    //   this.resetState()
    //   this.props.toggleEditEventType()
    // }
    //
    // // if time or day changes, reassign load seq
    // if (updatesObj.startDay || updatesObj.endDay || updatesObj.startTime || updatesObj.endTime || updatesObj.departureGooglePlaceData || updatesObj.arrivalGooglePlaceData) {
    //   var updateEvent = {
    //     startDay: this.state.startDay,
    //     endDay: this.state.endDay,
    //     startTime: this.state.startTime,
    //     endTime: this.state.endTime,
    //     departureUtcOffset: this.state.departureGooglePlaceData.utcOffset,
    //     arrivalUtcOffset: this.state.arrivalGooglePlaceData.utcOffset
    //   }
    //   var helperOutput = updateEventLoadSeqAssignment(this.props.events, 'LandTransport', this.state.id, updateEvent)
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
      departureUtcOffset: this.state.departureGooglePlaceData.utcOffset,
      arrivalUtcOffset: this.state.arrivalGooglePlaceData.utcOffset
    }
    var helperOutput = updateEventLoadSeqAssignment(this.props.events, 'LandTransport', this.state.id, loadSequenceHelperParams)
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

    this.props.updateLandTransport({
      variables: updatesObj,
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.ItineraryId }
      }]
    }).then(resolved => {
      if (this.props.openedFromMap) {
        var focusEventObj = {
          modelId: resolved.data.updateLandTransport.id,
          eventType: 'LandTransport',
          flightInstanceId: null
        }
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
    var loadSequenceInputArr = deleteEventReassignSequence(this.props.events, 'LandTransport', this.state.id)
    this.props.changingLoadSequence({
      variables: {
        input: loadSequenceInputArr
      }
    })
    this.props.deleteLandTransport({
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
      departureLocationAlias: '',
      arrivalLocationAlias: '',
      departureNotes: '',
      arrivalNotes: '',
      cost: 0,
      currency: '',
      currencyList: [],
      bookedThrough: '',
      bookingConfirmation: '',
      attachments: [],
      holderNewAttachments: [],
      holderDeleteAttachments: [],
      backgroundImage: defaultBackground,
      departureGooglePlaceData: {},
      arrivalGooglePlaceData: {},
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
    // this.apiToken = null
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
      departureLocationAlias: this.props.event.departureLocationAlias || '',
      arrivalLocationAlias: this.props.event.arrivalLocationAlias || '',
      currency: this.props.event.currency,
      cost: this.props.event.cost,
      bookedThrough: this.props.event.bookedThrough || '',
      bookingConfirmation: this.props.event.bookingConfirmation || '',
      departureNotes: this.props.event.departureNotes || '',
      arrivalNotes: this.props.event.arrivalNotes || '',
      backgroundImage: this.props.event.backgroundImage,
      departureGooglePlaceData: this.props.event.departureLocation,
      arrivalGooglePlaceData: this.props.event.arrivalLocation,
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
    // if popup cleared location. here should set googlePlaceData to {}. even though db instantiated with location row.

    if (this.props.defaultDepartureGooglePlaceData && this.props.defaultDepartureGooglePlaceData.placeId) {
      this.setState({departureGooglePlaceData: this.props.defaultDepartureGooglePlaceData})
    } else if (this.props.defaultDepartureGooglePlaceData && !this.props.defaultDepartureGooglePlaceData.placeId) {
      // if map popup cleared departure location
      console.log('map popup cleared departure location')
      this.setState({departureGooglePlaceData: {}})
    }

    if (this.props.defaultArrivalGooglePlaceData && this.props.defaultArrivalGooglePlaceData.placeId) {
      this.setState({arrivalGooglePlaceData: this.props.defaultArrivalGooglePlaceData})
    } else if (this.props.defaultArrivalGooglePlaceData && !this.props.defaultArrivalGooglePlaceData.placeId) {
      // if map popup cleared arrival location
      console.log('map popup cleared arrival location')
      this.setState({arrivalGooglePlaceData: {}})
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

            <div style={eventDescContainerStyle}>
              <TransportLocationSelection selectLocation={(place, type) => this.selectLocation(place, type)} departureLocation={this.state.departureGooglePlaceData} arrivalLocation={this.state.arrivalGooglePlaceData} departureLocationDetails={this.state.departureLocationDetails} arrivalLocationDetails={this.state.arrivalLocationDetails} />
            </div>

            <DateTimePicker updateDayTime={(field, value) => this.updateDayTime(field, value)} dates={this.props.dates} startDay={this.state.startDay} endDay={this.state.endDay} startTimeUnix={this.state.startTime} endTimeUnix={this.state.endTime} daysArr={this.props.daysArr} />
          </div>

          {/* RIGHT PANEL --- SUBMIT/CANCEL, BOOKINGNOTES */}
          <div style={createEventFormRightPanelStyle()}>
            <div style={bookingNotesContainerStyle}>
              <h4 style={{fontSize: '24px'}}>Booking Details</h4>
              <BookingDetails handleChange={(e, field) => this.handleChange(e, field)} currency={this.state.currency} currencyList={this.state.currencyList} cost={this.state.cost} bookedThrough={this.state.bookedThrough} bookingConfirmation={this.state.bookingConfirmation} />

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
              {this.state.selectedTab === 'departure' &&
                <div>
                  {this.state.departureGooglePlaceData.name &&
                    <LocationAlias locationAlias={this.state.departureLocationAlias} handleChange={(e) => this.handleChange(e, 'departureLocationAlias')} placeholder={`Detailed Location (${this.state.departureGooglePlaceData.name})`} />
                  }
                  {!this.state.departureGooglePlaceData.name &&
                    <LocationAlias locationAlias={this.state.departureLocationAlias} handleChange={(e) => this.handleChange(e, 'departureLocationAlias')} placeholder={'Detailed Location (Departure)'} />
                  }
                  <Notes notes={this.state.departureNotes} handleChange={(e) => this.handleChange(e, 'departureNotes')} label={'Departure Notes'} />
                  <AttachmentsRework attachments={this.state.attachments.filter(e => { return e.arrivalDeparture === 'departure' })} ItineraryId={this.state.ItineraryId} handleFileUpload={(e) => this.handleFileUpload(e, 'departure')} removeUpload={i => this.removeUpload(i)} setBackground={(url) => this.setBackground(url)} formType={'edit'} backgroundImage={this.state.backgroundImage} />
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
                  <AttachmentsRework attachments={this.state.attachments.filter(e => { return e.arrivalDeparture === 'arrival' })} ItineraryId={this.props.ItineraryId} handleFileUpload={(e) => this.handleFileUpload(e, 'arrival')} removeUpload={i => this.removeUpload(i)} setBackground={(url) => this.setBackground(url)} formType={'edit'} backgroundImage={this.state.backgroundImage} />
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
  // graphql(updateLandTransport, {name: 'updateLandTransport'}),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'}),
  // graphql(deleteLandTransport, {name: 'deleteLandTransport'})
)(Radium(EditLandTransportForm)))
