import React, { Component } from 'react'
import Radium from 'radium'
import { connect } from 'react-redux'
import onClickOutside from 'react-onclickoutside'

import ColumnHeaderDropdown from './ColumnHeaderDropdown'

class ColumnHeader extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showDropdown: false
    }
  }

  disableDropdown () {
    this.setState({showDropdown: false})
  }

  render () {
    const { name, colSpan, startingColumn, endingColumn } = this.props
    return (
      <td className='planner-column-header' colSpan={colSpan} style={{width: `calc(232px * ${colSpan})`, padding: '0 8px', height: '40px', position: 'relative', cursor: 'default'}}>
        {name}
        <i onClick={() => this.setState({showDropdown: !this.state.showDropdown})} className={`material-icons planner-column-header-arrow ${name}`} style={{verticalAlign: 'top', fontSize: '20px'}}>keyboard_arrow_down</i>
        {this.state.showDropdown && <ColumnHeaderDropdown disableDropdown={() => this.disableDropdown()} name={name} startingColumn={startingColumn} endingColumn={endingColumn} />}
      </td>
    )
  }
}

export default ColumnHeader
