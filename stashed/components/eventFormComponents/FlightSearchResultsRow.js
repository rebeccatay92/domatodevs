import React, { Component } from 'react'
import moment from 'moment'
import Radium from 'radium'

class FlightSearchResultsRow extends Component {
  render () {
    if (this.props.tripType === 'O') {
      return (
        <tbody>
          <tr key={this.props.index} onClick={() => this.props.handleSelectFlight(this.props.index)} style={{...{height: '80px', boxShadow: '0px 3px 6px 0px rgba(0, 0, 0, .2)', ':hover': { backgroundColor: '#F5F5F5' }}, ...this.props.selected === this.props.index && {outline: '1px solid #438496'}}}>
            <td style={{textAlign: 'center', padding: '0 8px', width: '90px'}}>
              <img src={`${process.env.PUBLIC_URL}/img/airlinelogos/${this.props.flight.flights[0].carrierCode}.png`} style={{height: '16px'}} />
              <span style={{display: 'block', fontSize: '13px'}}>
                {this.props.flight.flights[0].airlineName}
              </span>
            </td>
            <td style={{textAlign: 'center', width: '66px'}}>
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>{moment(this.props.flight.flights[0].departureDateTime).format('HH:mm')}</p>
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>{this.props.flight.flights[0].departureAirportCode}</p>
            </td>
            <td style={{textAlign: 'center', width: '377px'}}>
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>{this.props.totalHours + this.props.totalMins + ' min'}</p>
              <hr style={{width: '387px', height: '1px', margin: '0 0 0 -5px'}} />
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>{this.props.flight.flights.length > 1 ? 'layover ' + this.props.layoverHours + this.props.layoverMins + ' min in ' + this.props.layoverAirport : 'no layover'}</p>
            </td>
            <td style={{textAlign: 'center', padding: '5px', width: '66px'}}>
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>{moment(this.props.flight.flights[this.props.flight.flights.length - 1].arrivalDateTime).format('HH:mm')}</p>
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>{this.props.flight.flights[this.props.flight.flights.length - 1].arrivalAirportCode}</p>
            </td>
            <td style={{textAlign: 'center', fontSize: '21px', width: '154px'}}>
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>USD {this.props.flight.cost}</p>
            </td>
          </tr>
        </tbody>
      )
    } else if (this.props.tripType === 'R') {
      const onwardLastFlightIndex = this.props.flight.flights.length === 2 ? 0 : 1
      const returnFirstFlightIndex = onwardLastFlightIndex + 1
      return (
        <tbody key={this.props.index} onClick={() => this.props.handleSelectFlight(this.props.index)} style={{...{':hover': { backgroundColor: '#FAFAFA', outline: '0.5px solid rgba(0, 0, 0, .1)' }}, ...this.props.selected === this.props.index && {backgroundColor: '#FAFAFA', outline: '0.5px solid rgba(0, 0, 0, .1)'}}}>
          <tr style={{height: '9vh'}}>
            <td style={{textAlign: 'center', padding: '0  5px', width: '10%'}}>
              <img src={`${process.env.PUBLIC_URL}/img/airlinelogos/${this.props.flight.flights[0].carrierCode}.png`} style={{height: '16px'}} />
              <span style={{display: 'block', fontSize: '13px'}}>
                {this.props.flight.flights[0].airlineName}
              </span>
            </td>
            <td style={{textAlign: 'center', padding: '5px', width: '10%'}}>
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>{moment(this.props.flight.flights[0].departureDateTime).format('HH:mm')}</p>
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>{this.props.flight.flights[0].departureAirportCode}</p>
            </td>
            <td style={{textAlign: 'center', width: '45%'}}>
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>{this.props.totalHours + this.props.totalMins + ' min'}</p>
              <hr style={{width: '100%', height: '1px', margin: 0}} />
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>{onwardLastFlightIndex !== 0 ? this.props.layoverHours + this.props.layoverMins + ' min ' + this.props.layoverAirport : 'no layover'}</p>
            </td>
            <td style={{textAlign: 'center', padding: '5px', width: '10%'}}>
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>{moment(this.props.flight.flights[onwardLastFlightIndex].arrivalDateTime).format('HH:mm')}</p>
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>{this.props.flight.flights[onwardLastFlightIndex].arrivalAirportCode}</p>
            </td>
            <td style={{textAlign: 'center', fontSize: '20px', width: '25%'}} rowSpan='2'>
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>USD {this.props.flight.cost}</p>
            </td>
          </tr>
          <tr style={{height: '9vh'}}>
            <td style={{textAlign: 'center', padding: '0  5px', width: '10%'}}>
              <img src={`${process.env.PUBLIC_URL}/img/airlinelogos/${this.props.flight.flights[returnFirstFlightIndex].carrierCode}.png`} style={{height: '16px'}} />
              <span style={{display: 'block', fontSize: '13px'}}>
                {this.props.flight.flights[returnFirstFlightIndex].airlineName}
              </span>
            </td>
            <td style={{textAlign: 'center', padding: '5px', width: '10%'}}>
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>{moment(this.props.flight.flights[returnFirstFlightIndex].departureDateTime).format('HH:mm')}</p>
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>{this.props.flight.flights[returnFirstFlightIndex].departureAirportCode}</p>
            </td>
            <td style={{textAlign: 'center', width: '45%'}}>
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>{this.props.returnTotalHours + this.props.returnTotalMins + ' min'}</p>
              <hr style={{width: '100%', height: '1px', margin: 0}} />
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>{this.props.flight.flights.length - 1 > returnFirstFlightIndex ? this.props.returnLayoverHours + this.props.returnLayoverMins + ' min ' + this.props.returnLayoverAirport : 'no layover'}</p>
            </td>
            <td style={{textAlign: 'center', padding: '5px', width: '10%'}}>
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>{moment(this.props.flight.flights[this.props.flight.flights.length - 1].arrivalDateTime).format('HH:mm')}</p>
              <p style={{margin: 0, color: '#3C3A44', opacity: this.props.selected === this.props.index ? '1' : '0.7'}}>{this.props.flight.flights[this.props.flight.flights.length - 1].arrivalAirportCode}</p>
            </td>
          </tr>
        </tbody>
      )
    } else {
      return null
    }
  }
}

export default Radium(FlightSearchResultsRow)
