import React, { Component } from 'react'
import AirportSearch from '../eventFormComponents/AirportSearch'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import moment from 'moment'
import Radium from 'radium'

import { allCurrenciesList } from '../../helpers/countriesToCurrencyList'
import newEventLoadSeqAssignment from '../../helpers/newEventLoadSeqAssignment'
import { activityIconStyle, createEventBoxStyle, intuitiveDropdownStyle } from '../../Styles/styles'
import { createFlightBooking } from '../../apollo/flight'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { queryItinerary, updateItineraryDetails } from '../../apollo/itinerary'

const defaultBackground = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}flightDefaultBackground.jpg`

class IntuitiveFlightInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      departureLocation: '',
      arrivalLocation: '',
      showFlights: false,
      flights: [],
      flightInstances: [],
      tripType: '',
      paxAdults: '',
      paxChildren: '',
      paxInfants: '',
      classCode: '',
      departureDate: null,
      returnDate: null,
      departureIATA: '',
      arrivalIATA: '',
      departureName: '',
      arrivalName: '',
      search: '',
      searching: false
    }
  }

  selectLocation (type, details) {
    this.setState({[`${type}Location`]: details}, () => {
      if (this.state.departureLocation && this.state.arrivalLocation) {
        this.handleFlightSearch()
        this.setState({
          showFlights: true
        })
      }
    })
  }

  handleFlightSearch () {
    const uriFull = 'https://dev-sandbox-api.airhob.com/sandboxapi/flights/v1.2/search'
    const origin = this.state.departureLocation.type === 'airport' ? this.state.departureLocation.iata : this.state.departureLocation.cityCode
    const destination = this.state.arrivalLocation.type === 'airport' ? this.state.arrivalLocation.iata : this.state.arrivalLocation.cityCode
    const travelDate = moment(new Date(this.props.departureDate)).format('MM/DD/YYYY')
    console.log('searching...')
    this.setState({
      searching: true
    })
    fetch(uriFull, {
      method: 'POST',
      headers: {
        apikey: 'f7da6320-6bda-4',
        mode: 'sandbox',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        TripType: 'O',
        NoOfAdults: 1,
        NoOfChilds: 0,
        NoOfInfants: 0,
        ClassType: 'Economy',
        OriginDestination: [
          {
            'Origin': origin,
            'Destination': destination,
            'TravelDate': travelDate
          }
        ],
        Currency: 'USD',
        FlightsCount: '200ITINS'
      })
    }).then(response => {
      const json = response.json()
      console.log(json)
      return json
    }).then(results => {
      this.setState({
        searching: false
      })
      if (!results.OneWayAvailabilityResponse.ItinearyDetails.length) {
        console.log('no results')
        return
      }
      const flights = results.OneWayAvailabilityResponse.ItinearyDetails[0].Items
      // console.log(flights);
      const details = flights.map(flight => {
        return {
          totalDuration: parseInt(flight.ElapsedTime[0], 10),
          flights: flight.FlightDetails.map(flightDetails => {
            return {
              departureDateTime: flightDetails.DepartureDateTime,
              arrivalDateTime: flightDetails.ArrivalDateTime,
              duration: flightDetails.Duration,
              departureLocation: flightDetails.OriginAirportName,
              departureCityCountry: flightDetails.OriginAirportCity + ', ' + flightDetails.OriginAirportCountry,
              departureAirportCode: flightDetails.Origin,
              departureTerminal: flightDetails.OrgTerminal,
              arrivalLocation: flightDetails.DestinationAirportName,
              arrivalCityCountry: flightDetails.DestinationAirportCity + ', ' + flightDetails.DestinationAirportCountry,
              arrivalAirportCode: flightDetails.Destination,
              arrivalTerminal: flightDetails.DesTerminal,
              carrierCode: flightDetails.CarrierCode,
              flightNum: flightDetails.FlightNum,
              airlineName: flightDetails.AirlineName,
              direction: flightDetails.JourneyType
            }
          })
        }
      })
      this.setState({
        flights: details,
        tripType: 'O',
        paxAdults: 1,
        paxChildren: 0,
        paxInfants: 0,
        classCode: 'Economy',
        departureIATA: origin,
        arrivalIATA: destination,
        departureName: this.state.departureLocation.name,
        arrivalName: this.state.arrivalLocation.name
      }, () => console.log('handle flight search', this.state))
    })
  }

  handleSelectFlight (index) {
    const selectedFlight = this.state.flights.filter(flight => (flight.flights[0].carrierCode + flight.flights[0].flightNum).includes(this.state.search.replace(/\s/g, '').toUpperCase()))[index]

    const datesUnix = this.props.dates.map(e => {
      return moment(e).unix()
    })

    this.setState({
      flightInstances: selectedFlight.flights.map((flight, i) => {
        const startDayUnix = moment.utc(flight.departureDateTime.slice(0, 10)).unix()
        const endDayUnix = moment.utc(flight.arrivalDateTime.slice(0, 10)).unix()
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
          startDay: datesUnix.indexOf(startDayUnix) + 1 ? datesUnix.indexOf(startDayUnix) + 1 : datesUnix.length + (startDayUnix - datesUnix[datesUnix.length - 1]) / 86400,
          endDay: datesUnix.indexOf(endDayUnix) + 1 ? datesUnix.indexOf(endDayUnix) + 1 : datesUnix.length + (endDayUnix - datesUnix[datesUnix.length - 1]) / 86400,
          startTime: startTime,
          endTime: endTime,
          durationMins: flight.duration,
          firstFlight: i === 0
        }
      })
    }, () => {
      this.setState({
        search: selectedFlight.flights[0].carrierCode + ' ' + selectedFlight.flights[0].flightNum,
        showFlights: false
      }, () => {
        console.log(this.state)
      })
    })
  }

  handleSubmit () {
    const validations = [
      {
        type: 'departureLocation',
        notification: 'departureRequired'
      },
      {
        type: 'arrivalLocation',
        notification: 'arrivalRequired'
      }
    ]
    let validated = true
    validations.forEach((validation) => {
      if (this.state[validation.type]) {
        this.setState({
          [validation.notification]: false
        })
      }
      if (!this.state[validation.type]) {
        this.setState({
          [validation.notification]: true
        })
        validated = false
      }
    })
    if (!validated) return

    const newFlight = {
      ItineraryId: parseInt(this.props.itineraryId, 10),
      paxAdults: 1,
      paxChildren: 0,
      paxInfants: 0,
      cost: 0,
      currency: this.state.currency,
      classCode: 'Economy',
      // updated fields to match backend
      departureIATA: this.state.departureIATA,
      arrivalIATA: this.state.arrivalIATA,
      departureDate: this.props.departureDate / 1000,
      // no return date for smart input (oneway)
      departureName: this.state.departureName,
      arrivalName: this.state.arrivalName,
      bookingStatus: false,
      backgroundImage: defaultBackground,
      flightInstances: this.state.flightInstances
    }
    console.log('new flight', newFlight)

    if (newFlight.flightInstances[newFlight.flightInstances.length - 1].endDay > this.props.dates.length) {
      this.props.updateItineraryDetails({
        variables: {
          id: this.props.itineraryId,
          days: newFlight.flightInstances[newFlight.flightInstances.length - 1].endDay
        }
      })
    }

    var helperOutput = newEventLoadSeqAssignment(this.props.events, 'Flight', newFlight.flightInstances)
    console.log('helper output', helperOutput)

    this.props.changingLoadSequence({
      variables: {
        input: helperOutput.loadSequenceInput
      }
    })

    newFlight.flightInstances = helperOutput.newEvent

    this.props.createFlightBooking({
      variables: newFlight,
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.itineraryId }
      }]
    })

    this.resetState()
    this.props.toggleIntuitiveInput()
  }

  handleKeydown (e) {
    if (e.keyCode === 13) {
      this.handleSubmit()
    }
  }

  resetState () {
    this.setState({
      departureLocation: '',
      arrivalLocation: '',
      search: '',
      showFlights: false,
      flights: [],
      flightInstances: []
    })
  }

  componentDidMount () {
    var currencyList = allCurrenciesList()
    this.setState({currency: currencyList[0]})
  }

  render () {
    return (
      <div onKeyDown={(e) => this.handleKeydown(e)} tabIndex='0' style={{...createEventBoxStyle, ...{width: '100%', paddingBottom: '10px', top: '-1.5vh'}}}>
        <div style={{width: '33%', display: 'inline-block'}}>
          {this.state.departureRequired && <span style={{fontWeight: 'bold', position: 'absolute', top: '-20px'}}>(Required)</span>}
          <AirportSearch intuitiveInput currentLocation={this.state.departureLocation} placeholder={'Departure City/Airport'} selectLocation={details => this.selectLocation('departure', details)} />
        </div>
        <div style={{width: '33%', display: 'inline-block'}}>
          {this.state.arrivalRequired && <span style={{fontWeight: 'bold', position: 'absolute', top: '-20px'}}>(Required)</span>}
          <AirportSearch intuitiveInput currentLocation={this.state.arrivalLocation} placeholder={'Arrival City/Airport'} selectLocation={details => this.selectLocation('arrival', details)} />
        </div>
        <div style={{width: '34%', display: 'inline-block'}}>
          <div style={{position: 'relative'}}>
            <input style={{width: '90%'}} value={this.state.search} onChange={(e) => this.setState({
              search: e.target.value,
              showFlights: true
            })} />
            <i key='more' onClick={() => this.props.handleCreateEventClick('Flight')} className='material-icons' style={{position: 'absolute', right: '0%', color: '#ed685a', cursor: 'pointer'}}>more_horiz</i>
            {this.state.showFlights &&
              <div style={{...intuitiveDropdownStyle, ...this.state.searching && {minHeight: '50px'}}}>
                {this.state.searching && <h5 style={{textAlign: 'center'}}>Loading...</h5>}
                {!this.state.searching && this.state.flights.filter(flight => (flight.flights[0].carrierCode + flight.flights[0].flightNum).includes(this.state.search.replace(/\s/g, '').toUpperCase())).map((flight, i) => {
                  const totalHours = Math.floor(flight.totalDuration / 60) ? Math.floor(flight.totalDuration / 60) + ' h ' : null
                  const totalMins = flight.totalDuration % 60 + ' min'
                  return (
                    <div onClick={() => this.handleSelectFlight(i)} key={i} style={{cursor: 'default', padding: '5px 5px 10px 5px', ':hover': {backgroundColor: 'rgb(210, 210, 210)'}}}>
                      <h5 style={{fontSize: '1em', margin: '0', color: '#3C3A44', display: 'inline-block', fontWeight: 'bold', width: '30%'}}>
                        {flight.flights[0].carrierCode} {flight.flights[0].flightNum}
                      </h5>
                      <h5 style={{fontSize: '1em', margin: '0', color: '#3C3A44', display: 'inline-block', width: '40%', verticalAlign: 'middle'}}>
                        {flight.flights.length === 1 ? 'Direct' : `via ${flight.flights[0].arrivalCityCountry}`}
                      </h5>
                      <h5 style={{fontSize: '1em', margin: '0', color: '#3C3A44', display: 'inline-block', width: '30%'}}>
                        {totalHours}{totalMins}
                      </h5>
                    </div>
                  )
                })}
              </div>
            }
          </div>
        </div>
        <div style={{marginTop: '5px', display: 'inline-block', textAlign: 'right', width: '96.6%'}}>
          <button onClick={() => this.handleSubmit()} style={{marginRight: '5px', backgroundColor: 'white', border: '1px solid #9FACBC'}}>Submit</button>
          <button onClick={() => this.props.toggleIntuitiveInput()} style={{backgroundColor: 'white', border: '1px solid #9FACBC'}}>Cancel</button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.plannerActivities
  }
}

export default connect(mapStateToProps)(compose(
  graphql(createFlightBooking, {name: 'createFlightBooking'}),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'}),
  graphql(updateItineraryDetails, {name: 'updateItineraryDetails'})
)(Radium(IntuitiveFlightInput)))
