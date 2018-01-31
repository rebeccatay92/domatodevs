import React, { Component } from 'react'
import Radium from 'radium'
import airports from '../../data/airports.json'
import { locationDropdownStyle, intuitiveDropdownStyle } from '../../Styles/styles'

class AirportResults extends Component {
  handleClick (cityOrAirport) {
    if (cityOrAirport.id) {
      cityOrAirport.type = 'airport'
    } else {
      cityOrAirport.type = 'city'
    }
    this.props.selectLocation(cityOrAirport)
  }

  render () {
    var cityCodes = []
    var cities = []

    // extract all possible cities
    this.props.results.forEach(e => {
      if (e.cityCode && !cityCodes.includes(e.cityCode)) {
        cityCodes.push(e.cityCode)
        cities.push({name: e.city, country: e.country, cityCode: e.cityCode, latitude: e.cityLat, longitude: e.cityLng})
      }
    })

    var airportsInCities = airports.filter(row => {
      return cityCodes.includes(row.cityCode)
    })

    var airportsWithoutCities = this.props.results.filter(row => {
      return !row.cityCode
    })

    return (
      <div style={this.props.intuitiveInput ? intuitiveDropdownStyle : locationDropdownStyle}>
        {cities.map((city, i) => {
          var cityCode = city.cityCode
          return <div key={`city${i}`}>
            <div style={{padding: '5px 5px 10px 5px', ':hover': {backgroundColor: 'rgb(210, 210, 210)', cursor: 'default'}}} onClick={() => this.handleClick(city)}>
              <h5 style={{fontSize: '1em', margin: '0', color: '#3C3A44', display: 'inline'}}><i className='material-icons' style={{fontSize: '18px', color: '#3c3a44', verticalAlign: 'top'}}>location_city</i> {city.name}, {city.cityCode}, {city.country}</h5>
            </div>

            {airportsInCities.map((airport, i) => {
              if (airport.cityCode === cityCode) {
                return (
                  <div style={{padding: '5px 5px 10px 5px', ':hover': {backgroundColor: 'rgb(210, 210, 210)', cursor: 'default'}}} key={`cityairportrow${i}`} onClick={() => this.handleClick(airport)}>
                    <i className='material-icons' style={{fontSize: '18px', color: '#3c3a44', verticalAlign: 'top'}}>subdirectory_arrow_right</i> <i className='material-icons' style={{fontSize: '18px', color: '#3c3a44', verticalAlign: 'top', marginRight: '2px'}}>local_airport</i>
                    <div style={{display: 'inline-block', width: this.props.intuitiveInput ? '83%' : '87%'}}>
                      <h5 style={{fontSize: '1em', margin: '0', color: '#3C3A44', display: 'inline'}}>
                        {airport.name}, {airport.city}, {airport.iata}
                      </h5>
                    </div>
                  </div>
                )
              }
            })}
          </div>
        })}
        {airportsWithoutCities.map((result, i) => {
          return (
            <div style={{padding: '5px 5px 10px 5px', ':hover': {backgroundColor: 'rgb(210, 210, 210)', cursor: 'default'}}} key={`airportrow${i}`} onClick={() => this.handleClick(result)}>
              <i className='material-icons' style={{fontSize: '18px', color: '#3c3a44', verticalAlign: 'top', marginRight: '2px'}}>local_airport</i>
              <div style={{display: 'inline-block', width: '91%'}}>
                <h5 style={{fontSize: '1em', margin: '0', color: '#3C3A44', display: 'inline'}}>{result.name}, {result.city}, {result.iata}</h5>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default Radium(AirportResults)
