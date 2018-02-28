import React, { Component } from 'react'
import Radium from 'radium'

class CustomDatePicker extends Component {
  render () {
    return (
      <button
        key='datePicker'
        onClick={this.props.onClick}
        style={{verticalAlign: this.props.flight ? 'middle' : '', border: '0px', width: '191px', height: '45px', fontSize: this.props.flight ? '16px' : '24px', background: 'rgba(255, 255, 255, 0.3)', fontWeight: '100', padding: '8px', ':hover': {boxShadow: '0 1px 0 #FFF'}}}>
        <span style={{position: 'relative', top: '-2px'}}>{this.props.value}</span>
      </button>
    )
  }
}

export default Radium(CustomDatePicker)
