import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import Radium from 'radium'
import moment from 'moment'
import { retrieveCloudStorageToken } from '../../actions/cloudStorageActions'
import { Button } from 'react-bootstrap'

import { labelStyle, createEventFormContainerStyle, createEventFormBoxShadow, createEventFormLeftPanelStyle, greyTintStyle, eventDescriptionStyle, eventDescContainerStyle, createEventFormRightPanelStyle, attachmentsStyle, bookingNotesContainerStyle, createFlightButtonStyle } from '../../Styles/styles'

import EditFormAirhobParams from '../eventFormComponents/EditFormAirhobParams'
import EditFormFlightDetailsContainer from '../eventFormComponents/EditFormFlightDetailsContainer'

// import FlightSearchParameters from '../eventFormComponents/FlightSearchParameters'
// import FlightSearchResults from '../eventFormComponents/FlightSearchResults'
// import FlightSearchDetailsContainer from '../eventFormComponents/FlightSearchDetailsContainer'
import BookingDetails from '../eventFormComponents/BookingDetails'
import Notes from '../eventFormComponents/Notes'

import Attachments from '../eventFormComponents/Attachments'

import { findFlightBooking, updateFlightBooking } from '../../apollo/flight'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { queryItinerary, updateItineraryDetails } from '../../apollo/itinerary'

import { removeAllAttachments } from '../../helpers/cloudStorage'
import { allCurrenciesList } from '../../helpers/countriesToCurrencyList'
import updateEventLoadSeqAssignment from
 '../../helpers/updateEventLoadSeqAssignment'

