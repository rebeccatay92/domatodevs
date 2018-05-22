import React, { Component } from 'react'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'
import { DropTarget, DragSource } from 'react-dnd'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'

import EventRowInfoCell from './EventRowInfoCell'
import EventRowTimeCell from './EventRowTimeCell'
import EventRowLocationCell from './EventRowLocationCell'

class EventRow extends Component {
  render () {
    const { columns, index, id } = this.props
    let columnState = []
    let activeColumn = ''
    columns.forEach((column, i) => {
      if (i > 0) activeColumn = columns[i - 1]
      if (activeColumn !== column) {
        columnState.push({name: column, width: 1})
      } else if (activeColumn === column) {
        columnState[columnState.length - 1].width++
      }
    })
    // console.log('columnState', columnState)

    // const startTime = new Date(event.startTime * 1000).toGMTString().substring(17, 22)
    return (
      <tr>
        <td style={{width: '0px'}}><div style={{minHeight: '83px'}} /></td>
        <td style={{width: '114px', textAlign: 'center'}}>
          <EventRowTimeCell index={index} id={id} />
        </td>
        {columnState.map((column, i) => {
          return <td key={i} style={{width: `calc(232px * ${column.width})`, maxWidth: `calc(232px * ${column.width})`}} colSpan={column.width}>
            {column.name === 'Location' &&
              <EventRowLocationCell id={id} />
            }
            {column.name !== 'Location' &&
              <EventRowInfoCell column={column.name} index={index} id={id} />
            }
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
