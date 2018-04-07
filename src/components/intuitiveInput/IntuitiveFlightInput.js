import React, { Component } from 'react'
import AirportSearch from '../eventFormComponents/AirportSearch'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import moment from 'moment'
import Radium from 'radium'
import DatePicker from 'react-datepicker'

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
      paxAdults: 1,
      paxChildren: 0,
      paxInfants: 0,
      classCode: 'Economy',
      departureDate: null,
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
      if (this.state.departureLocation && this.state.arrivalLocation && this.state.departureDate) {
        this.handleFlightSearch()
        this.setState({
          showFlights: true
        })
      }
    })
  }

  selectDate (e) {
    // console.log('date', e._d)
    // LOCAL TIME
    var dateMidnight = moment(e._d).format('MM/DD/YYYY')
    var months = dateMidnight.substring(0, 2)
    var days = dateMidnight.substring(3, 5)
    var years = dateMidnight.substring(6)
    // console.log(months, days, years)

    // FORCE DATE TO BE UTC
    var dateInUtc = moment.utc([years, months - 1, days])
    // console.log('date in utc', dateInUtc)
    var dateUtcMidnight = dateInUtc.format('MM/DD/YYYY')
    // console.log('date only portion', dateUtcMidnight)

    var departureDate = moment.utc(dateUtcMidnight).unix()
    this.setState({departureDate: departureDate})

    // CREATE A DATES ARR FOR HANDLEFLIGHTSEARCH TO FIND START/END DAY FOR INSTANCES. WORK BACKWARDS TO FIND UNIX FOR DAY 1, THEN FORWARD TO FILL ENTIRE DATES ARR
    var dayOneUnix = departureDate - (this.props.day - 1) * 86400
    var datesArr = this.props.daysArr.map(day => {
      return dayOneUnix + ((day - 1) * 86400)
    })
    this.setState({datesArr: datesArr})
    // console.log('mount datesArr', datesArr)

    if (this.state.departureLocation && this.state.arrivalLocation && this.state.departureDate) {
      this.handleFlightSearch()
      this.setState({
        showFlights: true
      })
    }
  }

  handleFlightSearch () {
    const uriFull = 'https://dev-sandbox-api.airhob.com/sandboxapi/flights/v1.2/search'
    const origin = this.state.departureLocation.type === 'airport' ? this.state.departureLocation.iata : this.state.departureLocation.cityCode
    const destination = this.state.arrivalLocation.type === 'airport' ? this.state.arrivalLocation.iata : this.state.arrivalLocation.cityCode

    var travelDate = moment.unix(this.state.departureDate).format('MM/DD/YYYY')
    console.log('travelDate', travelDate)

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
        departureIATA: origin,
        arrivalIATA: destination,
        departureName: this.state.departureLocation.name,
        arrivalName: this.state.arrivalLocation.name
      }, () => console.log('handle flight search', this.state))
    })
  }

  handleSelectFlight (index) {
    const selectedFlight = this.state.flights.filter(flight => (flight.flights[0].carrierCode + flight.flights[0].flightNum).includes(this.state.search.replace(/\s/g, '').toUpperCase()))[index]

    if (this.props.dates) {
      var datesUnix = this.props.dates.map(e => {
        return moment(e).unix()
      })
    } else {
      datesUnix = this.state.datesArr
    }
    console.log('datesUnixArr', datesUnix)

    this.setState({
      flightInstances: selectedFlight.flights.map((flight, i) => {
        console.log('departureDateTime', flight.departureDateTime)
        const startDayUnix = moment.utc(flight.departureDateTime.slice(0, 10)).unix()
        console.log('startDayUnix', startDayUnix)
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
      },
      {
        type: 'departureDate',
        notification: 'dateRequired'
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
      departureIATA: this.state.departureIATA,
      arrivalIATA: this.state.arrivalIATA,
      departureDate: this.state.departureDate,
      departureName: this.state.departureName,
      arrivalName: this.state.arrivalName,
      bookingStatus: false,
      backgroundImage: defaultBackground,
      flightInstances: this.state.flightInstances
    }
    console.log('new flight', newFlight)

    var apolloVariables = {id: this.props.itineraryId}
    var lastDay = newFlight.flightInstances[newFlight.flightInstances.length - 1].endDay

    if (this.props.dates) {
      if (lastDay > this.props.dates.length) {
        apolloVariables.days = lastDay
      }
    } else {
      apolloVariables.startDate = this.state.datesArr[0]
      if (lastDay > this.state.datesArr.length) {
        apolloVariables.days = lastDay
      }
    }

    this.props.updateItineraryDetails({
      variables: apolloVariables
    })

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

    // SET UP DEPARTURE DATE. DEFAULTS TO CURRENT DATE IF DATE PROP DONT EXIST
    if (this.props.date) {
      this.setState({departureDate: this.props.date / 1000})
    } else {
      // if no date, default to 'today', make datesArr
      // LOCAL TIME
      var currentDate = moment().format('MM/DD/YYYY')
      var months = currentDate.substring(0, 2)
      var days = currentDate.substring(3, 5)
      var years = currentDate.substring(6)
      // console.log(months, days, years)

      // FORCE IT TO BE UTC
      var dateInUtc = moment.utc([years, months - 1, days])
      // console.log('date in utc', dateInUtc)
      var dateUtcMidnight = dateInUtc.format('MM/DD/YYYY')
      // console.log('date only portion', dateUtcMidnight)

      var departureDate = moment.utc(dateUtcMidnight).unix()
      // this.setState({departureDate: departureDate})

      var dayOneUnix = departureDate - (this.props.day - 1) * 86400
      var datesArr = this.props.daysArr.map(day => {
        return dayOneUnix + ((day - 1) * 86400)
      })
      this.setState({datesArr: datesArr})

      // console.log('mount datesArr', datesArr)
    }
  }

  render () {
    return (
      <div onKeyDown={(e) => this.handleKeydown(e)} tabIndex='0' style={{...createEventBoxStyle, ...{width: '100%', padding: '10px 0'}}}>
        {/* IF DATE MISSING, DATE IS PICKABLE FROM CURRENT DATE ONWARDS */}
        {!this.props.dates &&
          <div style={{display: 'inline-block'}}>
            {!this.state.departureDate && !this.state.editingDepartureDate && <input type='text' placeholder='Date' style={{width: '86px', fontSize: '13px', height: '31px', padding: '8px', textAlign: 'center'}} onFocus={(e) => this.setState({editingDepartureDate: true})} />}
            {(this.state.departureDate || this.state.editingDepartureDate) && <div className='quickInputCalender' style={{width: '86px', display: 'inline-block'}}>
              <DatePicker autoFocus minDate={moment()} selected={this.state.departureDate ? moment.unix(this.state.departureDate) : null} onSelect={(e) => this.selectDate(e)} onBlur={(e) => this.setState({editingDepartureDate: false})} />
            </div>}
            <div style={{width: '299px', display: 'inline-block', marginLeft: '8px'}}>
              {this.state.departureRequired && <span style={{fontWeight: 'bold', position: 'absolute', top: '-20px'}}>(Required)</span>}
              <AirportSearch intuitiveInput currentLocation={this.state.departureLocation} placeholder={'Departure City/Airport'} selectLocation={details => this.selectLocation('departure', details)} />
            </div>
            <div style={{width: '299px', display: 'inline-block', marginLeft: '8px'}}>
              {this.state.arrivalRequired && <span style={{fontWeight: 'bold', position: 'absolute', top: '-20px'}}>(Required)</span>}
              <AirportSearch intuitiveInput currentLocation={this.state.arrivalLocation} placeholder={'Arrival City/Airport'} selectLocation={details => this.selectLocation('arrival', details)} />
            </div>
          </div>
        }
        {this.props.dates &&
          <div style={{display: 'inline-block'}}>
            <div style={{width: '331px', display: 'inline-block'}}>
              {this.state.departureRequired && <span style={{fontWeight: 'bold', position: 'absolute', top: '-20px'}}>(Required)</span>}
              <AirportSearch intuitiveInput currentLocation={this.state.departureLocation} placeholder={'Departure City/Airport'} selectLocation={details => this.selectLocation('departure', details)} inputFocus={(e) => this.props.inputFocus(e)} inputBlur={(e) => this.props.inputBlur(e)} />
            </div>
            <div style={{width: '330px', display: 'inline-block', marginLeft: '8px'}}>
              {this.state.arrivalRequired && <span style={{fontWeight: 'bold', position: 'absolute', top: '-20px'}}>(Required)</span>}
              <AirportSearch intuitiveInput currentLocation={this.state.arrivalLocation} placeholder={'Arrival City/Airport'} selectLocation={details => this.selectLocation('arrival', details)} inputFocus={(e) => this.props.inputFocus(e)} inputBlur={(e) => this.props.inputBlur(e)} />
            </div>
          </div>
        }
        <div style={{width: this.props.dates ? '330px' : '299px', display: 'inline-block', marginLeft: '8px'}}>
          <div style={{position: 'relative'}}>
            <input placeholder='Flight' style={{width: '100%', padding: '8px', fontSize: '13px', height: '31px'}} value={this.state.search} onChange={(e) => this.setState({
              search: e.target.value,
              showFlights: true
            })} onFocus={(e) => this.props.inputFocus(e)} onBlur={(e) => this.props.inputBlur(e)} />
            {this.state.showFlights &&
              <div style={{...intuitiveDropdownStyle, ...{top: '32px', width: '330px'}, ...this.state.searching && {minHeight: '50px'}}}>
                {this.state.searching && <h5 style={{textAlign: 'center'}}>Loading...</h5>}
                {!this.state.searching && this.state.flights.filter(flight => (flight.flights[0].carrierCode + flight.flights[0].flightNum).includes(this.state.search.replace(/\s/g, '').toUpperCase())).map((flight, i) => {
                  const totalHours = Math.floor(flight.totalDuration / 60) ? Math.floor(flight.totalDuration / 60) + ' h ' : null
                  const totalMins = flight.totalDuration % 60 + ' min'
                  return (
                    <div onClick={() => this.handleSelectFlight(i)} key={i} style={{cursor: 'default', padding: '8px', ':hover': {backgroundColor: 'rgb(210, 210, 210)'}}}>
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
        <div style={{marginTop: '6px', display: 'inline-block', textAlign: 'right', width: '100%'}}>
          <button onClick={() => this.handleSubmit()} style={{marginRight: '8px', backgroundColor: '#ed685a', border: 'none', color: 'white', height: '31px', fontSize: '13px', padding: '8px'}}>Submit</button>
          <button onClick={() => this.props.handleCreateEventClick('Flight')} style={{backgroundColor: 'white', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', color: 'rgba(60, 58, 68, 0.7)', height: '31px', fontSize: '13px', padding: '8px'}}>More</button>
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
