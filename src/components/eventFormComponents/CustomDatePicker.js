import React, { Component } from 'react'
import Radium from 'radium'

class CustomDatePicker extends Component {
  render () {
    return (
      <button
        key='datePicker'
        onClick={this.props.onClick}
        style={{verticalAlign: this.props.flight ? 'middle' : '', border: '0px', width: '162px', minHeight: '24.5px', fontSize: this.props.flight ? '16px' : '18px', background: 'rgba(255, 255, 255, 0.2)', textTransform: 'uppercase', padding: '5px', ':hover': {boxShadow: '0 1px 0 #FFF'}}}>
        {this.props.value}
      </button>
    )
  }
}

export default Radium(CustomDatePicker)
