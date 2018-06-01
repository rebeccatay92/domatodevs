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
import { initializeEvents, plannerEventHoverOverEvent, dropPlannerEvent } from '../../actions/planner/eventsActions'

// helpers
import { initializeEventsHelper } from '../../helpers/initializeEvents'

const eventRowSource = {
  beginDrag (props) {
    return {...props.event, ...{index: props.index}}
  },
  endDrag (props, monitor) {
    if (!monitor.didDrop()) {
      initializeEventsHelper(props.data.findItinerary.events, props.initializeEvents)
    }
  }
}

const eventRowTarget = {
  hover (props, monitor) {
    if (props.event.dropzone) return
    let day = props.event.startDay
    if (monitor.getItemType() === 'plannerEvent') {
      props.plannerEventHoverOverEvent(props.index, monitor.getItem(), day)
    }
  },
  drop (props, monitor) {
    let day = props.event.startDay
    if (day === monitor.getItem().day && monitor.getItem().index === props.index) {
      initializeEventsHelper(props.data.findItinerary.events, props.initializeEvents)
      return
    }
    const newEvent = {
      ...monitor.getItem(),
      ...{
        startDay: day
      }
    }
    props.dropPlannerEvent(newEvent, props.index)
  }
}

function collectTarget (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

function collectSource (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    getItem: monitor.getItem(),
    isDragging: monitor.isDragging()
  }
}

class EventRow extends Component {
  constructor (props) {
    super(props)

    this.state = {
      hover: false
    }
  }

  handleDelete () {
    this.props.toggleSpinner(true)
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
    const { columns, id, connectDropTarget, connectDragSource, connectDragPreview, event, isDragging } = this.props
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

    if (event.dropzone) {
      return connectDropTarget(
        <tr>
          <td style={{width: '0px'}}>
            <div style={{minHeight: '83px', position: 'relative', display: 'flex', alignItems: 'center'}} />
          </td>
          <td colSpan={5} />
        </tr>
      )
    }
    return connectDropTarget(connectDragPreview(
      <tr style={{position: 'relative'}} onMouseOver={() => this.setState({hover: true})} onMouseOut={() => this.setState({hover: false})}>
        <td style={{width: '0px'}}>
          <div style={{minHeight: '83px', position: 'relative', display: 'flex', alignItems: 'center'}}>
            {connectDragSource(<i className='material-icons drag-handle' style={{position: 'absolute', right: 0, display: this.state.hover && !isDragging ? 'initial' : 'none', cursor: 'pointer', opacity: '0.2'}}>drag_indicator</i>)}
          </div>
        </td>
        <td className='planner-table-cell' style={{width: '114px', textAlign: 'center'}}>
          <EventRowTimeCell id={id} />
        </td>
        {columnState.map((column, i) => {
          return <td className='planner-table-cell' key={i} style={{width: `calc(232px * ${column.width})`, maxWidth: `calc(232px * ${column.width})`}} colSpan={column.width}>
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
    ))
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
    initializeEvents: (events) => {
      dispatch(initializeEvents(events))
    },
    plannerEventHoverOverEvent: (index, event, day) => {
      dispatch(plannerEventHoverOverEvent(index, event, day))
    },
    dropPlannerEvent: (event, index) => {
      dispatch(dropPlannerEvent(event, index))
    }
  }
}

const options = {
  options: props => ({
    variables: {
      id: props.itineraryId
    }
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(queryItinerary, options),
  graphql(deleteEvent, { name: 'deleteEvent' })
)(DragSource('plannerEvent', eventRowSource, collectSource)(DropTarget(['plannerEvent', 'bucketItem'], eventRowTarget, collectTarget)(EventRow))))
