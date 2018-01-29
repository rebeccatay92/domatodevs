import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import Radium from 'radium'
import moment from 'moment'
import { retrieveCloudStorageToken } from '../../actions/cloudStorageActions'
import { Button } from 'react-bootstrap'

import { labelStyle, createEventFormContainerStyle, createEventFormBoxShadow, createEventFormLeftPanelStyle, greyTintStyle, eventDescriptionStyle, eventDescContainerStyle, createEventFormRightPanelStyle, attachmentsStyle, bookingNotesContainerStyle, createFlightButtonStyle } from '../../Styles/styles'

import FlightSearchParameters from '../eventFormComponents/FlightSearchParameters'
import FlightSearchResults from '../eventFormComponents/FlightSearchResults'
import FlightSearchDetailsContainer from '../eventFormComponents/FlightSearchDetailsContainer'
import FlightDetailsContainerRework from '../eventFormComponents/FlightDetailsContainerRework'

import BookingDetails from '../eventFormComponents/BookingDetails'
import FlightInstanceNotesAttachments from '../eventFormComponents/FlightInstanceNotesAttachments'
import SubmitCancelForm from '../eventFormComponents/SubmitCancelForm'
import SaveCancelDelete from '../eventFormComponents/SaveCancelDelete'

import { createFlightBooking } from '../../apollo/flight'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { queryItinerary, updateItineraryDetails } from '../../apollo/itinerary'

import { removeAllAttachments } from '../../helpers/cloudStorage'
import { allCurrenciesList } from '../../helpers/countriesToCurrencyList'
import newEventLoadSeqAssignment from
 '../../helpers/newEventLoadSeqAssignment'
import { validateIntervals } from '../../helpers/intervalValidationTesting'

