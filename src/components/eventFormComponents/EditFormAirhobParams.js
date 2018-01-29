import React, { Component } from 'react'
import AirportSearch from './AirportSearch'
import Radium from 'radium'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CustomDatePicker from './CustomDatePicker'
import airports from '../../data/airports.json'

import { eventDescContainerStyle, locationSelectionInputStyle } from '../../Styles/styles'

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

  // if back button is clicked in search, repopulate fields with db data
  componentDidMount () {
    if (!this.props.departureDate) return
    this.setState({
      departureDate: moment(this.props.departureDate * 1000),
      returnDate: this.props.returnDate ? moment(this.props.returnDate * 1000) : null,
      departureIATA: this.props.departureIATA,
      arrivalIATA: this.props.arrivalIATA
    })
    var departureRow = airports.find(e => {
      return e.iata === this.props.departureIATA
    })
    // console.log('DEPARTURE ROW IS AIRPORT', departureRow)
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
      // console.log('ELSE', departureRow)
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
  }

  // component was already mounted. but after apollo query returns, update fields
  componentWillReceiveProps (nextProps) {
    // console.log('AIRHOB PARAMS RECEIVED PROPS', nextProps)
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
      // console.log('DEPARTURE ROW IS AIRPORT', departureRow)
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
        // console.log('ELSE', departureRow)
        departureLocation = {
          name: departureRow.city,
          cityCode: departureRow.iata,
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
          cityCode: arrivalRow.iata,
          type: 'city'
        }
      }
      this.setState({
        departureLocation: departureLocation,
        arrivalLocation: arrivalLocation
      })
      this.setState({
        classCode: nextProps.classCode,
        paxAdults: nextProps.paxAdults,
        paxChildren: nextProps.paxChildren,
        paxInfants: nextProps.paxInfants
      })
    }
  }

  render () {
    // console.log('AIRHOB PARAMS', this.state)
    return (
      <div style={{position: 'relative'}}>
        <div style={{...eventDescContainerStyle, ...{marginTop: '55px'}}}>
          {/* <AirportSearch currentLocation={this.state.departureLocation} placeholder={'Departure City/Airport'} selectLocation={details => this.selectLocation('departure', details)} /> */}
          {this.state.departureLocation &&
            <p style={{...locationSelectionInputStyle(this.state.marginTop, 'flight'), ...{fontSize: '36px'}}}>{this.state.departureLocation.name}</p>
          }
          <p style={{textAlign: 'center'}}>to</p>
          {this.state.arrivalLocation &&
            <p style={{...locationSelectionInputStyle(this.state.marginTop, 'flight'), ...{fontSize: '36px'}}}>{this.state.arrivalLocation.name}</p>
          }
          {/* <AirportSearch currentLocation={this.state.arrivalLocation} placeholder={'Arrival City/Airport'} selectLocation={details => this.selectLocation('arrival', details)} /> */}
        </div>

        {/* DATEBOX */}
        <div style={{textAlign: 'center'}}>
          <div style={{display: 'inline-block', width: '25%'}}>
            {this.state.departureDate &&
              <p style={{...locationSelectionInputStyle(0, 'flight'), ...{fontSize: '16px', fontWeight: '300', textTransform: 'uppercase'}}}>{this.state.departureDate.format('DD MMM YYYY').toString()}</p>
            }
            {/* <DatePicker customInput={<CustomDatePicker flight />} selected={this.state.departureDate} dateFormat={'DD MMM YYYY'} minDate={moment(this.props.dates[0])} maxDate={moment(this.props.dates[this.props.dates.length - 1])} onSelect={(e) => this.handleChange(e, 'departureDate')} disabled /> */}
          </div>
          <div style={{display: 'inline-block', width: '25%'}}>
            {this.state.returnDate &&
              <p style={{...locationSelectionInputStyle(0, 'flight'), ...{fontSize: '16px', fontWeight: '300', textTransform: 'uppercase'}}}>{this.state.returnDate.format('DD MMM YYYY').toString()}</p>
            }
            {/* <DatePicker customInput={<CustomDatePicker flight />} selected={this.state.returnDate} dateFormat={'DD MMM YYYY'} minDate={moment(this.props.dates[0])} maxDate={moment(this.props.dates[this.props.dates.length - 1])} onSelect={(e) => this.handleChange(e, 'returnDate')} disabled /> */}
          </div>

          <select value={this.state.classCode} onChange={(e) => this.handleChange(e, 'classCode')} style={{backgroundColor: 'transparent', marginRight: '5px'}} disabled>
            <option style={{color: 'black'}} value='Economy'>E</option>
            <option style={{color: 'black'}} value='PremiumEconomy'>PE</option>
            <option style={{color: 'black'}} value='Business'>B</option>
            <option style={{color: 'black'}} value='First'>F</option>
          </select>

          <select value={this.state.paxAdults} onChange={(e) => this.handleChange(e, 'paxAdults')} style={{width: '10%', backgroundColor: 'transparent', marginRight: '5px'}} disabled>
            {[1, 2, 3, 4, 5, 6].map((num) => {
              return <option key={num} style={{color: 'black'}}>{num}</option>
            })}
          </select>
          <select value={this.state.paxChildren} onChange={(e) => this.handleChange(e, 'paxChildren')} style={{width: '10%', backgroundColor: 'transparent', marginRight: '5px'}} disabled>
            {[0, 1, 2, 3, 4, 5, 6].map((num) => {
              return <option key={num} style={{color: 'black'}}>{num}</option>
            })}
          </select>
          <select value={this.state.paxInfants} onChange={(e) => this.handleChange(e, 'paxInfants')} style={{width: '10%', backgroundColor: 'transparent', marginRight: '5px'}} disabled>
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
