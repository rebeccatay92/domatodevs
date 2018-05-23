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
      <td className={`planner-column-header planner-column-header ${name}`} colSpan={colSpan} style={{width: `calc(232px * ${colSpan})`, padding: '0 8px', height: '40px', position: 'relative', cursor: 'default'}} onClick={() => this.setState({showDropdown: !this.state.showDropdown})}>
        {name}
        <i className={`material-icons planner-column-header ${name}`} style={{verticalAlign: 'top', fontSize: '20px'}}>unfold_more</i>
        {this.state.showDropdown && <ColumnHeaderDropdown disableDropdown={() => this.disableDropdown()} name={name} startingColumn={startingColumn} endingColumn={endingColumn} />}
      </td>
    )
  }
}

export default ColumnHeader
