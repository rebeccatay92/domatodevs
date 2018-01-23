import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import Radium from 'radium'
import { retrieveCloudStorageToken } from '../../actions/cloudStorageActions'

import { createEventFormContainerStyle, createEventFormBoxShadow, createEventFormLeftPanelStyle, greyTintStyle, eventDescriptionStyle, eventDescContainerStyle, eventWarningStyle, createEventFormRightPanelStyle, attachmentsStyle, bookingNotesContainerStyle } from '../../Styles/styles'

import TransportLocationSelection from '../location/TransportLocationSelection'
import DateTimePicker from '../eventFormComponents/DateTimePicker'
import BookingDetails from '../eventFormComponents/BookingDetails'
import LocationAlias from '../eventFormComponents/LocationAlias'
import Notes from '../eventFormComponents/Notes'
import Attachments from '../eventFormComponents/Attachments'
import SubmitCancelForm from '../eventFormComponents/SubmitCancelForm'

import { updateLandTransport } from '../../apollo/landtransport'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { queryItinerary } from '../../apollo/itinerary'

import { removeAllAttachments } from '../../helpers/cloudStorage'
import { allCurrenciesList } from '../../helpers/countriesToCurrencyList'
import updateEventLoadSeqAssignment from '../../helpers/updateEventLoadSeqAssignment'
import moment from 'moment'
import { constructGooglePlaceDataObj, constructLocationDetails } from '../../helpers/location'
import newEventTimelineValidation from '../../helpers/newEventTimelineValidation'