const defaultBackground = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}flightDefaultBackground.jpg`

class EditFlightForm extends Component {
  constructor (props) {
    super(props)
    // this.state = {
    //   ItineraryId: this.props.ItineraryId,
    //   flights: [],
    //   searching: false,
    //   bookingDetails: false,
    //   selected: 0,
    //   tripType: '',
    //   flightDetailsPage: 1,
    //   searchClicked: 1
    // }
    this.state = {
      id: null,
      paxAdults: 0,
      paxChildren: 0,
      paxInfants: 0,
      cost: 0,
      currency: '',
      classCode: '',
      departureDate: null,
      returnDate: null,
      departureIATA: '',
      arrivalIATA: '',
      currencyList: [],
      bookedThrough: '',
      bookingConfirmation: '',
      backgroundImage: defaultBackground,
      attachments: [],
      holderNewAttachments: [],
      holderDeleteAttachments: [],
      flightInstances: []
      /*
      flightInstance data structure
      {
      id
      FlightBookingId
      flightNumber
      airlineCode
      airlineName
      departureLocation
      arrivalLocation
      departureTerminal
      arrivalTerminal
      departureGate
      arrivalGate
      startDay
      endDay
      startTime
      endTime
      startLoadSequence
      endLoadSequence
      notes
      firstFlight
      }
      */
    }
  }

  // handleSearch (flights, tripType, adults, children, infants, classCode) {
  //   this.setState({
  //     flights,
  //     tripType: tripType,
  //     paxAdults: adults,
  //     paxChildren: children,
  //     paxInfants: infants,
  //     classCode: classCode,
  //     searching: true
  //   })
  //   console.log(this.state)
  // }

  handleSubmit () {
    var updatesObj = {
      id: this.state.id
    }
    var bookingFieldsToCheck = ['paxAdults', 'paxChildren', 'paxInfants', 'cost', 'currency', 'classCode', 'bookedThrough', 'bookingConfirmation', 'backgroundImage']
    // check booking status
    var bookingStatus = this.state.bookingConfirmation ? true : false
    if (bookingStatus !== this.props.data.findFlightBooking.bookingStatus) {
      updatesObj.bookingStatus = bookingStatus
    }

    // deal with attachments
    // if (this.state.holderNewAttachments.length) {
    //   updatesObj.addAttachments = this.state.holderNewAttachments
    // }
    // if (this.state.holderDeleteAttachments.length) {
    //   removeAllAttachments(this.state.holderDeleteAttachments, this.apiToken)
    //   updatesObj.removeAttachments = this.state.holderDeleteAttachments.map(e => {
    //     return e.id
    //   })
    // }

    // check for updates to flight instances
  }

  closeForm () {
    removeAllAttachments(this.state.holderNewAttachments, this.apiToken)
    this.resetState()
    this.props.toggleEditEventType()
  }

  resetState () {
    this.setState({
      id: null,
      paxAdults: 0,
      paxChildren: 0,
      paxInfants: 0,
      cost: 0,
      currency: '',
      classCode: '',
      departureDate: null,
      returnDate: null,
      departureIATA: '',
      arrivalIATA: '',
      bookedThrough: '',
      bookingConfirmation: '',
      backgroundImage: defaultBackground,
      attachments: [],
      holderNewAttachments: [],
      holderDeleteAttachments: [],
      flightInstances: []
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

  // handleSelectFlight (index) {
  //   const datesUnix = this.props.dates.map(e => {
  //     return moment(e).unix()
  //   })
  //   console.log(datesUnix)
  //   this.setState({
  //     selected: index,
  //     flightDetailsPage: 1,
  //     flightInstances: this.state.flights[index].flights.map((flight, i) => {
  //       const startDayUnix = moment.utc(flight.departureDateTime.slice(0, 10)).unix()
  //       const endDayUnix = moment.utc(flight.arrivalDateTime.slice(0, 10)).unix()
  //       const startTime = moment.utc(flight.departureDateTime).unix() - startDayUnix
  //       const endTime = moment.utc(flight.arrivalDateTime).unix() - endDayUnix
  //       console.log(startTime, endTime)
  //       return {
  //         flightNumber: flight.flightNum,
  //         airlineCode: flight.carrierCode,
  //         airlineName: flight.airlineName,
  //         departureIATA: flight.departureAirportCode,
  //         arrivalIATA: flight.arrivalAirportCode,
  //         departureTerminal: flight.departureTerminal,
  //         arrivalTerminal: flight.arrivalTerminal,
  //         startDay: datesUnix.indexOf(startDayUnix) + 1 ? datesUnix.indexOf(startDayUnix) + 1 : datesUnix.length + (startDayUnix - datesUnix[datesUnix.length - 1]) / 86400,
  //         endDay: datesUnix.indexOf(endDayUnix) + 1 ? datesUnix.indexOf(endDayUnix) + 1 : datesUnix.length + (endDayUnix - datesUnix[datesUnix.length - 1]) / 86400,
  //         startTime: startTime,
  //         endTime: endTime,
  //         // startLoadSequence: 1,
  //         // endLoadSequence: 2,
  //         notes: 'testing load seq assignments',
  //         firstFlight: i === 0
  //       }
  //     })
  //   })
  //   console.log(this.state)
  // }

  handleChange (e, field, subfield, index) {
    if (subfield) {
      var instanceClone = JSON.parse(JSON.stringify(this.state.flightInstances[index]))
      instanceClone[subfield] = e.target.value
      var newState = (this.state.flightInstances.slice(0, index)).concat(instanceClone).concat(this.state.flightInstances.slice(index + 1))
      this.setState({
        flightInstances: newState
      }, () => console.log('state', this.state))
    } else {
      this.setState({
        [field]: e.target.value
      }, () => console.log('state', this.state))
    }
  }

  componentDidMount () {
    this.props.retrieveCloudStorageToken()
    this.props.cloudStorageToken.then(obj => {
      this.apiToken = obj.token
    })
    var currencyList = allCurrenciesList()
    this.setState({currencyList: currencyList})
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data.findFlightBooking) {
      var booking = nextProps.data.findFlightBooking
      // INITIALIZE DATA FROM DB
      this.setState({
        id: booking.id,
        paxAdults: booking.paxAdults,
        paxChildren: booking.paxChildren,
        paxInfants: booking.paxInfants,
        cost: booking.cost,
        currency: booking.currency,
        departureDate: booking.departureDate,
        returnDate: booking.returnDate,
        departureIATA: booking.departureIATA,
        arrivalIATA: booking.arrivalIATA,
        classCode: booking.classCode,
        bookingStatus: booking.bookingStatus,
        bookedThrough: booking.bookedThrough,
        bookingConfirmation: booking.bookingConfirmation,
        backgroundImage: booking.backgroundImage,
        attachments: booking.attachments,
        flightInstances: booking.flightInstances
      })
    }
  }

  render () {
    return (
      <div style={createEventFormContainerStyle}>
        {/* BOX SHADOW WRAPS LEFT AND RIGHT PANEL ONLY */}
        <div style={createEventFormBoxShadow}>

          <div style={createEventFormLeftPanelStyle(this.state.backgroundImage, 'flight')}>
            <div style={greyTintStyle} />
            {/* SEARCH PARAMS FOR AIRHOB */}
            <EditFormAirhobParams paxAdults={this.state.paxAdults} paxChildren={this.state.paxChildren} paxInfants={this.state.paxInfants} classCode={this.state.classCode} departureDate={this.state.departureDate} returnDate={this.state.returnDate} dates={this.props.dates} departureIATA={this.state.departureIATA} arrivalIATA={this.state.arrivalIATA} />
            <EditFormFlightDetailsContainer />
          </div>

          <div style={createEventFormRightPanelStyle('flight')}>
            <div style={bookingNotesContainerStyle}>
              <div>
                <h4 style={{fontSize: '24px'}}>Booking Details</h4>
                <BookingDetails flight handleChange={(e, field) => this.handleChange(e, field)} currency={this.state.currency} currencyList={this.state.currencyList} cost={this.state.cost} bookedThrough={this.state.bookedThrough} bookingConfirmation={this.state.bookingConfirmation} />

                {/* flight instances. gate and notes */}
                {this.state.flightInstances.map((instance, i) => {
                  return (
                    <div key={i}>
                      <h4 style={{fontSize: '24px'}} key={i}>{instance.departureIATA} to {instance.arrivalIATA}</h4>
                      <div style={{display: 'inline-block', width: '40%'}}>
                        <label style={labelStyle}>
                          Departure Gate
                        </label>
                        <input style={{width: '90%'}} type='text' name='departureGate' value={instance.departureGate} onChange={(e) => this.handleChange(e, 'flightInstances', 'departureGate', i)} />
                        <label style={labelStyle}>
                          Arrival Gate
                        </label>
                        <input style={{width: '90%'}} type='text' name='arrivalGate' value={instance.arrivalGate} onChange={(e) => this.handleChange(e, 'flightInstances', 'arrivalGate', i)} />
                      </div>
                      <div style={{display: 'inline-block', width: '50%', verticalAlign: 'top'}}>
                        <Notes flight index={i} notes={instance.notes} handleChange={(e, field, subfield, index) => this.handleChange(e, field, subfield, index)} />
                      </div>
                    </div>
                  )
                })}
              </div>
              {/* <div style={{width: '100%', height: '91%', margin: '2% 0 6% 0', overflowY: 'auto'}}>
                {this.state.searching && <FlightSearchResults flights={this.state.flights} searching={this.state.searching} selected={this.state.selected} handleSelectFlight={(index) => this.handleSelectFlight(index)} tripType={this.state.tripType} />}
              </div> */}
            </div>
            <div style={{position: 'absolute', right: '0', bottom: '0', padding: '10px'}}>
              {/* {this.state.searching && <Button bsStyle='danger' style={{...createFlightButtonStyle, ...{marginRight: '10px'}}} onClick={() => this.setState({searchClicked: this.state.searchClicked + 1})}>Search</Button>}
              {this.state.searching && <Button bsStyle='danger' style={createFlightButtonStyle} onClick={() => {
                this.setState({
                  searching: false,
                  bookingDetails: true
                })
              }}>Confirm</Button>} */}
              <Button bsStyle='danger' style={{...createFlightButtonStyle, ...{marginRight: '10px'}}} onClick={() => this.closeForm()}>Cancel</Button>
              <Button bsStyle='danger' style={createFlightButtonStyle} onClick={() => this.handleSubmit()}>Save</Button>
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

const options = {
  options: props => ({
    variables: {
      id: props.event.FlightBooking.id
    }
  })
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
  graphql(findFlightBooking, options),
  graphql(updateFlightBooking, {name: 'updateFlightBooking'}),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'}),
  graphql(updateItineraryDetails, {name: 'updateItineraryDetails'})
)(Radium(EditFlightForm)))
