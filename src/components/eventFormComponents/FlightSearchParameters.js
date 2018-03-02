import React, { Component } from 'react'
import AirportSearch from './AirportSearch'
import Radium from 'radium'
import moment from 'moment'
import { Button } from 'react-bootstrap'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CustomDatePicker from './CustomDatePicker'
import FlightMapHOC from '../location/FlightMapHOC'

import { dateTimePickerContainerStyle, eventDescContainerStyle, flightMapContainerStyle, createFlightButtonStyle } from '../../Styles/styles'

class FlightSearchParameters extends Component {
  constructor (props) {
    super(props)
    this.state = {
      departureLocation: null,
      arrivalLocation: null,
      // start date, end date, start/end day
      departureDate: null, // keep as moment so null wont display as 1970
      returnDate: null,
      // req params for airhob
      classCode: 'Economy',
      paxAdults: 1,
      paxChildren: 0,
      paxInfants: 0,
      datesArr: []
    }
  }

  handleFlightSearch () {
    // console.log(this.state)
    const uriFull = 'https://dev-sandbox-api.airhob.com/sandboxapi/flights/v1.2/search'
    const origin = this.state.departureLocation.type === 'airport' ? this.state.departureLocation.iata : this.state.departureLocation.cityCode
    const destination = this.state.arrivalLocation.type === 'airport' ? this.state.arrivalLocation.iata : this.state.arrivalLocation.cityCode
    const travelDate = this.state.departureDate.format('MM/DD/YYYY')
    let returnDate
    if (this.state.returnDate) returnDate = this.state.returnDate.format('MM/DD/YYYY')
    const tripType = this.state.returnDate ? 'R' : 'O'
    console.log('searching...')
    fetch(uriFull, {
      method: 'POST',
      headers: {
        apikey: 'f7da6320-6bda-4',
        mode: 'sandbox',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        TripType: this.state.returnDate ? 'R' : 'O',
        NoOfAdults: this.state.paxAdults,
        NoOfChilds: this.state.paxChildren,
        NoOfInfants: this.state.paxInfants,
        ClassType: this.state.classCode,
        OriginDestination: this.state.returnDate ? [
          {
            'Origin': origin,
            'Destination': destination,
            'TravelDate': travelDate
          },
          {
            'Origin': destination,
            'Destination': origin,
            'TravelDate': returnDate
          }
        ] : [
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
      if (!results.OneWayAvailabilityResponse.ItinearyDetails.length) {
        console.log('no results')
        return
      }
      const flights = results.OneWayAvailabilityResponse.ItinearyDetails[0].Items
      console.log('AIRHOB RESULTS', flights)
      const details = flights.map(flight => {
        return {
          cost: flight.FareDescription.PaxFareDetails[0].OtherInfo.GrossAmount,
          currency: 'USD',
          totalDuration: [parseInt(flight.ElapsedTime[0], 10), parseInt(flight.ElapsedTime[1], 10)],
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
      // extract departure, arrival name (airport or city name)
      var departureName = this.state.departureLocation.name
      var arrivalName = this.state.arrivalLocation.name

      // PASS DATES ARRAY BACK UP TO FORM (IF PROPS DATES WAS MISSING DATESARR WAS CONSTRUCTED HERE WHEN DATE WAS CHOSEN)
      this.props.handleSearch(details, tripType, this.state.paxAdults, this.state.paxChildren, this.state.paxInfants, this.state.classCode, origin, destination, departureName, arrivalName, this.state.departureDate, this.state.returnDate, this.state.datesArr)
    })
  }

  handleChange (e, field) {
    if (field === 'departureDate' || field === 'returnDate') {
      // might be cleared to null
      // console.log('e', e)
      if (e) {
        this.setState({
          [field]: moment(e._d)
        }, () => console.log('state', this.state))
      } else {
        this.setState({
          [field]: null
        }, () => console.log('e null', this.state))
      }
    } else {
      this.setState({
        [field]: e.target.value
      })
    }
    // WHEN DEPARTURE DATE CHANGES AND PROPS DATES IS NULL, RECONSTRUCT DATES ARR
    if (field === 'departureDate' && !this.props.dates) {
      var departureDate = moment(e._d).unix()
      // console.log('changed date', departureDate)
      // work backwards to construct datesArr(unix)
      // console.log('day form was opened', this.props.day)
      var dayOneUnix = departureDate - (this.props.day - 1) * 86400
      var datesArr = this.props.daysArr.map(day => {
        return dayOneUnix + ((day - 1) * 86400)
      })
      this.setState({datesArr: datesArr})
      // console.log('changed datesArr', datesArr)
    }
  }

  selectLocation (type, details) {
    this.setState({[`${type}Location`]: details}) // set airport/city details
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.searchClicked !== this.props.searchClicked) {
      this.handleFlightSearch()
    }
    // set departure date depending on whether date was passed. on flight search pass dates arr back up to form
    if (!this.props.dates) {
      // LOCAL TIME
      var currentDate = moment().format('MM/DD/YYYY')
      var months = currentDate.substring(0, 2)
      var days = currentDate.substring(3, 5)
      var years = currentDate.substring(6)
      // FORCE UTC
      var dateInUtc = moment.utc([years, months - 1, days])
      var dateUtcMidnight = dateInUtc.format('MM/DD/YYYY')
      var departureDate = moment.utc(dateUtcMidnight).unix()
      this.setState({departureDate: moment.unix(departureDate)})

      // work backwards to construct datesArr(unix)
      // console.log('day form was opened', this.props.day)
      var dayOneUnix = departureDate - (this.props.day - 1) * 86400
      var datesArr = this.props.daysArr.map(day => {
        return dayOneUnix + ((day - 1) * 86400)
      })
      this.setState({datesArr: datesArr}, () => console.log('no dates props, set state with datesArr', this.state))
    } else {
      // props dates are date objects. local time. convert all to unix
      // console.log('dates', this.props.dates)
      datesArr = this.props.dates.map(e => {
        return moment(e).unix()
      })
      this.setState({datesArr: datesArr}, () => console.log('props dates was passed', this.state))

      this.setState({departureDate: moment.unix(this.props.date / 1000)})
    }
  }

  render () {
    // console.log('props date', this.props.date)
    return (
      <div style={{position: 'relative'}}>
        {!this.props.searching && !this.props.bookingDetails &&
          <div style={flightMapContainerStyle}>
            <FlightMapHOC departureLocation={this.state.departureLocation} arrivalLocation={this.state.arrivalLocation} />
          </div>
        }

        {/* NEED TO STYLE MARGIN TOP HERE / INSIDE AIRPORTSEARCH */}
        <div style={{position: 'relative'}}>
          <div style={{...eventDescContainerStyle, ...{width: '100%'}}}>
            <p style={{position: 'relative', fontWeight: '300', fontSize: '16px', margin: '0 0 8px 0'}}>Departure</p>
            <AirportSearch currentLocation={this.state.departureLocation} placeholder={'Departure City/Airport'} selectLocation={details => this.selectLocation('departure', details)} />
          </div>
          <div style={{...eventDescContainerStyle, ...{width: '100%', marginTop: '24px'}}}>
            <p style={{position: 'relative', fontWeight: '300', fontSize: '16px', margin: '0 0 8px 0'}}>Arrival</p>
            <AirportSearch currentLocation={this.state.arrivalLocation} placeholder={'Arrival City/Airport'} selectLocation={details => this.selectLocation('arrival', details)} />
          </div>
        </div>

        {/* DATEBOX */}
        <div className='flightSearchParams' style={{...eventDescContainerStyle, ...{marginTop: '24px', width: '100%'}}}>
          <div style={{marginBottom: '8px', textAlign: 'center', fontSize: '13px'}}>
            <span style={{width: '99px', display: 'inline-block', textAlign: 'center', marginRight: '8px'}}>Departing</span>
            <span style={{width: '99px', display: 'inline-block', textAlign: 'center'}}>Returning</span>
            <span style={{width: '24px', display: 'inline-block', textAlign: 'center'}} />
            <span style={{width: '44px', display: 'inline-block', textAlign: 'center', marginRight: '8px'}}>Class</span>
            <span style={{width: '44px', display: 'inline-block', textAlign: 'center', marginRight: '8px'}}>Adults</span>
            <span style={{width: '44px', display: 'inline-block', textAlign: 'center', marginRight: '8px'}}>2-11y</span>
            <span style={{width: '44px', display: 'inline-block', textAlign: 'center'}}>{'<2y'}</span>
          </div>
          <div style={{display: 'inline-block', marginRight: '8px'}}>
            <DatePicker customInput={<CustomDatePicker flight />} selected={moment(this.state.departureDate)} dateFormat={'DD/MM/YYYY'} minDate={moment.unix(this.state.datesArr[this.props.day - 1])} onChange={(e) => this.handleChange(e, 'departureDate')} />
          </div>
          <div style={{display: 'inline-block', marginRight: '8px'}}>
            <DatePicker customInput={<CustomDatePicker flight />} selected={this.state.returnDate} dateFormat={'DD/MM/YYYY'} minDate={moment(this.state.departureDate)} onChange={(e) => this.handleChange(e, 'returnDate')} isClearable />
          </div>

          <hr style={{height: '1px', width: '8px', margin: '0 8px 0 0', display: 'inline-block', verticalAlign: 'middle'}} />

          <select value={this.state.classCode} onChange={(e) => this.handleChange(e, 'classCode')} style={{backgroundColor: 'rgba(245, 245, 245, 0.1)', border: 'none', borderBottom: '1px solid white', height: '35px', fontSize: '16px', marginRight: '8px', width: '44px'}}>
            <option style={{color: 'black'}} value='Economy'>E</option>
            <option style={{color: 'black'}} value='PremiumEconomy'>PE</option>
            <option style={{color: 'black'}} value='Business'>B</option>
            <option style={{color: 'black'}} value='First'>F</option>
          </select>

          <select value={this.state.paxAdults} onChange={(e) => this.handleChange(e, 'paxAdults')} style={{width: '44px', backgroundColor: 'rgba(245, 245, 245, 0.1)', border: 'none', borderBottom: '1px solid white', height: '35px', fontSize: '16px', marginRight: '8px'}}>
            {[1, 2, 3, 4, 5, 6].map((num) => {
              return <option key={num} style={{color: 'black'}}>{num}</option>
            })}
          </select>
          <select value={this.state.paxChildren} onChange={(e) => this.handleChange(e, 'paxChildren')} style={{width: '44px', backgroundColor: 'rgba(245, 245, 245, 0.1)', border: 'none', borderBottom: '1px solid white', height: '35px', fontSize: '16px', marginRight: '8px'}}>
            {[0, 1, 2, 3, 4, 5, 6].map((num) => {
              return <option key={num} style={{color: 'black'}}>{num}</option>
            })}
          </select>
          <select value={this.state.paxInfants} onChange={(e) => this.handleChange(e, 'paxInfants')} style={{width: '44px', backgroundColor: 'rgba(245, 245, 245, 0.1)', border: 'none', borderBottom: '1px solid white', height: '35px', fontSize: '16px'}}>
            {[0, 1, 2, 3, 4, 5, 6].map((num) => {
              return <option key={num} style={{color: 'black'}}>{num}</option>
            })}
          </select>
        </div>
        {this.props.searching &&
          <div style={{textAlign: 'right', marginRight: '20px'}} onClick={() => this.handleFlightSearch()}>
            <h5>Search again</h5>
          </div>
        }
        <hr style={{display: 'block', height: '1px', margin: '32px 0', opacity: '0.3'}} />
        <div style={{textAlign: 'center'}}>
          {!this.props.searching && !this.props.bookingDetails && <button style={{...createFlightButtonStyle, ...{marginRight: '32px', width: '65px'}}} onClick={() => this.handleFlightSearch()}>Search</button>}
          {!this.props.searching && !this.props.bookingDetails && <button style={{...createFlightButtonStyle, ...{width: '65px'}}} onClick={() => this.props.closeForm()}>Cancel</button>}
        </div>
      </div>
    )
  }
}

export default Radium(FlightSearchParameters)