const defaultBackground = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}landTransportDefaultBackground.jpg`

class EditLandTransportForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: this.props.event.id,
      startDay: 0,
      endDay: 0,
      startTime: null,
      endTime: null,
      departureLocationAlias: '',
      arrivalLocationAlias: '',
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
    console.log('submit state', this.state)

    var updatesObj = {
      id: this.state.id
    }
    var fieldsToCheck = ['departureLocationAlias', 'arrivalLocationAlias', 'startDay', 'endDay', 'currency', 'cost', 'bookedThrough', 'bookingConfirmation', 'notes', 'backgroundImage', 'startTime', 'endTime']
    fieldsToCheck.forEach(field => {
      if (this.props.event[field] !== this.state[field]) {
        updatesObj[field] = this.state[field]
      }
    })
    // if cost was updated, it is a str. make int.
    if (updatesObj.cost) {
      updatesObj.cost = parseInt(updatesObj.cost, 10)
    }
    // then manually add booking status, googlePlaceData, attachments
    var bookingStatus = this.state.bookingConfirmation ? true : false
    if (bookingStatus !== this.props.event.bookingStatus) {
      updatesObj.bookingStatus = bookingStatus
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
      removeAllAttachments(this.state.holderDeleteAttachments, this.apiToken)
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
    if (Object.keys(updatesObj).length <= 1) {
      this.resetState()
      this.props.toggleEditEventType()
    }

    // if time or day changes, reassign load seq
    if (updatesObj.startDay || updatesObj.endDay || updatesObj.startTime || updatesObj.endTime) {
      var updateEvent = {
        startDay: this.state.startDay,
        endDay: this.state.endDay,
        startTime: this.state.startTime,
        endTime: this.state.endTime
      }
      var helperOutput = updateEventLoadSeqAssignment(this.props.events, 'LandTransport', this.state.id, updateEvent)
      console.log('helperOutput', helperOutput)
      updatesObj.startLoadSequence = helperOutput.updateEvent.startLoadSequence
      updatesObj.endLoadSequence = helperOutput.updateEvent.endLoadSequence
      var loadSequenceInput = helperOutput.loadSequenceInput
      if (loadSequenceInput.length) {
        this.props.changingLoadSequence({
          variables: {
            input: loadSequenceInput
          }
        })
      }
    }
    this.props.updateLandTransport({
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

  closeForm () {
    removeAllAttachments(this.state.holderNewAttachments, this.apiToken)
    this.resetState()
    this.props.toggleEditEventType()
  }

  resetState () {
    this.setState({
      startDay: 0,
      endDay: 0,
      startTime: null,
      endTime: null,
      departureLocationAlias: '',
      arrivalLocationAlias: '',
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
      }
    })
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

  componentDidMount () {
    this.props.retrieveCloudStorageToken()
    this.props.cloudStorageToken.then(obj => {
      this.apiToken = obj.token
    })
    // DROPDOWN WITH ALL CURRENCIES.
    var currencyList = allCurrenciesList()
    this.setState({currencyList: currencyList})

    var startTime = this.props.event.startTime
    var endTime = this.props.event.endTime
    var defaultStartTime = moment.utc(this.props.event.startTime * 1000).format('HH:mm')
    var defaultEndTime = moment.utc(this.props.event.endTime * 1000).format('HH:mm')

    // INSTANTIATE STATE TO BE WHATEVER WAS IN DB
    console.log('event', this.props.event)
    this.setState({
      startDay: this.props.event.startDay,
      endDay: this.props.event.endDay,
      startTime: startTime, // unix or null for all day
      endTime: endTime,
      defaultStartTime: defaultStartTime, // 'HH:mm' string
      defaultEndTime: defaultEndTime,
      departureLocationAlias: this.props.event.departureLocationAlias || '',
      arrivalLocationAlias: this.props.event.arrivalLocationAlias || '',
      currency: this.props.event.currency,
      cost: this.props.event.cost,
      bookedThrough: this.props.event.bookedThrough || '',
      bookingConfirmation: this.props.event.bookingConfirmation || '',
      notes: this.props.event.notes || '',
      backgroundImage: this.props.event.backgroundImage,
      departureGooglePlaceData: this.props.event.departureLocation,
      arrivalGooglePlaceData: this.props.event.arrivalLocation,
      attachments: this.props.event.attachments
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

            <div style={eventDescContainerStyle}>
              <TransportLocationSelection selectLocation={(place, type) => this.selectLocation(place, type)} departureLocation={this.state.departureGooglePlaceData} arrivalLocation={this.state.arrivalGooglePlaceData} departureLocationDetails={this.state.departureLocationDetails} arrivalLocationDetails={this.state.arrivalLocationDetails} />
            </div>

            {/* CONTINUE PASSING DATE AND DATESARR DOWN */}
            <DateTimePicker updateDayTime={(field, value) => this.updateDayTime(field, value)} dates={this.props.dates} date={this.props.date} startDay={this.state.startDay} endDay={this.state.endDay} defaultStartTime={this.state.defaultStartTime} defaultEndTime={this.state.defaultEndTime} />
          </div>

          {/* RIGHT PANEL --- SUBMIT/CANCEL, BOOKINGNOTES */}
          <div style={createEventFormRightPanelStyle()}>
            <div style={bookingNotesContainerStyle}>
              <SubmitCancelForm handleSubmit={() => this.handleSubmit()} closeForm={() => this.closeForm()} />
              <h4 style={{fontSize: '24px'}}>Booking Details</h4>
              <BookingDetails handleChange={(e, field) => this.handleChange(e, field)} currency={this.state.currency} currencyList={this.state.currencyList} cost={this.state.cost} bookedThrough={this.state.bookedThrough} bookingConfirmation={this.state.bookingConfirmation} />
              <h4 style={{fontSize: '24px', marginTop: '50px'}}>
                  Additional Notes
              </h4>

              <LocationAlias locationAlias={this.state.departureLocationAlias} handleChange={(e) => this.handleChange(e, 'departureLocationAlias')} placeholder={'Detailed Location (Departure)'} />

              <LocationAlias locationAlias={this.state.arrivalLocationAlias} handleChange={(e) => this.handleChange(e, 'arrivalLocationAlias')} placeholder={'Detailed Location (Arrival)'} />

              <Notes notes={this.state.notes} handleChange={(e, field) => this.handleChange(e, field)} />
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
  graphql(updateLandTransport, {name: 'updateLandTransport'}),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'})
)(Radium(EditLandTransportForm)))
