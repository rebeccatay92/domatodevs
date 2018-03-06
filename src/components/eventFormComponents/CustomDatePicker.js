import React, { Component } from 'react'
import Radium from 'radium'

class CustomDatePicker extends Component {
  render () {
    return (
      <button
        key='datePicker'
        onClick={this.props.onClick}
        style={{verticalAlign: this.props.flight ? 'middle' : '', border: '0px', width: this.props.flight ? '5.15625vw' : '6.97916666667vw', height: '3.24074074074vh', fontSize: '1.48148148148vh', background: 'rgba(245, 245, 245, 0.1)', borderBottom: '1px solid white', fontWeight: '300', padding: '0.74074074074vh 0.41666666666vw', borderRadius: '2px', ':hover': {boxShadow: '0 1px 0 #FFF'}}}>
        <span style={{position: 'relative', top: '-2px'}}>{this.props.value}</span>
      </button>
    )
  }
}

export default Radium(CustomDatePicker)
