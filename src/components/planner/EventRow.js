import React, { Component } from 'react'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'
import { DropTarget, DragSource } from 'react-dnd'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'

import EventRowInfoCell from './EventRowInfoCell'

class EventRow extends Component {
  render () {
    const { columns, event, index, day } = this.props
    let columnState = []
    columns.forEach(column => {
      if (columnState.filter(e => e.name === column).length === 0) {
        columnState.push({name: column, width: 1})
      } else if (columnState.filter(e => e.name === column).length > 0) {
        columnState[columnState.length - 1].width++
      }
    })

    const startTime = new Date(event.startTime * 1000).toGMTString().substring(17, 22)
    return (
      <tr>
        <td style={{width: '0px'}}><div style={{minHeight: '83px'}} /></td>
        <td style={{width: '114px', textAlign: 'center'}}>{startTime}</td>
        {columnState.map((column, i) => {
          return <td key={i} style={{width: `calc(232px * ${column.width})`, maxWidth: `calc(232px * ${column.width})`}} colSpan={column.width}>
            <EventRowInfoCell column={column.name} index={index} day={day} />
          </td>
        })}
      </tr>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    columns: state.columns
  }
}

export default connect(mapStateToProps)(EventRow)
