import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import Radium from 'radium'
import moment from 'moment'
import { retrieveCloudStorageToken } from '../../actions/cloudStorageActions'
import { Button } from 'react-bootstrap'

import { labelStyle, createFlightFormContainerStyle, createEventFormBoxShadow, createEventFormLeftPanelStyle, greyTintStyle, eventDescriptionStyle, eventDescContainerStyle, createEventFormRightPanelStyle, attachmentsStyle, bookingNotesContainerStyle, createFlightButtonStyle } from '../../Styles/styles'

import EditFormAirhobParams from '../eventFormComponents/EditFormAirhobParams'
import FlightDetailsContainerRework from '../eventFormComponents/FlightDetailsContainerRework'
import EditFormAirhobSearchParams from '../eventFormComponents/EditFormAirhobSearchParams'

import FlightSearchResults from '../eventFormComponents/FlightSearchResults'
import BookingDetails from '../eventFormComponents/BookingDetails'
import FlightInstanceNotesAttachments from '../eventFormComponents/FlightInstanceNotesAttachments'
import SaveCancelDelete from '../eventFormComponents/SaveCancelDelete'
import EditingFlightDetails from '../eventFormComponents/EditingFlightDetails'

import { findFlightBooking, updateFlightBooking, deleteFlightBooking } from '../../apollo/flight'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { queryItinerary, updateItineraryDetails } from '../../apollo/itinerary'

import { removeAllAttachments } from '../../helpers/cloudStorage'
import { allCurrenciesList } from '../../helpers/countriesToCurrencyList'
import updateEventLoadSeqAssignment from
 '../../helpers/updateEventLoadSeqAssignment'
import { deleteEventReassignSequence } from '../../helpers/deleteEventReassignSequence'

