import React, { Component } from 'react'
import { Button } from 'react-bootstrap'

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
                  <h5>Departure Airport: {instance.departureAirport}</h5>
                  <h5>Departure Terminal: {instance.departureTerminal}</h5>
                  <h5>Departure DateTime:</h5>
                </div>
                <div>
                  <h5>Arrival Airport: {instance.arrivalAirport}</h5>
                  <h5>Arrival Terminal: {instance.arrivalTerminal}</h5>
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
