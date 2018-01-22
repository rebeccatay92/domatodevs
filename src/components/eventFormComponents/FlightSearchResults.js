import React, { Component } from 'react'
import moment from 'moment'
import Radium from 'radium'
import { searchResultsTableStyle } from '../../Styles/styles'
import FlightSearchResultsRow from './FlightSearchResultsRow'

class FlightSearchResults extends Component {
  render () {
    return (
      <table style={searchResultsTableStyle}>
        <thead>
          <tr style={{width: '660px', position: 'fixed', top: '35px'}}>
            <th style={{width: '10%', textAlign: 'center'}}>

            </th>
            <th style={{width: '10%', textAlign: 'center'}}>
              Departure
            </th>
            <th style={{width: '45%', textAlign: 'center'}}>
              Duration
            </th>
            <th style={{width: '10%', textAlign: 'center'}}>
              Arrival
            </th>
            <th style={{width: '25%', textAlign: 'center'}}>
              Estimated Cost
            </th>
          </tr>
        </thead>
        {this.props.flights.map((flight, i) => {
          const totalHours = Math.floor(flight.totalDuration[0] / 60) ? Math.floor(flight.totalDuration[0] / 60) + ' h ' : null
          const totalMins = flight.totalDuration[0] % 60
          const returnTotalHours = Math.floor(flight.totalDuration[1] / 60) ? Math.floor(flight.totalDuration[1] / 60) + ' h ' : null
          const returnTotalMins = flight.totalDuration[1] % 60
          let layoverTime, layoverHours, layoverMins, layoverAirport, returnLayoverTime, returnLayoverHours, returnLayoverMins, returnLayoverAirport
          if (flight.flights.length > 1) {
            layoverTime = moment(new Date(flight.flights[1].departureDateTime) - new Date(flight.flights[0].arrivalDateTime)).unix()
            layoverHours = Math.floor(layoverTime / 3600) ? Math.floor(layoverTime / 3600) + ' h ' : null
            layoverMins = layoverTime % 3600 / 60
            layoverAirport = flight.flights[0].arrivalAirportCode
            if (flight.flights.length === 4) {
              returnLayoverTime = moment(new Date(flight.flights[3].departureDateTime) - new Date(flight.flights[2].arrivalDateTime)).unix()
              returnLayoverHours = Math.floor(returnLayoverTime / 3600) ? Math.floor(returnLayoverTime / 3600) + ' h ' : null
              returnLayoverMins = returnLayoverTime % 3600 / 60
              returnLayoverAirport = flight.flights[2].arrivalAirportCode
            }
          }
          return (
            flight.flights.length < 5 && flight.flights.length !== 3 && <FlightSearchResultsRow key={i} index={i} handleSelectFlight={(index) => this.props.handleSelectFlight(index)} selected={this.props.selected} flight={flight} totalHours={totalHours} totalMins={totalMins} returnTotalHours={returnTotalHours} returnTotalMins={returnTotalMins} layoverHours={layoverHours} layoverMins={layoverMins} layoverAirport={layoverAirport} returnLayoverHours={returnLayoverHours} returnLayoverMins={returnLayoverMins} returnLayoverAirport={returnLayoverAirport} tripType={this.props.tripType} />
          )
        })}
      </table>
    )
  }
}

export default FlightSearchResults
