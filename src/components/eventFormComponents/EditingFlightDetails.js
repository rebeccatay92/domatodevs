import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import AirportOnlyAutocomplete from './AirportOnlyAutoComplete'

class EditingFlightDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      flightInstances: [],
      isReturn: false,
      instanceIndexToShow: [], // index 0,1,2,3 of which instances to show, only use when 4 instances
      tabsNeeded: false // tabs will be true if 4 instances. 2one way, or 2 return will only use 1 page
    }
  }
  switchTab (type) {
    if (type === 'outgoing') {
      this.setState({instanceIndexToShow: [0, 1]})
    } else if (type === 'retuning') {
      this.setState({instanceIndexToShow: [2, 3]})
    }
  }

  changeFlightDetails () {
    // hoist flight instances up
    console.log('edit flight details confirmed')
  }

  handleChange (e, i, field) {
    var instanceClone = JSON.parse(JSON.stringify(this.state.flightInstances[i]))
    if (field === 'departureTerminal' || field === 'arrivalTerminal') {
      // console.log('value', e.target.value)
      instanceClone[field] = e.target.value
      // console.log('instanceClone', instanceClone)
      this.setState({flightInstances: this.state.flightInstances.slice(0, i).concat(instanceClone).concat(this.state.flightInstances.slice(i + 1))}, () => {
        console.log('updated instances', this.state.flightInstances)
      })
    }
  }

  handleAirportChange (airportDetails, i, field) {
    // edit flight details, handle airport change
    console.log('airportDetails', airportDetails)
    var instanceClone = JSON.parse(JSON.stringify(this.state.flightInstances[i]))
    // change departureAirport, departureIATA, departureCityCountry
    instanceClone[`${field}IATA`] = airportDetails.iata
    instanceClone[`${field}Airport`] = airportDetails.name
    instanceClone[`${field}CityCountry`] = airportDetails.city + ', ' + airportDetails.country

    this.setState({flightInstances: this.state.flightInstances.slice(0, i).concat(instanceClone).concat(this.state.flightInstances.slice(i + 1))}, () => {
      console.log('updated instances', this.state.flightInstances)
    })
    // durationMins?
  }

  componentDidMount () {
    this.setState({flightInstances: this.props.flightInstances})
    if (this.props.returnDate) {
      this.setState({isReturn: true})
    }
    // by default if tabs, then show outgoing leg
    if (this.props.flightInstances.length === 4) {
      this.setState({tabsNeeded: true, instanceIndexToShow: [0, 1]}, () => console.log('state', this.state))
    }
  }

  render () {
    return (
      <div>
        {this.state.tabsNeeded &&
          <div>
            <h3 style={{display: 'inline-block', marginRight: '20px'}} onClick={() => this.switchTab('outgoing')}>Outgoing Flights</h3>
            <h3 style={{display: 'inline-block', marginRight: '20px'}} onClick={() => this.switchTab('returning')}>Returning Flights</h3>
          </div>
        }
        {this.state.flightInstances.map((instance, i) => {
          if (!this.state.tabsNeeded || (this.state.tabsNeeded && this.state.instanceIndexToShow.includes(i))) {
            return (
              <div key={'instance' + i}>
                <h3>{instance.departureIATA} to {instance.arrivalIATA}</h3>
                <div>
                  <AirportOnlyAutocomplete iata={instance.departureIATA} handleAirportChange={(details) => this.handleAirportChange(details, i, 'departure')} />
                  <label>
                    Departure Terminal:
                    <input type='text' name='departureTerminal' value={instance.departureTerminal} onChange={(e) => this.handleChange(e, i, 'departureTerminal')} />
                  </label>
                  <h5>Departure DateTime:</h5>
                </div>
                <div>
                  <AirportOnlyAutocomplete iata={instance.arrivalIATA} handleAirportChange={(details) => this.handleAirportChange(details, i, 'arrival')} />
                  <label>
                    Arrival Terminal:
                    <input type='text' name='arrivalTerminal' value={instance.arrivalTerminal} onChange={(e) => this.handleChange(e, i, 'arrivalTerminal')} />
                  </label>
                  <h5>Arrival DateTime:</h5>
                </div>
              </div>
            )
          } else {
            return null
          }
        })}
        <div style={{position: 'absolute', right: '0', bottom: '0', padding: '10px'}}>
          <Button bsStyle='danger' onClick={() => this.props.toggleEditingFlightDetails()} style={{marginRight: '5px'}}>Cancel</Button>
          <Button bsStyle='danger' onClick={() => this.changeFlightDetails()} style={{marginRight: '5px'}}>Edit</Button>
        </div>
      </div>
    )
  }
}

export default EditingFlightDetails
