import React, { Component } from 'react'
import Radium from 'radium'
import { connect } from 'react-redux'
import onClickOutside from 'react-onclickoutside'

class ColumnHeader extends Component {
  render () {
    const { name, colSpan } = this.props
    return (
      <td colSpan={colSpan} style={{width: `calc(232px * ${colSpan})`}}>{name}</td>
    )
  }
}

export default ColumnHeader
