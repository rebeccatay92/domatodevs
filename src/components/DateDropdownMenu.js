import React, { Component } from 'react'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'

class DateDropdownMenu extends Component {
  handleClickOutside (event) {
    this.props.toggleDateDropdown(event)
  }

  deleteDay () {
    console.log(this.props.day)
  }

  render () {
    return (
      <div style={{width: '145px', position: 'absolute', right: '-156px', top: '15px', backgroundColor: 'white', zIndex: 1, cursor: 'default', boxShadow: '0px 1px 5px 2px rgba(0, 0, 0, .2)'}}>
        <div style={{margin: '8px', lineHeight: '100%'}}>
          <span key='delete' onClick={() => this.deleteDay()} style={{fontSize: '16px', fontWeight: '300', color: '#3C3A44', ':hover': {color: '#ed685a'}}}>Delete Day</span>
        </div>
        <div style={{margin: '8px', lineHeight: '100%'}}>
          <span key='empty' onClick={() => this.deleteDay()} style={{fontSize: '16px', fontWeight: '300', color: '#3C3A44', ':hover': {color: '#ed685a'}}}>Clear Day</span>
        </div>
      </div>
    )
  }
}

export default onClickOutside(Radium(DateDropdownMenu))
