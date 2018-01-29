import React, { Component } from 'react'
import AirportSearch from './AirportSearch'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CustomDatePicker from './CustomDatePicker'
import airports from '../../data/airports.json'

import { eventDescContainerStyle } from '../../Styles/styles'

class EditFormAirhobSearchParams extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // location obj {name, iata, type}
      departureLocation: null,
      arrivalLocation: null,
      departureIATA: '',
      arrivalIATA: '',
      departureDate: null,
      returnDate: null,
      classCode: '',
      paxAdults: 0,
      paxChildren: 0,
      paxInfants: 0
    }
  }

  handleFlightSearch () {
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
      // console.log(flights);
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
      console.log('DONE DETAILS OF ALL FLIGHTS', details)
      // HOIST PARAMS UP TO EDIT FORM. SAVED SEPARATELY FROM THE EDIT STATE
      var departureName = this.state.departureLocation.name
      var arrivalName = this.state.arrivalLocation.name
      this.props.handleSearch(details, tripType, this.state.paxAdults, this.state.paxChildren, this.state.paxInfants, this.state.classCode, origin, destination, departureName, arrivalName, this.state.departureDate, this.state.returnDate)
    })
  }

  selectLocation (type, details) {
    this.setState({[`${type}Location`]: details}, () => console.log('select airport', this.state)) // set airport/city details
  }

  handleChange (e, field) {
    if (field === 'departureDate' || field === 'returnDate') {
      this.setState({
        [field]: moment(e._d)
      }, () => console.log('dates change', this.state))
    } else {
      this.setState({
        [field]: e.target.value
      }, () => console.log('change', this.state))
    }
  }

  componentDidMount () {
    this.setState({
      departureDate: moment(this.props.departureDate * 1000),
      departureIATA: this.props.departureIATA,
      arrivalIATA: this.props.arrivalIATA
    })
    if (this.props.returnDate) {
      this.setState({returnDate: moment(this.props.returnDate * 1000)})
    }
    // find the departure/arrival location from airports.json
    var departureRow = airports.find(e => {
      return e.iata === this.props.departureIATA
    })
    if (departureRow) {
      var departureLocation = {
        name: departureRow.name,
        iata: departureRow.iata,
        type: 'airport'
      }
    } else {
      departureRow = airports.find(e => {
        return e.cityCode === this.props.departureIATA
      })
      departureLocation = {
        name: departureRow.city,
        cityCode: departureRow.iata,
        type: 'city'
      }
    }
    var arrivalRow = airports.find(e => {
      return e.iata === this.props.arrivalIATA
    })
    if (arrivalRow) {
      var arrivalLocation = {
        name: arrivalRow.name,
        iata: arrivalRow.iata,
        type: 'airport'
      }
    } else {
      arrivalRow = airports.find(e => {
        return e.cityCode === this.props.arrivalIATA
      })
      arrivalLocation = {
        name: arrivalRow.city,
        cityCode: arrivalRow.iata,
        type: 'city'
      }
    }
    this.setState({
      departureLocation: departureLocation,
      arrivalLocation: arrivalLocation
    })
    this.setState({
      classCode: this.props.classCode,
      paxAdults: this.props.paxAdults,
      paxChildren: this.props.paxChildren,
      paxInfants: this.props.paxInfants
    })
  }

  // componentWillReceiveProps (nextProps) {
  //   console.log('NEXTPROPS', nextProps)
  //   if (this.props.departureDate !== nextProps.departureDate) {
  //     this.setState({
  //       departureDate: moment(nextProps.departureDate * 1000)
  //     })
  //   }
  //   if (this.props.returnDate !== nextProps.returnDate) {
  //     this.setState({returnDate: moment(nextProps.returnDate * 1000)})
  //   }
  //   if (this.props.departureIATA !== nextProps.departureIATA || this.props.arrivalIATA !== nextProps.arrivalIATA) {
  //     this.setState({
  //       departureIATA: nextProps.departureIATA,
  //       arrivalIATA: nextProps.arrivalIATA
  //     })
  //     // find the departure/arrival location from airports.json
  //     var departureRow = airports.find(e => {
  //       return e.iata === nextProps.departureIATA
  //     })
  //     console.log('DEPARTURE ROW IS AIRPORT', departureRow)
  //     if (departureRow) {
  //       var departureLocation = {
  //         name: departureRow.name,
  //         iata: departureRow.iata,
  //         type: 'airport'
  //       }
  //     } else {
  //       departureRow = airports.find(e => {
  //         return e.cityCode === nextProps.departureIATA
  //       })
  //       console.log('ELSE', departureRow)
  //       departureLocation = {
  //         name: departureRow.city,
  //         iata: departureRow.iata,
  //         type: 'city'
  //       }
  //     }
  //     var arrivalRow = airports.find(e => {
  //       return e.iata === nextProps.arrivalIATA
  //     })
  //     if (arrivalRow) {
  //       var arrivalLocation = {
  //         name: arrivalRow.name,
  //         iata: arrivalRow.iata,
  //         type: 'airport'
  //       }
  //     } else {
  //       arrivalRow = airports.find(e => {
  //         return e.cityCode === nextProps.arrivalIATA
  //       })
  //       arrivalLocation = {
  //         name: arrivalRow.city,
  //         iata: arrivalRow.iata,
  //         type: 'city'
  //       }
  //     }
  //     this.setState({
  //       departureLocation: departureLocation,
  //       arrivalLocation: arrivalLocation
  //     })
  //   }
  // }

  render () {
    return (
      <div style={{position: 'relative'}}>
        <div style={{...eventDescContainerStyle, ...{marginTop: '55px'}}}>
          <AirportSearch edit currentLocation={this.state.departureLocation} placeholder={'Departure City/Airport'} selectLocation={details => this.selectLocation('departure', details)} />
          <p style={{textAlign: 'center'}}>to</p>
          <AirportSearch edit currentLocation={this.state.arrivalLocation} placeholder={'Arrival City/Airport'} selectLocation={details => this.selectLocation('arrival', details)} />
        </div>

        {/* DATEBOX */}
        <div style={{textAlign: 'center'}}>
          <div style={{display: 'inline-block', width: '25%'}}>
            <DatePicker customInput={<CustomDatePicker flight />} selected={this.state.departureDate} dateFormat={'DD MMM YYYY'} minDate={moment(this.props.dates[0])} maxDate={moment(this.props.dates[this.props.dates.length - 1])} onSelect={(e) => this.handleChange(e, 'departureDate')} />
          </div>
          <div style={{display: 'inline-block', width: '25%'}}>
            <DatePicker customInput={<CustomDatePicker flight />} selected={this.state.returnDate} dateFormat={'DD MMM YYYY'} minDate={moment(this.props.dates[0])} maxDate={moment(this.props.dates[this.props.dates.length - 1])} onSelect={(e) => this.handleChange(e, 'returnDate')} />
          </div>

          <select value={this.state.classCode} onChange={(e) => this.handleChange(e, 'classCode')} style={{backgroundColor: 'transparent', marginRight: '5px'}} >
            <option style={{color: 'black'}} value='Economy'>E</option>
            <option style={{color: 'black'}} value='PremiumEconomy'>PE</option>
            <option style={{color: 'black'}} value='Business'>B</option>
            <option style={{color: 'black'}} value='First'>F</option>
          </select>

          <select value={this.state.paxAdults} onChange={(e) => this.handleChange(e, 'paxAdults')} style={{width: '10%', backgroundColor: 'transparent', marginRight: '5px'}} >
            {[1, 2, 3, 4, 5, 6].map((num) => {
              return <option key={num} style={{color: 'black'}}>{num}</option>
            })}
          </select>
          <select value={this.state.paxChildren} onChange={(e) => this.handleChange(e, 'paxChildren')} style={{width: '10%', backgroundColor: 'transparent', marginRight: '5px'}} >
            {[0, 1, 2, 3, 4, 5, 6].map((num) => {
              return <option key={num} style={{color: 'black'}}>{num}</option>
            })}
          </select>
          <select value={this.state.paxInfants} onChange={(e) => this.handleChange(e, 'paxInfants')} style={{width: '10%', backgroundColor: 'transparent', marginRight: '5px'}} >
            {[0, 1, 2, 3, 4, 5, 6].map((num) => {
              return <option key={num} style={{color: 'black'}}>{num}</option>
            })}
          </select>
        </div>

        <div style={{marginBottom: '10px', textAlign: 'center'}}>
          <span style={{width: '25%', display: 'inline-block', textAlign: 'center'}}>Departing</span>
          <span style={{width: '25%', display: 'inline-block', textAlign: 'center'}}>Returning</span>
          <span style={{width: '10%', display: 'inline-block', textAlign: 'center', marginRight: '5px'}}>Class</span>
          <span style={{width: '10%', display: 'inline-block', textAlign: 'center', marginRight: '5px'}}>Adults</span>
          <span style={{width: '10%', display: 'inline-block', textAlign: 'center', marginRight: '5px'}}>2-11y</span>
          <span style={{width: '10%', display: 'inline-block', textAlign: 'center', marginRight: '5px'}}>{'<2y'}</span>
        </div>

        <button onClick={() => this.handleFlightSearch()} style={{color: 'black'}}>Search</button>
      </div>
    )
  }
}

export default EditFormAirhobSearchParams