const defaultBackground = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}flightDefaultBackground.jpg`

class EditFlightForm extends Component {
  constructor (props) {
    super(props)
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
      departureName: '',
      arrivalName: '',
      currencyList: [],
      bookedThrough: '',
      bookingConfirmation: '',
      backgroundImage: defaultBackground,
      flightInstances: [],
      instanceTabIndex: 0,
      editingFlightDetails: false, // needs to know whether departing, returning.
      // for search state
      changedFlight: false,
      searching: false,
      flights: [], // flight search results from airhob
      tripType: '', // 'O' or 'R'
      selected: 0,
      searchFlightInstances: [],
      // for storing search params classCode pax etc without affecting editForm state
      searchParams: {},
      searchedCostCurrency: {cost: 0, currency: ''},
      // if flight has changed, old instances hv attachments in the cloud. dump if changed flight is submitted to backend
      attachmentsToDumpIfFlightChange: [],
      datesArr: [] // PROPS.DATES CONVERT TO UNIX ARR, PASS TO FLIGHT DETAILS CONTAINER
    }
  }

  searchFlight () {
    this.setState({searching: true})
  }

  // UPDATE TO INCLUDE NEW FIELDS
  handleSearch (flights, tripType, adults, children, infants, classCode, departureIATA, arrivalIATA, departureName, arrivalName, departureDate, returnDate) {
    console.log('details are hoisted up to editFlightForm')
    var searchParams = {
      paxAdults: adults,
      paxChildren: children,
      paxInfants: infants,
      classCode: classCode,
      departureIATA: departureIATA,
      arrivalIATA: arrivalIATA,
      departureName: departureName,
      arrivalName: arrivalName
    }
    if (departureDate) {
      searchParams.departureDate = departureDate.utc().unix()
    }
    if (returnDate) {
      searchParams.returnDate = returnDate.utc().unix()
    }
    this.setState({
      flights: flights,
      tripType: tripType,
      searchParams: searchParams
    }, () => this.handleSelectFlight(0))
  }

  handleSubmit () {
    var updatesObj = {
      id: this.state.id
    }
    var bookingFieldsToCheck = ['paxAdults', 'paxChildren', 'paxInfants', 'cost', 'currency', 'classCode', 'departureIATA', 'arrivalIATA', 'departureDate', 'returnDate', 'departureName', 'arrivalName', 'bookedThrough', 'bookingConfirmation', 'backgroundImage']
    bookingFieldsToCheck.forEach(field => {
      if (this.state[field] !== this.props.data.findFlightBooking[field]) {
        updatesObj[field] = this.state[field]
      }
    })
    // check booking status
    var bookingStatus = this.state.bookingConfirmation ? true : false
    if (bookingStatus !== this.props.data.findFlightBooking.bookingStatus) {
      updatesObj.bookingStatus = bookingStatus
    }

    // if flight instances not changed, rename holderNewAttachments to addAttachments, extract IDs only for removeAttachments
    if (!this.state.changedFlight) {
      var reconstructedInstanceArr = this.state.flightInstances.map(instance => {
        var reconstructed = {}
        Object.keys(instance).forEach(key => {
          if (key !== 'attachments' && key !== 'holderNewAttachments' && key !== 'holderDeleteAttachments') {
            reconstructed[key] = instance[key]
          }
          if (instance.holderNewAttachments.length) {
            reconstructed.addAttachments = instance.holderNewAttachments
          }
          if (instance.holderDeleteAttachments.length) {
            reconstructed.removeAttachments = instance.holderDeleteAttachments.map(e => {
              return e.id
            })
          }
        })
        return reconstructed
      })
      updatesObj.flightInstances = reconstructedInstanceArr
    } else {
      // if flight changed, dump attachments from old instances out of cloud
      removeAllAttachments(this.state.attachmentsToDumpIfFlightChange, this.apiToken)
      // no need to touch attachments. holder arrs not in search flight instances
      updatesObj.flightInstances = this.state.flightInstances
      updatesObj.changedFlight = true
    }
    console.log('updatesObj', updatesObj)

    if (updatesObj.flightInstances[updatesObj.flightInstances.length - 1].endDay > this.props.dates.length) {
      this.props.updateItineraryDetails({
        variables: {
          id: this.props.ItineraryId,
          days: updatesObj.flightInstances[updatesObj.flightInstances.length - 1].endDay
        }
      })
    }
    var helperOutput = updateEventLoadSeqAssignment(this.props.events, 'Flight', this.state.id, JSON.parse(JSON.stringify(updatesObj.flightInstances)))
    // console.log('helperOutput', helperOutput)

    updatesObj.flightInstances.forEach((instance, i) => {
      instance.startLoadSequence = helperOutput.updateEvent[i].startLoadSequence
      instance.endLoadSequence = helperOutput.updateEvent[i].endLoadSequence
    })
    console.log('after load seq assign', updatesObj)

    // remove properties that graphql cant accept
    var reconstructedInstancesArr = updatesObj.flightInstances.map((instance, i) => {
      var reconstruct = {}
      Object.keys(instance).forEach(key => {
        if (key !== 'departureLocation' && key !== 'arrivalLocation' & key !== '__typename') {
          reconstruct[key] = instance[key]
        }
      })
      return reconstruct
    })
    updatesObj.flightInstances = reconstructedInstancesArr
    // console.log('scrubbing out instance properties', updatesObj)

    this.props.changingLoadSequence({
      variables: {
        input: helperOutput.loadSequenceInput
      }
    })

    this.props.updateFlightBooking({
      variables: updatesObj,
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.ItineraryId }
      }]
    })

    this.resetState()
    this.props.toggleEditEventType()
  }

  closeForm () {
    // remove from cloud stuff which has not yet been passed to backend. depending on whether flight has changed
    this.state.flightInstances.forEach(instance => {
      if (this.state.changedFlight) {
        removeAllAttachments(instance.attachments, this.apiToken)
      } else {
        removeAllAttachments(instance.holderNewAttachments, this.apiToken)
      }
    })
    this.resetState()
    this.props.toggleEditEventType()
  }

  deleteEvent () {
    var loadSequenceInputArr = deleteEventReassignSequence(this.props.events, 'Flight', this.state.id)

    this.props.changingLoadSequence({
      variables: {
        input: loadSequenceInputArr
      }
    })
    this.props.deleteFlightBooking({
      variables: {
        id: this.state.id
      },
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.ItineraryId }
      }]
    })
    this.closeForm()
    // close form will remove cloud attachments that are not yet passed to db
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
      departureName: '',
      arrivalName: '',
      bookedThrough: '',
      bookingConfirmation: '',
      backgroundImage: defaultBackground,
      flightInstances: [],
      instanceTabIndex: 0,
      instance: {},
      // for searching
      changedFlight: false,
      searching: false,
      flights: [],
      tripType: '',
      selected: 0,
      searchFlightInstances: [],
      searchParams: {},
      searchedCostCurrency: {cost: 0, currency: ''}
    })
  }

  setBackground (previewUrl) {
    this.setState({backgroundImage: `${previewUrl}`})
  }

  returnToForm () {
    this.setState({searching: false})
  }

  toggleEditingFlightDetails () {
    this.setState({editingFlightDetails: !this.state.editingFlightDetails})
  }

  editFlightDetailsConfirm (instances) {
    // replace flight instances with edited ones
    this.setState({flightInstances: instances})
  }
  // COPY NOTES OVER. COMPARE FLIGHT INSTANCES VS SEARCH FLIGHTINSTANCES
  changeFlight () {
    var confirm = window.confirm('Are you sure? Changing flights will not preserve attachments.')
    // console.log('confirm', confirm)
    if (!confirm) return
    // move old attachments from previous instances into dump arr. await submit, cancel to handle.
    this.state.flightInstances.forEach(instance => {
      var dump = this.state.attachmentsToDumpIfFlightChange
      this.setState({attachmentsToDumpIfFlightChange: dump.concat(instance.attachments)})
    })

    var instancesWithCopiedNotes = this.copyNotes()
    var params = this.state.searchParams
    this.setState({
      paxAdults: params.paxAdults,
      paxChildren: params.paxChildren,
      paxInfants: params.paxInfants,
      classCode: params.classCode,
      departureIATA: params.departureIATA,
      arrivalIATA: params.arrivalIATA,
      departureName: params.departureName,
      arrivalName: params.arrivalName,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      bookedThrough: '',
      bookingConfirmation: '',
      cost: this.state.searchedCostCurrency.cost,
      currency: this.state.searchedCostCurrency.currency,
      flightInstances: instancesWithCopiedNotes,
      searching: false,
      changedFlight: true
    }, () => {
      this.setState({instanceTabIndex: 0})
    })
  }

  // returns new flight instance arr
  copyNotes () {
    var oldInstances = JSON.parse(JSON.stringify(this.state.flightInstances))
    var newInstances = JSON.parse(JSON.stringify(this.state.searchFlightInstances))
    var oldTripType = this.state.returnDate ? 'return' : 'oneway'
    var newTripType = this.state.searchParams.returnDate ? 'return' : 'oneway'
    var previousLength = oldInstances.length
    var nextLength = newInstances.length
    if (oldTripType === 'oneway' && newTripType === 'oneway') {
      if (previousLength === 2 && nextLength === 1) {
        // merge
        newInstances[0].departureNotes = oldInstances[0].departureNotes + '\n-----\n' + oldInstances[1].departureNotes
        newInstances[0].arrivalNotes = oldInstances[0].arrivalNotes + '\n-----\n' + oldInstances[1].arrivalNotes
      } else {
        // else just copy over
        oldInstances.forEach((instance, i) => {
          newInstances[i].departureNotes = instance.departureNotes
          newInstances[i].arrivalNotes = instance.arrivalNotes
        })
      }
    } else if (oldTripType === 'oneway' && newTripType === 'return') {
      // one way to return
      if (previousLength < nextLength) {
        // just copy over. 1 -> 2, 1 -> 4, 2-> 4
        oldInstances.forEach((instance, i) => {
          newInstances[i].departureNotes = instance.departureNotes
          newInstances[i].arrivalNotes = instance.arrivalNotes
        })
      } else if (previousLength === 2 && nextLength === 2) {
        // merge
        newInstances[0].departureNotes = oldInstances[0].departureNotes + '\n-----\n' + oldInstances[1].departureNotes
        newInstances[0].arrivalNotes = oldInstances[0].arrivalNotes + '\n-----\n' + oldInstances[1].arrivalNotes
      }
    } else if (oldTripType === 'return' && newTripType === 'one way') {
      // return to oneway. merge everything into first instance
      var mergedDepartureNotes = ''
      var mergedArrivalNotes = ''
      oldInstances.forEach(instance => {
        mergedDepartureNotes += instance.departureNotes + '\n-----\n'
        mergedArrivalNotes += instance.arrivalNotes + '\n-----\n'
      })
      newInstances[0].departureNotes = mergedDepartureNotes
      newInstances[0].arrivalNotes = mergedArrivalNotes
    } else {
      // both return
      if (previousLength === nextLength) {
        oldInstances.forEach((instance, i) => {
          newInstances[i].departureNotes = instance.departureNotes
          newInstances[i].arrivalNotes = instance.arrivalNotes
        })
      } else if (previousLength === 2 && nextLength === 4) {
        newInstances[0].departureNotes = oldInstances[0].departureNotes
        newInstances[0].arrivalNotes = oldInstances[0].arrivalNotes
        newInstances[2].departureNotes = oldInstances[1].departureNotes
        newInstances[2].arrivalNotes = oldInstances[1].arrivalNotes
      } else if (previousLength === 4 && nextLength === 2) {
        // merge
        newInstances[0].departureNotes = oldInstances[0].departureNotes + '\n-----\n' + oldInstances[1].departureNotes
        newInstances[0].arrivalNotes = oldInstances[0].arrivalNotes + '\n-----\n' + oldInstances[1].arrivalNotes
        newInstances[1].departureNotes = oldInstances[2].departureNotes + '\n-----\n' + oldInstances[3].departureNotes
        newInstances[1].arrivalNotes = oldInstances[2].arrivalNotes + '\n-----\n' + oldInstances[3].arrivalNotes
      }
    }
    return newInstances
  }

  handleSelectFlight (index) {
    const datesUnix = this.props.dates.map(e => {
      return moment(e).unix()
    })
    this.setState({
      selected: index,
      searchedCostCurrency: {
        cost: this.state.flights[index].cost,
        currency: this.state.flights[index].currency
      },
      searchFlightInstances: this.state.flights[index].flights.map((flight, i) => {
        const startDayUnix = moment.utc(flight.departureDateTime.slice(0, 10)).unix()
        const endDayUnix = moment.utc(flight.arrivalDateTime.slice(0, 10)).unix()

        var startDayInt = (startDayUnix - datesUnix[0]) / 86400 + 1
        var endDayInt = (endDayUnix - datesUnix[0]) / 86400 + 1

        const startTime = moment.utc(flight.departureDateTime).unix() - startDayUnix
        const endTime = moment.utc(flight.arrivalDateTime).unix() - endDayUnix
        // console.log(startTime, endTime)
        return {
          FlightBookingId: this.state.id,
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
          firstFlight: i === 0,
          attachments: []
        }
      })
    })
  }

  handleChange (e, field) {
    this.setState({
      [field]: e.target.value
    })
  }

  handleFlightInstanceChange (updatedInstance) {
    // reconstruct flight instance arr
    var index = this.state.instanceTabIndex
    var flightInstancesClone = JSON.parse(JSON.stringify(this.state.flightInstances))
    var updatedArr = flightInstancesClone.slice(0, index).concat(updatedInstance).concat(flightInstancesClone.slice(index + 1))
    this.setState({flightInstances: updatedArr})
  }

  switchInstanceTab (i) {
    this.setState({instanceTabIndex: i})
  }

  componentDidMount () {
    this.props.retrieveCloudStorageToken()
    this.props.cloudStorageToken.then(obj => {
      this.apiToken = obj.token
    })
    var currencyList = allCurrenciesList()
    this.setState({currencyList: currencyList})

    // CONVERT PROPS.DATES ARR FROM JS DATE OBJ INTO UNIX TO PASS TO FlightDetailsContainerRework
    var datesArr = this.props.dates.map(e => {
      return moment(e).unix()
    })
    this.setState({datesArr: datesArr})

    // if cancel and reopen, reinitialize state
    if (this.props.data.findFlightBooking) {
      var booking = this.props.data.findFlightBooking
      console.log('initialize to db data', booking)
      // INITIALIZE DATA FROM DB
      this.setState({
        id: booking.id,
        paxAdults: booking.paxAdults,
        paxChildren: booking.paxChildren,
        paxInfants: booking.paxInfants,
        cost: booking.cost || 0,
        currency: booking.currency,
        departureDate: booking.departureDate,
        returnDate: booking.returnDate,
        departureIATA: booking.departureIATA,
        arrivalIATA: booking.arrivalIATA,
        departureName: booking.departureName,
        arrivalName: booking.arrivalName,
        classCode: booking.classCode,
        bookingStatus: booking.bookingStatus,
        bookedThrough: booking.bookedThrough || '',
        bookingConfirmation: booking.bookingConfirmation || '',
        backgroundImage: booking.backgroundImage
      })
      var flightInstances = JSON.parse(JSON.stringify(booking.flightInstances))
      var sortedInstances = flightInstances.sort(function (a, b) {
        return a.startDay - b.startDay || a.startTime - b.startTime
      })
      sortedInstances = sortedInstances.map(instance => {
        instance.holderNewAttachments = []
        instance.holderDeleteAttachments = []
        return instance
      })
      console.log('FLIGHT INSTANCES FROM DB', sortedInstances)
      this.setState({flightInstances: sortedInstances})
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data.findFlightBooking && nextProps.data.findFlightBooking !== this.props.data.findFlightBooking) {
      // console.log('initialize to db data')
      var booking = nextProps.data.findFlightBooking
      console.log('initialize db booking', booking)
      // INITIALIZE DATA FROM DB
      this.setState({
        id: booking.id,
        paxAdults: booking.paxAdults,
        paxChildren: booking.paxChildren,
        paxInfants: booking.paxInfants,
        cost: booking.cost || 0,
        currency: booking.currency,
        departureDate: booking.departureDate,
        returnDate: booking.returnDate,
        departureIATA: booking.departureIATA,
        arrivalIATA: booking.arrivalIATA,
        departureName: booking.departureName,
        arrivalName: booking.arrivalName,
        classCode: booking.classCode,
        bookingStatus: booking.bookingStatus,
        bookedThrough: booking.bookedThrough || '',
        bookingConfirmation: booking.bookingConfirmation || '',
        backgroundImage: booking.backgroundImage,
        attachments: booking.attachments
      })
      var flightInstances = JSON.parse(JSON.stringify(booking.flightInstances))
      var sortedInstances = flightInstances.sort(function (a, b) {
        return a.startDay - b.startDay || a.startTime - b.startTime
      })
      sortedInstances = sortedInstances.map(instance => {
        instance.holderNewAttachments = []
        instance.holderDeleteAttachments = []
        return instance
      })
      // console.log('FLIGHT INSTANCES FROM DB', sortedInstances)
      this.setState({flightInstances: sortedInstances})
    }
  }

  render () {
    return (
      <div className='flightFormContainer' style={createFlightFormContainerStyle}>
        {/* BOX SHADOW WRAPS LEFT AND RIGHT PANEL ONLY */}
        <div style={createEventFormBoxShadow}>

          <div style={createEventFormLeftPanelStyle(this.state.backgroundImage, 'flight')}>
            <div style={greyTintStyle} />
            {/* SEARCH PARAMS FOR AIRHOB */}
            {!this.state.searching &&
              <div style={{...eventDescContainerStyle}}>
                <button style={{color: 'black', position: 'relative'}} onClick={() => this.searchFlight()}>Search again</button>
              </div>
            }
            {!this.state.searching &&
              <EditFormAirhobParams paxAdults={this.state.paxAdults} paxChildren={this.state.paxChildren} paxInfants={this.state.paxInfants} classCode={this.state.classCode} departureDate={this.state.departureDate} returnDate={this.state.returnDate} dates={this.props.dates} departureIATA={this.state.departureIATA} arrivalIATA={this.state.arrivalIATA} />
            }
            {this.state.searching &&
              <EditFormAirhobSearchParams paxAdults={this.state.paxAdults} paxChildren={this.state.paxChildren} paxInfants={this.state.paxInfants} classCode={this.state.classCode} departureDate={this.state.departureDate} returnDate={this.state.returnDate} dates={this.props.dates} departureIATA={this.state.departureIATA} arrivalIATA={this.state.arrivalIATA} handleSearch={(flights, tripType, adults, children, infants, classCode, departureIATA, arrivalIATA, departureName, arrivalName, departureDate, returnDate) => this.handleSearch(flights, tripType, adults, children, infants, classCode, departureIATA, arrivalIATA, departureName, arrivalName, departureDate, returnDate)} />
            }
            {!this.state.searching && !this.state.editingFlightDetails &&
              <div style={{...eventDescContainerStyle}}>
                <button style={{color: 'black', position: 'relative'}} onClick={() => this.toggleEditingFlightDetails()}>EDIT FLIGHT DETAILS</button>
              </div>
            }
            {/* UPDATE -> NEED TO SWITCH THIS.PROPS.DATES TO UNIX ARR */}
            {!this.state.searching && !this.state.changedFlight &&
              <FlightDetailsContainerRework flightInstances={this.state.flightInstances} returnTrip={this.state.returnDate} dates={this.state.datesArr} />
            }
            {(this.state.searching || this.state.changedFlight) &&
              <FlightDetailsContainerRework flightInstances={this.state.searchFlightInstances} returnTrip={this.state.returnDate} dates={this.state.datesArr} />
            }
          </div>

          <div style={createEventFormRightPanelStyle('flight')}>
            <div style={bookingNotesContainerStyle}>
              {!this.state.searching && !this.state.editingFlightDetails &&
                <div>
                  <h4 style={{fontSize: '24px'}}>Booking Details</h4>
                  <BookingDetails flight handleChange={(e, field) => this.handleChange(e, field)} currency={this.state.currency} currencyList={this.state.currencyList} cost={this.state.cost} bookedThrough={this.state.bookedThrough} bookingConfirmation={this.state.bookingConfirmation} />

                  {/* flight instances. gate and notes */}
                  {this.state.flightInstances.map((instance, i) => {
                    return (
                      <h3 onClick={() => this.switchInstanceTab(i)} style={{display: 'inline-block', marginRight: '20px'}} key={'instance' + i}>{instance.departureIATA} to {instance.arrivalIATA}</h3>
                    )
                  })}
                  <FlightInstanceNotesAttachments ItineraryId={this.props.ItineraryId} instance={this.state.flightInstances[this.state.instanceTabIndex]} formType={'edit'} changedFlight={this.state.changedFlight} handleFlightInstanceChange={(updatedInstance) => this.handleFlightInstanceChange(updatedInstance)} setBackground={url => this.setBackground(url)} backgroundImage={this.state.backgroundImage} />
                </div>
              }
              {this.state.searching &&
                <div style={{width: '100%', height: '91%', margin: '2% 0 6% 0', overflowY: 'auto'}}>
                  <FlightSearchResults flights={this.state.flights} searching={this.state.searching} selected={this.state.selected} handleSelectFlight={(index) => this.handleSelectFlight(index)} tripType={this.state.tripType} />
                </div>
              }
              {this.state.editingFlightDetails &&
                <EditingFlightDetails flightInstances={this.state.flightInstances} returnDate={this.state.returnDate} dates={this.props.dates} toggleEditingFlightDetails={() => this.toggleEditingFlightDetails()} editFlightDetailsConfirm={(instances) => this.editFlightDetailsConfirm(instances)} />
              }
            </div>
            <div>
              {this.state.searching &&
                <div style={{position: 'absolute', right: '0', bottom: '0', padding: '10px'}}>
                  <Button bsStyle='danger' onClick={() => this.returnToForm()} style={{marginRight: '5px'}}>Back</Button>
                  <Button bsStyle='danger' onClick={() => this.changeFlight()}>Change flight</Button>
                </div>
              }
              {!this.state.searching && !this.state.editingFlightDetails &&
                <SaveCancelDelete delete handleSubmit={() => this.handleSubmit()} closeForm={() => this.closeForm()} deleteEvent={() => this.deleteEvent()} />
              }
            </div>
          </div>

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
  graphql(deleteFlightBooking, {name: 'deleteFlightBooking'}),
  graphql(updateItineraryDetails, {name: 'updateItineraryDetails'})
)(Radium(EditFlightForm)))
