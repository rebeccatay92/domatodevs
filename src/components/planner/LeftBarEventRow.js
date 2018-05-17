import React, { Component } from 'react'

class LeftBarEventRow extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <tr style={{width: '100%', height: '83px', border: '1px solid blue'}}>
        <td>
          <i className='material-icons'>brightness_1</i>
        </td>
        <td>input</td>
      </tr>
    )
  }
}

export default LeftBarEventRow
