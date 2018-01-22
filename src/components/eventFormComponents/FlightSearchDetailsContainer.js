import React, { Component } from 'react'

import FlightSearchDetails from './FlightSearchDetails'

class FlightSearchDetailsContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      flightDetailsPage: this.props.page
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      flightDetailsPage: nextProps.page
    })
  }

  render () {
    // console.log('SELECTED', this.props.selected)
    if (this.props.flights.length < 1) return null
    const flightsArr = this.props.flights[this.props.selected].flights
    if (flightsArr.length === 1) {
      return (
        <div style={{position: 'relative'}}>
          {flightsArr.map((flight, i) => {
            return (
              <FlightSearchDetails depart key={i} first={i === 0} allFlights={this.props.flights[this.props.selected]} flight={flightsArr} index={i} tripType={this.props.tripType} />
            )
          })}
        </div>
      )
    } else if (flightsArr.length === 2) {
      return (
        <div style={{position: 'relative'}}>
          {flightsArr.map((flight, i) => {
            return (
              <FlightSearchDetails depart key={i} first={i === 0} allFlights={this.props.flights[this.props.selected]} flight={flightsArr} index={i} tripType={this.props.tripType} />
            )
          })}
        </div>
      )
    } else if (flightsArr.length === 4 && this.state.flightDetailsPage === 1) {
      return (
        <div style={{position: 'relative'}}>
          {flightsArr.slice(0, 2).map((flight, i) => {
            return (
              <FlightSearchDetails depart key={i} first={i === 0} allFlights={this.props.flights[this.props.selected]} flight={flightsArr.slice(0, 2)} index={i} tripType={this.props.tripType} />
            )
          })}
          {this.state.flightDetailsPage === 1 && this.props.flights[this.props.selected].flights.length === 4 && <i onClick={() => this.setState({flightDetailsPage: 2})} className='material-icons' style={{cursor: 'pointer', position: 'absolute', top: '172px', right: '10px', fontSize: '50px'}}>chevron_right</i>}
        </div>
      )
    } else if (flightsArr.length === 4 && this.state.flightDetailsPage === 2) {
      return (
        <div style={{position: 'relative'}}>
          {flightsArr.slice(2).map((flight, i) => {
            return (
              <FlightSearchDetails key={i} first={i === 0} allFlights={this.props.flights[this.props.selected]} flight={flightsArr.slice(2)} index={i} tripType={this.props.tripType} />
            )
          })}
          {this.state.flightDetailsPage === 2 && this.props.flights[this.props.selected].flights.length === 4 && <i onClick={() => this.setState({flightDetailsPage: 1})} className='material-icons' style={{cursor: 'pointer', position: 'absolute', top: '172px', left: '10px', fontSize: '50px'}}>chevron_left</i>}
        </div>
      )
    } else return null
  }
}

export default FlightSearchDetailsContainer
