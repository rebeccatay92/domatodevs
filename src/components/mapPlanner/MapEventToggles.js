import React, { Component } from 'react'
import Radium from 'radium'
import { activityIconStyle } from '../../Styles/styles'

const primaryColor = '#ED685A'
const secondaryFontColor = '#9FACBC'
const backgroundColor = '#FAFAFA'

var iconNotSelectedStyle = {
  display: 'inline-block',
  width: '25%',
  fontSize: '24px',
  cursor: 'pointer',
  WebkitTextFillColor: backgroundColor,
  WebkitTextStroke: '1px ' + secondaryFontColor
}
var iconSelectedStyle = {
  display: 'inline-block',
  width: '25%',
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
        <div key={'mapeventtoggle1'} style={this.props.eventType === 'activity' ? iconSelectedStyle : iconNotSelectedStyle} onClick={() => this.props.changeEventType('activity')}>
          <i className='material-icons'>directions_run</i>
        </div>
        <div key={'mapeventtoggle2'} style={this.props.eventType === 'food' ? iconSelectedStyle : iconNotSelectedStyle} onClick={() => this.props.changeEventType('food')}>
          <i className='material-icons'>restaurant</i>
        </div>
        <div key={'mapeventtoggle3'} style={this.props.eventType === 'lodging' ? iconSelectedStyle : iconNotSelectedStyle} onClick={() => this.props.changeEventType('lodging')}>
          <i className='material-icons'>hotel</i>
        </div>
        <div key={'mapeventtoggle4'} style={this.props.eventType === 'landtransport' ? iconSelectedStyle : iconNotSelectedStyle} onClick={() => this.props.changeEventType('landtransport')}>
          <i className='material-icons'>local_car_wash</i>
        </div>
      </div>
    )
  }
}

export default Radium(MapEventToggles)