const defaultBackground = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}flightDefaultBackground.jpg`

class CreateFlightForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currencyList: [], // not submitted
      ItineraryId: this.props.ItineraryId,
      paxAdults: null,
      paxChildren: null,
      paxInfants: null,
      cost: 0,
      currency: '',
      classCode: '',
      departureIATA: '',
      arrivalIATA: '',
      departureName: '',
      arrivalName: '',
      departureDate: null,
      returnDate: null,
      bookedThrough: '',
      bookingConfirmation: '',
      backgroundImage: defaultBackground,
      flightInstances: [],
      // ARR OF FLIGHTINSTANCE INPUT
      // input createFlightInstanceInput {
      //   flightNumber: Int
      //   airlineCode: String
      //   airlineName: String
      //   departureIATA: String
      //   arrivalIATA: String
      //   departureAirport: String
      //   arrivalAirport: String
      //   departureTerminal: String
      //   arrivalTerminal: String
      //   departureGate: String
      //   arrivalGate: String
      //   startDay: Int
      //   endDay: Int
      //   startTime: Int
      //   endTime: Int
      //   startLoadSequence: Int
      //   endLoadSequence: Int
      //   departureNotes: String
      //   arrivalNotes: String,
      //   attachments: [attachmentInput]
      // }
      flights: [],
      searching: false,
      bookingDetails: false,
      selected: 0,
      tripType: '',
      searchClicked: 1,
      instanceTabIndex: 0
    }
  }

  handleSearch (flights, tripType, adults, children, infants, classCode, departureIATA, arrivalIATA, departureName, arrivalName, departureDate, returnDate) {
    this.setState({
      flights,
      tripType: tripType,
      paxAdults: adults,
      paxChildren: children,
      paxInfants: infants,
      classCode: classCode,
      searching: true,
      departureIATA: departureIATA,
      arrivalIATA: arrivalIATA,
      departureName: departureName,
      arrivalName: arrivalName
    }, () => {
      this.handleSelectFlight(0)
    })
    if (departureDate) {
      this.setState({departureDate: departureDate.utc().unix()})
    }
    if (returnDate) {
      this.setState({returnDate: returnDate.utc().unix()})
    }
    console.log('HANDLE SEARCH', this.state)
  }

  handleSubmit () {
    var bookingStatus = this.state.bookingConfirmation ? true : false

    var newFlight = {
      ItineraryId: parseInt(this.state.ItineraryId, 10),
      paxAdults: this.state.paxAdults,
      paxChildren: this.state.paxChildren,
      paxInfants: this.state.paxInfants,
      cost: this.state.cost,
      currency: this.state.currency,
      classCode: this.state.classCode,
      departureIATA: this.state.departureIATA,
      arrivalIATA: this.state.arrivalIATA,
      departureName: this.state.departureName,
      arrivalName: this.state.arrivalName,
      departureDate: this.state.departureDate,
      returnDate: this.state.returnDate,
      bookingStatus: bookingStatus,
      bookedThrough: this.state.bookedThrough,
      bookingConfirmation: this.state.bookingConfirmation,
      backgroundImage: this.state.backgroundImage,
      flightInstances: this.state.flightInstances
    }

    if (newFlight.flightInstances[newFlight.flightInstances.length - 1].endDay > this.props.dates.length) {
      this.props.updateItineraryDetails({
        variables: {
          id: this.props.ItineraryId,
          days: newFlight.flightInstances[newFlight.flightInstances.length - 1].endDay
        }
      })
    }
    console.log('newFlight', newFlight)

    // REWRITTEN FUNCTION TO VALIDATE
    var eventObjArr = newFlight.flightInstances.map(e => {
      return {
        startDay: e.startDay,
        endDay: e.endDay,
        startTime: e.startTime,
        endTime: e.endTime,
        departureIATA: e.departureIATA,
        arrivalIATA: e.arrivalIATA
      }
    })
    var isError = validateIntervals(this.props.events, eventObjArr, 'Flight')
    console.log('isError', isError)

    if (isError) {
      window.alert('timing clashes detected')
    }

    var helperOutput = newEventLoadSeqAssignment(this.props.events, 'Flight', newFlight.flightInstances)
    console.log('helper output', helperOutput)

    this.props.changingLoadSequence({
      variables: {
        input: helperOutput.loadSequenceInput
      }
    })

    newFlight.flightInstances = helperOutput.newEvent

    console.log('BEFORE SUBMIT', newFlight)
    this.props.createFlightBooking({
      variables: newFlight,
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.ItineraryId }
      }]
    })

    this.resetState()
    this.props.toggleCreateEventType()
  }

  closeForm () {
    // REMOVE ALL ATTACHMENTS FROM FLIGHT INSTANCES
    this.state.flightInstances.forEach(instance => {
      removeAllAttachments(instance.attachments, this.apiToken)
    })
    this.resetState()
    this.props.toggleCreateEventType()
  }

  resetState () {
    this.setState({
      paxAdults: null,
      paxChildren: null,
      paxInfants: null,
      cost: 0,
      currency: '',
      classCode: '',
      departureIATA: '',
      arrivalIATA: '',
      departureName: '',
      arrivalName: '',
      departureDate: null,
      returnDate: null,
      bookedThrough: '',
      bookingConfirmation: '',
      backgroundImage: defaultBackground,
      flightInstances: [],
      flights: [], // clear flight search results
      searching: false,
      bookingDetails: false,
      selected: 0,
      tripType: '',
      searchClicked: 1,
      instanceTabIndex: 0
    })
  }

  setBackground (previewUrl) {
    this.setState({backgroundImage: `${previewUrl}`})
  }

  handleSelectFlight (index) {
    const datesUnix = this.props.dates.map(e => {
      return moment(e).unix()
    })
    // console.log('dates unix arr', datesUnix)

    this.setState({
      selected: index,
      cost: this.state.flights[index].cost,
      currency: this.state.flights[index].currency,
      flightInstances: this.state.flights[index].flights.map((flight, i) => {
        const startDayUnix = moment.utc(flight.departureDateTime.slice(0, 10)).unix()
        const endDayUnix = moment.utc(flight.arrivalDateTime.slice(0, 10)).unix()

        var startDayInt = (startDayUnix - datesUnix[0]) / 86400 + 1
        var endDayInt = (endDayUnix - datesUnix[0]) / 86400 + 1

        const startTime = moment.utc(flight.departureDateTime).unix() - startDayUnix
        const endTime = moment.utc(flight.arrivalDateTime).unix() - endDayUnix

        return {
          flightNumber: flight.flightNum,
          airlineCode: flight.carrierCode,
          airlineName: flight.airlineName,
          departureIATA: flight.departureAirportCode,
          arrivalIATA: flight.arrivalAirportCode,
          departureAirport: flight.departureLocation,
          arrivalAirport: flight.arrivalLocation,
          departureCityCountry: flight.departureCityCountry,
          arrivalCityCountry: flight.arrivalCityCountry,
          departureTerminal: flight.departureTerminal,
          arrivalTerminal: flight.arrivalTerminal,
          startDay: startDayInt,
          endDay: endDayInt,
          startTime: startTime,
          endTime: endTime,
          durationMins: flight.duration,
          departureNotes: '',
          arrivalNotes: '',
          attachments: [],
          firstFlight: i === 0
        }
      })
    }, () => {
      this.setState({instanceTabIndex: 0}, () => console.log('handle select flight', this.state))
    })
    // on flight confirm, initialize first tab immediately. but only after flightInstances hv been set (callback)
  }

  handleChange (e, field, subfield, index) {
    if (subfield) {
      let newState = this.state[field].slice(0)
      newState[index][subfield] = e.target.value
      this.setState({
        [field]: newState
      })
      // console.log(this.state)
    } else {
      this.setState({
        [field]: e.target.value
      })
    }
  }

  handleFlightInstanceChange (updatedInstance) {
    // reconstruct flight instance arr
    var index = this.state.instanceTabIndex
    var flightInstancesClone = JSON.parse(JSON.stringify(this.state.flightInstances))
    var updatedArr = flightInstancesClone.slice(0, index).concat(updatedInstance).concat(flightInstancesClone.slice(index + 1))
    this.setState({flightInstances: updatedArr}, () => console.log('after set state', this.state.flightInstances))
  }

  switchInstanceTab (i) {
    this.setState({instanceTabIndex: i})
  }

  componentDidMount () {
    this.props.retrieveCloudStorageToken()

    this.props.cloudStorageToken.then(obj => {
      this.apiToken = obj.token
    })

    // AIRHOB USING USD. FOR FUTURE USE
    var currencyList = allCurrenciesList()
    this.setState({currencyList: currencyList})
    this.setState({currency: currencyList[0]})
  }

  render () {
    return (
      <div style={createEventFormContainerStyle}>
        {/* BOX SHADOW WRAPS LEFT AND RIGHT PANEL ONLY */}
        <div style={createEventFormBoxShadow}>

          {/* LEFT PANEL --- LOCATION X 2, DATE DAY X 2, PAX, SELECTED FLIGHT */}
          <div style={createEventFormLeftPanelStyle(this.state.backgroundImage, 'flight')}>
            <div style={greyTintStyle} />
            <div style={eventDescContainerStyle}>
              <FlightSearchParameters searchClicked={this.state.searchClicked} bookingDetails={this.state.bookingDetails} searching={this.state.searching} dates={this.props.dates} date={this.props.date} handleSearch={(flights, tripType, adults, children, infants, classCode, departureIATA, arrivalIATA, departureName, arrivalName, departureDate, returnDate) => this.handleSearch(flights, tripType, adults, children, infants, classCode, departureIATA, arrivalIATA, departureName, arrivalName, departureDate, returnDate)} closeForm={() => this.closeForm()} />

              {/* REFACTOR SO CREATE AND EDIT FORM USE SAME DETAILS CONTAINER. PASS ONLY SELECTED FLIGHT DOWN */}
              {(this.state.searching || (!this.state.searching && this.state.bookingDetails)) &&
                <FlightDetailsContainerRework flightInstances={this.state.flightInstances} returnTrip={this.state.returnDate} dates={this.props.dates} />
              }
            </div>
          </div>
          {/* RESULTS PANEL(CHILD OF SEARCH PARAMS) */}

          {/* RIGHT PANEL --- SUBMIT/CANCEL, BOOKINGS, MULTIPLE DETAILS/NOTES */}
          <div style={createEventFormRightPanelStyle('flight')}>
            <div style={bookingNotesContainerStyle}>
              <SubmitCancelForm flight handleSubmit={() => this.handleSubmit()} closeForm={() => this.closeForm()} />
              {this.state.bookingDetails && (
                <div>
                  <h4 style={{fontSize: '24px'}}>Booking Details</h4>
                  <BookingDetails flight handleChange={(e, field) => this.handleChange(e, field)} currency={this.state.currency} currencyList={this.state.currencyList} cost={this.state.cost} />
                  {/* TAB FLIGHT INSTANCES WITH NOTES AND ATTACHMENTS */}
                  {this.state.flightInstances.map((instance, i) => {
                    return (
                      <h3 onClick={() => this.switchInstanceTab(i)} style={{display: 'inline-block', marginRight: '20px'}} key={'instance' + i}>{instance.departureIATA} to {instance.arrivalIATA}</h3>
                    )
                  })}
                  <FlightInstanceNotesAttachments ItineraryId={this.props.ItineraryId} instance={this.state.flightInstances[this.state.instanceTabIndex]} handleFlightInstanceChange={(updatedInstance) => this.handleFlightInstanceChange(updatedInstance)} setBackground={url => this.setBackground(url)} backgroundImage={this.state.backgroundImage} />
                </div>
              )}
              <div style={{width: '100%', height: '91%', margin: '2% 0 6% 0', overflowY: 'auto'}}>
                {this.state.searching && <FlightSearchResults flights={this.state.flights} searching={this.state.searching} selected={this.state.selected} handleSelectFlight={(index) => this.handleSelectFlight(index)} tripType={this.state.tripType} />}
              </div>
            </div>
            <div style={{position: 'absolute', right: '0', bottom: '0', padding: '10px'}}>
              {this.state.searching && <Button bsStyle='danger' style={{...createFlightButtonStyle, ...{marginRight: '10px'}}} onClick={() => this.setState({searchClicked: this.state.searchClicked + 1})}>Search</Button>}
              {this.state.searching && <Button bsStyle='danger' style={createFlightButtonStyle} onClick={() => {
                this.setState({
                  searching: false,
                  bookingDetails: true
                })
              }}>Confirm</Button>}

              {this.state.bookingDetails && <Button bsStyle='danger' style={{...createFlightButtonStyle, ...{marginRight: '10px'}}} onClick={() => this.setState({bookingDetails: false, searching: true})}>Back</Button>}
              {this.state.bookingDetails && <Button bsStyle='danger' style={createFlightButtonStyle} onClick={() => this.handleSubmit()}>Save</Button>}

              {/* {this.state.bookingDetails &&
                <SaveCancelDelete handleSubmit={() => this.handleSubmit()} closeForm={() => this.closeForm()} />
              } */}
            </div>
          </div>

        </div>
        {/* BOTTOM PANEL --- ATTACHMENTS */}
        {/* <div style={attachmentsStyle}>
          <Attachments handleFileUpload={(e) => this.handleFileUpload(e)} attachments={this.state.attachments} ItineraryId={this.state.ItineraryId} removeUpload={i => this.removeUpload(i)} setBackground={url => this.setBackground(url)} />
        </div> */}
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
  graphql(createFlightBooking, {name: 'createFlightBooking'}),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'}),
  graphql(updateItineraryDetails, {name: 'updateItineraryDetails'})
)(Radium(CreateFlightForm)))
