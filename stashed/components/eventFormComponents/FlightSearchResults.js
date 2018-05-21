import React, { Component } from 'react'
import moment from 'moment'
import Radium from 'radium'
import { searchResultsTableStyle } from '../../Styles/styles'
import FlightSearchResultsRow from './FlightSearchResultsRow'

class FlightSearchResults extends Component {
  render () {
    return (
      <div>
        <table style={{...searchResultsTableStyle, ...{width: '755px'}}}>
          <thead>
            <tr>
              <th style={{width: '86px', textAlign: 'center'}}>
              </th>
              <th style={{width: '70px', textAlign: 'center', fontSize: '16px', fontWeight: '400'}}>
                Departure
              </th>
              <th style={{width: '375px', textAlign: 'center', fontSize: '16px', fontWeight: '400'}}>
                Duration
              </th>
              <th style={{width: '70px', textAlign: 'center', fontSize: '16px', fontWeight: '400'}}>
                Arrival
              </th>
              <th style={{width: '154px', textAlign: 'center', fontSize: '16px', fontWeight: '400'}}>
                Estimated Cost
              </th>
            </tr>
          </thead>
        </table>
        <div className='flightSearchResults' style={{overflowY: 'auto', height: '704px', marginTop: '-8px'}}>
          <table style={searchResultsTableStyle}>
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
        </div>
      </div>
    )
  }
}

export default FlightSearchResults
