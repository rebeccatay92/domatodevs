import React, { Component } from 'react'
import Radium from 'radium'

class CustomDatePicker extends Component {
  render () {
    return (
      <button
        key='datePicker'
        onClick={this.props.onClick}
        style={{verticalAlign: this.props.flight ? 'middle' : '', border: '0px', width: '134px', height: '35px', fontSize: this.props.flight ? '16px' : '16px', background: 'rgba(245, 245, 245, 0.4)', fontWeight: '300', padding: '8px', borderRadius: '2px', ':hover': {boxShadow: '0 1px 0 #FFF'}}}>
        <span style={{position: 'relative', top: '-2px'}}>{this.props.value}</span>
      </button>
    )
  }
}

export default Radium(CustomDatePicker)
