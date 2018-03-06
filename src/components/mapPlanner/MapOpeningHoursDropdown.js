import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'

class MapOpeningHoursDropdown extends Component {
  // constructor (props) {
  //   super(props)
  // }

  handleClickOutside () {
    this.props.toggleOpeningHoursInfo()
  }

  render () {
    return (
      <div>
        <div style={{position: 'fixed', background: 'white', zIndex: '2'}}>
          {this.props.textArr.map((text, index) => {
            return <h5 key={index} style={{fontSize: '10px'}}>{text}</h5>
          })}
        </div>
      </div>
    )
  }
}

export default onClickOutside(MapOpeningHoursDropdown)
