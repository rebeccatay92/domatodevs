import React, { Component } from 'react'

class CustomDateInput extends Component {
  render () {
    return (
      <button className='planner-right-bar-date-picker-input' onClick={this.props.onClick} style={{background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', height: '35px'}}>
        {this.props.value}
      </button>
    )
  }
}

export default CustomDateInput
