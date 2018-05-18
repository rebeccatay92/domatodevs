import React, { Component } from 'react'
import Radium from 'radium'

class MapCustomDatePicker extends Component {
  render () {
    return (
      <button
        key='datePicker'
        onClick={this.props.onClick}
        style={{backgroundColor: 'white', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', height: '30px', fontSize: '12px', padding: '6px', verticalAlign: 'middle', margin: 0}}>
        <span>{this.props.value}</span>
      </button>
    )
  }
}

export default Radium(MapCustomDatePicker)
