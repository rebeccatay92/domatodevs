import React, { Component } from 'react'
import IntuitiveFlightInput from './IntuitiveFlightInput'
import IntuitiveActivityInput from './IntuitiveActivityInput'
import IntuitiveFoodInput from './IntuitiveFoodInput'
import IntuitiveTransportInput from './IntuitiveTransportInput'
import IntuitiveLodgingInput from './IntuitiveLodgingInput'

class IntuitiveInputHOC extends Component {
  constructor (props) {
    super(props)
    this.components = {
      Activity: IntuitiveActivityInput,
      Food: IntuitiveFoodInput,
      Lodging: IntuitiveLodgingInput,
      LandTransport: IntuitiveTransportInput,
      SeaTransport: IntuitiveTransportInput,
      Train: IntuitiveTransportInput,
      Flight: IntuitiveFlightInput
    }
  }
  render () {
    const IntuitiveInput = this.components[this.props.intuitiveInputType]
    return (
      <IntuitiveInput itineraryId={this.props.itineraryId} dates={this.props.dates} day={this.props.day} date={this.props.date} toggleIntuitiveInput={() => this.props.toggleIntuitiveInput()} handleCreateEventClick={(eventType) => this.props.handleCreateEventClick(eventType)} type={this.props.intuitiveInputType} />
    )
  }
}

export default IntuitiveInputHOC
