import React, { Component } from 'react'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'
import { DropTarget, DragSource } from 'react-dnd'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'

import { queryItinerary } from '../../apollo/itinerary'
import { deleteEvent } from '../../apollo/event'

import EventRowInfoCell from './EventRowInfoCell'
import EventRowTimeCell from './EventRowTimeCell'
import EventRowLocationCell from './EventRowLocationCell'

import { toggleSpinner } from '../../actions/spinnerActions'
import { updateActiveEvent } from '../../actions/planner/activeEventActions'
import { setRightBarFocusedTab } from '../../actions/planner/plannerViewActions'

class EventRow extends Component {
  constructor (props) {
    super(props)

    this.state = {
      hover: false
    }
  }

  handleDelete () {
    this.props.toggleSpinner(true)

    // clear active event, close right bar first (else break)
    this.props.setRightBarFocusedTab('')
    this.props.updateActiveEvent('')

    this.props.deleteEvent({
      variables: {
        id: this.props.id
      },
      refetchQueries: [{
        query: queryItinerary,
        variables: {
          id: this.props.itineraryId
        }
      }]
    })
  }

  render () {
    const { columns, id } = this.props
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
      <tr style={{position: 'relative'}} onMouseOver={() => this.setState({hover: true})} onMouseOut={() => this.setState({hover: false})}>
        <td style={{width: '0px'}}><div style={{minHeight: '83px'}} /></td>
        <td style={{width: '114px', textAlign: 'center'}}>
          <EventRowTimeCell id={id} />
        </td>
        {columnState.map((column, i) => {
          return <td key={i} style={{width: `calc(232px * ${column.width})`, maxWidth: `calc(232px * ${column.width})`}} colSpan={column.width}>
            {column.name === 'Location' &&
              <EventRowLocationCell id={id} />
            }
            {column.name !== 'Location' &&
              <EventRowInfoCell column={column.name} id={id} />
            }
          </td>
        })}
        <td style={{position: 'absolute'}}>
          <i className='material-icons delete-event-button' style={{fontSize: '16px', opacity: '0.2', cursor: 'pointer', position: 'relative', top: '16px'}} onClick={() => this.handleDelete()}>close</i>
        </td>
      </tr>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    columns: state.columns
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSpinner: (spinner) => {
      dispatch(toggleSpinner(spinner))
    },
    updateActiveEvent: (id) => {
      dispatch(updateActiveEvent(id))
    },
    setRightBarFocusedTab: (tabName) => {
      dispatch(setRightBarFocusedTab(tabName))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(deleteEvent, { name: 'deleteEvent' })
)(EventRow))
