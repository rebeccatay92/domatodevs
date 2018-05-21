import React, { Component } from 'react'

class LeftBarEventRow extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    // console.log('this.props.event', this.props.event)
    return (
      <tr style={{width: '100%', height: '83px'}}>
        <td>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <i className='material-icons'>brightness_1</i>
          </div>
        </td>
        <td style={{width: '113px', textAlign: 'center'}}>time</td>
        <td>EventType + Location inputs</td>
      </tr>
    )
  }
}

export default LeftBarEventRow
