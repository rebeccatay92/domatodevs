import React, { Component } from 'react'
import Radium from 'radium'

class LeftBarEventRow extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    // console.log('this.props.event', this.props.event)
    let startTime = this.props.event.startTime
    let eventType = this.props.event.eventType.getPlainText()
    let locationObj = this.props.event.locationObj
    // console.log('startTime', startTime, 'type', eventType, 'location', locationObj)
    return (
      <div style={{display: 'flex', width: '100%', height: '83px', ':hover': {background: 'rgb(245, 245, 245)'}}}>
        <div style={{width: '50px', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          {locationObj && locationObj.address &&
            <i className='material-icons'>place</i>
          }
          {(!locationObj || !locationObj.address) &&
            <i className='material-icons'>not_listed_location</i>
          }
        </div>
        <div style={{width: '113px', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <input type='time' value={startTime} style={{fontFamily: 'Roboto, sans-serif', fontWeight: '300', fontSize: '16px', color: 'rgba(60, 58, 68, 1)', outline: 'none', background: 'inherit'}} disabled />
        </div>
        <div style={{width: '226px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <span>{eventType}</span>
          <span>{locationObj ? locationObj.name : '---'}</span>
        </div>
      </div>
    )
  }
}

export default Radium(LeftBarEventRow)
