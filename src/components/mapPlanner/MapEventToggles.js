import React, { Component } from 'react'
import Radium from 'radium'
import { activityIconStyle } from '../../Styles/styles'

const primaryColor = '#ED685A'
const secondaryFontColor = '#9FACBC'
const backgroundColor = '#FAFAFA'

var iconNotSelectedStyle = {
  display: 'inline-block',
  width: '20%',
  fontSize: '24px',
  cursor: 'pointer',
  WebkitTextFillColor: backgroundColor,
  WebkitTextStroke: '1px ' + secondaryFontColor
}
var iconSelectedStyle = {
  display: 'inline-block',
  width: '20%',
  fontSize: '24px',
  cursor: 'pointer',
  WebkitTextFillColor: backgroundColor,
  WebkitTextStroke: '1px ' + primaryColor
}

class MapEventToggles extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <div>
        <div key={'mapeventtoggle1'} style={this.props.eventType === 'Activity' ? iconSelectedStyle : iconNotSelectedStyle} onClick={() => this.props.changeEventType('Activity')}>
          <i className='material-icons'>directions_run</i>
        </div>
        <div key={'mapeventtoggle2'} style={this.props.eventType === 'Food' ? iconSelectedStyle : iconNotSelectedStyle} onClick={() => this.props.changeEventType('Food')}>
          <i className='material-icons'>restaurant</i>
        </div>
        <div key={'mapeventtoggle3'} style={this.props.eventType === 'Lodging' ? iconSelectedStyle : iconNotSelectedStyle} onClick={() => this.props.changeEventType('Lodging')}>
          <i className='material-icons'>hotel</i>
        </div>
        <div key={'mapeventtoggle4'} style={this.props.eventType === 'LandTransport' ? iconSelectedStyle : iconNotSelectedStyle} onClick={() => this.props.changeEventType('LandTransport')}>
          <i className='material-icons'>local_car_wash</i>
        </div>
      </div>
    )
  }
}

export default Radium(MapEventToggles)
