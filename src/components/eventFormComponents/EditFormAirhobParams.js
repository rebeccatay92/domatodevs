import React, { Component } from 'react'
import AirportSearch from './AirportSearch'
import Radium from 'radium'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CustomDatePicker from './CustomDatePicker'
import airports from '../../data/airports.json'

import { eventDescContainerStyle } from '../../Styles/styles'

class EditFormAirhobParams extends Component {
  constructor (props) {
    super(props)
    this.state = {
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

  componentWillReceiveProps (nextProps) {
    if (this.props.departureDate !== nextProps.departureDate) {
      this.setState({
        departureDate: moment(nextProps.departureDate * 1000)
      })
    }
    if (this.props.returnDate !== nextProps.returnDate) {
      this.setState({returnDate: moment(nextProps.returnDate * 1000)})
    }
    if (this.props.departureIATA !== nextProps.departureIATA || this.props.arrivalIATA !== nextProps.arrivalIATA) {
      this.setState({
        departureIATA: nextProps.departureIATA,
        arrivalIATA: nextProps.arrivalIATA
      })
      // find the departure/arrival location from airports.json
      var departureRow = airports.find(e => {
        return e.iata === nextProps.departureIATA
      })
      if (departureRow) {
        var departureLocation = {
          name: departureRow.name,
          iata: departureRow.iata,
          type: 'airport'
        }
      } else {
        departureRow = airports.find(e => {
          return e.cityCode === nextProps.departureIATA
        })
        departureLocation = {
          name: departureRow.city,
          iata: departureRow.iata,
          type: 'city'
        }
      }
      var arrivalRow = airports.find(e => {
        return e.iata === nextProps.arrivalIATA
      })
      if (arrivalRow) {
        var arrivalLocation = {
          name: arrivalRow.name,
          iata: arrivalRow.iata,
          type: 'airport'
        }
      } else {
        arrivalRow = airports.find(e => {
          return e.cityCode === nextProps.arrivalIATA
        })
        arrivalLocation = {
          name: arrivalRow.city,
          iata: arrivalRow.iata,
          type: 'city'
        }
      }
      this.setState({
        departureLocation: departureLocation,
        arrivalLocation: arrivalLocation
      })
    }
  }

  render () {
    return (
      <div style={{position: 'relative'}}>
        <div style={{...eventDescContainerStyle, ...{marginTop: '55px'}}}>
          <AirportSearch currentLocation={this.state.departureLocation} placeholder={'Departure City/Airport'} selectLocation={details => this.selectLocation('departure', details)} />

          <p style={{textAlign: 'center'}}>to</p>

          <AirportSearch currentLocation={this.state.arrivalLocation} placeholder={'Arrival City/Airport'} selectLocation={details => this.selectLocation('arrival', details)} />
        </div>

        {/* DATEBOX */}
        <div style={{textAlign: 'center'}}>
          <div style={{display: 'inline-block', width: '25%'}}>
            <DatePicker customInput={<CustomDatePicker flight />} selected={this.state.departureDate} dateFormat={'DD MMM YYYY'} minDate={moment(this.props.dates[0])} maxDate={moment(this.props.dates[this.props.dates.length - 1])} onSelect={(e) => this.handleChange(e, 'departureDate')} />
          </div>
          <div style={{display: 'inline-block', width: '25%'}}>
            <DatePicker customInput={<CustomDatePicker flight />} selected={this.state.returnDate} dateFormat={'DD MMM YYYY'} minDate={moment(this.props.dates[0])} maxDate={moment(this.props.dates[this.props.dates.length - 1])} onSelect={(e) => this.handleChange(e, 'returnDate')} />
          </div>

          <select value={this.props.classCode} onChange={(e) => this.handleChange(e, 'classCode')} style={{backgroundColor: 'transparent', marginRight: '5px'}}>
            <option style={{color: 'black'}} value='Economy'>E</option>
            <option style={{color: 'black'}} value='PremiumEconomy'>PE</option>
            <option style={{color: 'black'}} value='Business'>B</option>
            <option style={{color: 'black'}} value='First'>F</option>
          </select>

          <select value={this.props.paxAdults} onChange={(e) => this.handleChange(e, 'paxAdults')} style={{width: '10%', backgroundColor: 'transparent', marginRight: '5px'}}>
            {[1, 2, 3, 4, 5, 6].map((num) => {
              return <option key={num} style={{color: 'black'}}>{num}</option>
            })}
          </select>
          <select value={this.props.paxChildren} onChange={(e) => this.handleChange(e, 'paxChildren')} style={{width: '10%', backgroundColor: 'transparent', marginRight: '5px'}}>
            {[0, 1, 2, 3, 4, 5, 6].map((num) => {
              return <option key={num} style={{color: 'black'}}>{num}</option>
            })}
          </select>
          <select value={this.props.paxInfants} onChange={(e) => this.handleChange(e, 'paxInfants')} style={{width: '10%', backgroundColor: 'transparent', marginRight: '5px'}}>
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
      </div>
    )
  }
}

export default EditFormAirhobParams
