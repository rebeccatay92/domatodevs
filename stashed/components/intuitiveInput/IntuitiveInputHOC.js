import React, { Component } from 'react'
import Radium from 'radium'
import IntuitiveFlightInput from './IntuitiveFlightInput'
import IntuitiveActivityInput from './IntuitiveActivityInput'
import IntuitiveFoodInput from './IntuitiveFoodInput'
import IntuitiveTransportInput from './IntuitiveTransportInput'
import IntuitiveLodgingInput from './IntuitiveLodgingInput'

import { activityIconStyle, createEventBoxStyle, createEventPickOneStyle } from '../../Styles/styles'

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

  inputFocus (e) {
    this.setState({
      active: true
    })
  }

  inputBlur (e) {
    if (!this.state.active) return
    this.setState({
      active: false
    })
  }

  render () {
    const IntuitiveInput = this.components[this.props.intuitiveInputType]
    const iconTypes = ['directions_run', 'restaurant', 'hotel', 'flight', 'directions_subway', 'local_car_wash', 'directions_boat']
    const eventTypes = ['Activity', 'Food', 'Lodging', 'Flight', 'Train', 'LandTransport', 'SeaTransport']
    return (
      <div style={{opacity: this.state.active ? '1.0' : '0.3', ':hover': {opacity: '1.0'}}}>
        <IntuitiveInput itineraryId={this.props.itineraryId} dates={this.props.dates} day={this.props.day} daysArr={this.props.daysArr} date={this.props.date} toggleIntuitiveInput={() => this.props.toggleIntuitiveInput()} handleCreateEventClick={(eventType) => this.props.handleCreateEventClick(eventType)} type={this.props.intuitiveInputType} inputFocus={(e) => this.inputFocus(e)} inputBlur={(e) => this.inputBlur(e)} />
        <div style={{...createEventBoxStyle, ...{position: 'absolute', top: '52px', padding: '0'}}}>
          <span className='createEventBox' style={{marginLeft: '8px'}}>
            {iconTypes.map((type, i) => {
              return (
                <i title={eventTypes[i]} key={i} onClick={() => this.props.handleIntuitiveInput(eventTypes[i])} className='material-icons' style={{...activityIconStyle, ...eventTypes[i] === this.props.intuitiveInputType && {WebkitTextStroke: '1px #ed685a'}}}>{type}</i>
              )
            })}
            <span style={createEventPickOneStyle}>Pick One</span>
          </span>
        </div>
      </div>
    )
  }
}

export default Radium(IntuitiveInputHOC)
