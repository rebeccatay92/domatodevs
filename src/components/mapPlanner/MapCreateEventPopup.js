import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import MapEventToggles from './MapEventToggles'
import MapCreateEventInput from './MapCreateEventInput'

class MapCreateEventPopup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ItineraryId: this.props.ItineraryId,
      startDay: 0,
      endDay: 0,
      startTime: null,
      endTime: null
    }
    // keep event state here to send to backend. submit button submits the state held here. createeventhoc only passes props down to input fields
  }

  // POP UP CONTAINS CREATEEVENT COMPONENT + EVENT TYPE TOGGLES + BUTTONS

  createEvent () {
    console.log('create event', this.props.eventType)
  }

  toggleCreateEventForm () {
    console.log('open create event form', this.props.eventType)
  }

  render () {
    return (
      <div>
        <MapCreateEventInput eventType={this.props.eventType} />

        <MapEventToggles eventType={this.props.eventType} changeEventType={(type) => this.props.changeEventType(type)} />

        <div style={{position: 'absolute', right: '0', bottom: '0'}}>
          <Button bsStyle='danger' style={{backgroundColor: '#ed685a'}} onClick={() => this.createEvent()}>Submit</Button>
          <Button bsStyle='default' style={{}} onClick={() => this.props.closeSearchPopup()}>Cancel</Button>
          <Button bsStyle='default' style={{}} onClick={() => this.toggleCreateEventForm()} >More</Button>
        </div>
      </div>
    )
  }
}

export default MapCreateEventPopup
