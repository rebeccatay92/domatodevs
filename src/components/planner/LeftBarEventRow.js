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
      <tr style={{width: '100%', height: '83px', ':hover': {background: 'rgb(245, 245, 245)'}}}>
        <td>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <i className='material-icons'>brightness_1</i>
          </div>
        </td>
        <td style={{width: '113px', textAlign: 'center'}}>
          {startTime || '---'}
        </td>
        <td>
          {eventType} + {locationObj ? locationObj.name : '---'}
        </td>
      </tr>
    )
  }
}

export default Radium(LeftBarEventRow)
