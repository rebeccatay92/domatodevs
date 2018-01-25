import React, { Component } from 'react'
import moment from 'moment'

import { timelineStyle } from '../../Styles/styles'

class FlightSearchDetails extends Component {
  render () {
    const pStyle = {
      margin: '0'
    }
    const infoStyle = {...pStyle,
      ...{
        fontSize: '14px'
      }
    }
    const cityCountryStyle = {...pStyle,
      ...{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '100%',
        fontSize: '14px'
      }
    }
    const totalHours = Math.floor(this.props.flight[this.props.index].duration / 60) ? Math.floor(this.props.flight[this.props.index].duration / 60) + ' h ' : null
    const totalMins = this.props.flight[this.props.index].duration % 60
    let layoverTime, layoverHours, layoverMins
    if (this.props.allFlights.flights.length > 1 && this.props.index === 1) {
      layoverTime = moment(new Date(this.props.flight[this.props.index].departureDateTime) - new Date(this.props.flight[this.props.index - 1].arrivalDateTime)).unix()
      layoverHours = Math.floor(layoverTime / 3600) ? Math.floor(layoverTime / 3600) + ' h ' : null
      layoverMins = layoverTime % 3600 / 60
    }
    return (
      <div style={{textAlign: 'center', fontSize: '18px', color: 'white', position: 'relative'}}>
        {this.props.first ? this.props.depart ? <p>Departing Flight</p> : <p>Return Flight</p> : (
          <table style={{width: '100%', tableLayout: 'fixed', position: 'relative', height: '90px'}}>
            <tbody>
              <tr>
                <td style={{width: '100%'}}>
                  {((this.props.allFlights.flights.length === 4 && this.props.tripType === 'R') || (this.props.allFlights.flights.length === 2 && this.props.tripType === 'O')) && <div style={{...timelineStyle, ...{height: '55%', backgroundColor: 'white', opacity: '0.5', top: '-22%'}}} />}
                  {this.props.allFlights.flights.length === 2 && this.props.tripType === 'R' ? <p>Return Flight</p> : <p style={infoStyle}>layover {layoverHours}{layoverMins} m</p>}
                  {((this.props.allFlights.flights.length === 4 && this.props.tripType === 'R') || (this.props.allFlights.flights.length === 2 && this.props.tripType === 'O')) && <div style={{...timelineStyle, ...{height: '55%', top: '67%', backgroundColor: 'white', opacity: '0.5'}}} />}
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <table style={{width: '100%', tableLayout: 'fixed'}}>
          <tbody>
            <tr>
              <td style={{width: '40%', textAlign: 'right', verticalAlign: 'top'}}>
                <p style={pStyle}>{this.props.flight[this.props.index].departureAirportCode}</p>
                {/* DEPARTURE LOCATION IS A STRING HERE. */}
                <p style={infoStyle}>{this.props.flight[this.props.index].departureLocation}</p>
                <p style={cityCountryStyle}>{this.props.flight[this.props.index].departureCityCountry}</p>
                <p style={infoStyle}>Terminal {this.props.flight[this.props.index].departureTerminal}</p>
                <p style={infoStyle}>{moment(this.props.flight[this.props.index].departureDateTime).format('DD/MM/YYYY, HH:mm')}</p>
              </td>
              <td style={{width: '20%'}}>
                <img src={`${process.env.PUBLIC_URL}/img/airlinelogos/${this.props.flight[this.props.index].carrierCode}.png`} style={{height: '24px'}} />
                <p style={infoStyle}>{this.props.flight[this.props.index].carrierCode} {this.props.flight[this.props.index].flightNum}</p>
                <p style={infoStyle}>{totalHours}{totalMins} m</p>
              </td>
              <td style={{width: '40%', textAlign: 'left', verticalAlign: 'top'}}>
                <p style={pStyle}>{this.props.flight[this.props.index].arrivalAirportCode}</p>
                <p style={infoStyle}>{this.props.flight[this.props.index].arrivalLocation}</p>
                <p style={{...cityCountryStyle, ...{width: '99%'}}}>{this.props.flight[this.props.index].arrivalCityCountry}</p>
                <p style={infoStyle}>Terminal {this.props.flight[this.props.index].arrivalTerminal}</p>
                <p style={infoStyle}>{moment(this.props.flight[this.props.index].arrivalDateTime).format('DD/MM/YYYY, HH:mm')}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default FlightSearchDetails
