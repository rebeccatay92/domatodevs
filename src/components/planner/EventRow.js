import React, { Component } from 'react'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'
import { DropTarget, DragSource } from 'react-dnd'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import { ContentState } from 'draft-js'

import { queryItinerary } from '../../apollo/itinerary'
import { deleteEvent, createEvent, changingLoadSequence } from '../../apollo/event'
import { updateBucket } from '../../apollo/bucket'

import EventRowInfoCell from './EventRowInfoCell'
import EventRowTimeCell from './EventRowTimeCell'
import EventRowLocationCell from './EventRowLocationCell'

import { toggleSpinner } from '../../actions/spinnerActions'
import { updateActiveEvent } from '../../actions/planner/activeEventActions'
import { setRightBarFocusedTab, switchToMapView } from '../../actions/planner/plannerViewActions'
import { initializeEvents, hoverOverEvent, dropPlannerEvent, updateEvent } from '../../actions/planner/eventsActions'
import { ensureDayIsChecked, setPopupToShow } from '../../actions/planner/mapboxActions'

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
      props.hoverOverEvent(props.index, monitor.getItem(), day)
    } else if (monitor.getItemType() === 'bucketItem') {
      props.hoverOverEvent(props.index, {id: 'bucketItem'}, day)
    }
  },
  drop (props, monitor) {
    let day = props.event.startDay
    let draggedItem = monitor.getItem()
    if (monitor.getItemType() === 'plannerEvent' && day === draggedItem.day && draggedItem.index === props.index) {
      initializeEventsHelper(props.data.findItinerary.events, props.initializeEvents)
      return
    }
    if (monitor.getItemType() === 'plannerEvent') {
      const newEvent = {
        ...draggedItem,
        ...{
          startDay: day
        }
      }
      props.dropPlannerEvent(newEvent, props.index)
    } else if (monitor.getItemType() === 'bucketItem') {
      props.createEvent({
        variables: {
          ItineraryId: props.itineraryId,
          startDay: day,
          loadSequence: props.index + 1,
          eventType: draggedItem.bucketCategory,
          notes: draggedItem.notes,
          LocationID: draggedItem.location.id
        }
      })
      .then(res => {
        const newEvent = {
          id: res.data.createEvent.id,
          ItineraryId: props.itineraryId,
          currency: null,
          startDay: day,
          startTime: '',
          endTime: '',
          eventType: ContentState.createFromText(draggedItem.bucketCategory),
          // content state for place name
          locationName: draggedItem.location ? ContentState.createFromText(draggedItem.location.name) : ContentState.createFromText(''),
          // regular json object holding verified, name, address, latlng, countrycode.
          locationObj: draggedItem.location ? {
            verified: draggedItem.location.verified,
            name: draggedItem.location.name,
            address: draggedItem.location.address,
            latitude: draggedItem.location.latitude,
            longitude: draggedItem.location.longitude,
            countryCode: draggedItem.location.country ? draggedItem.location.country.code : ''
          } : null,
          cost: ContentState.createFromText(''),
          notes: draggedItem.notes ? ContentState.createFromText(draggedItem.notes) : ContentState.createFromText(''),
          bookingService: ContentState.createFromText(''),
          bookingConfirmation: ContentState.createFromText('')
        }
        props.dropPlannerEvent(newEvent, props.index)
      })
      .then(() => {
        props.updateBucket({
          variables: {
            id: draggedItem.id,
            visited: true
          }
        })
      })
    }
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

  openInMap () {
    let thisEvent = this.props.events.events.find(e => {
      return e.id === this.props.activeEventId
    })
    let startDay = thisEvent.startDay
    this.props.ensureDayIsChecked(startDay)
    this.props.switchToMapView()
    // this.props.setRightBarFocusedTab('event')
    this.props.setPopupToShow('event')
  }

  // handleDuplicate () {
  //   const { event } = this.props
  //   this.props.updateEvent(null, null, null, false)
  //   this.props.toggleSpinner(true)
  // }

  render () {
    const { columns, id, connectDropTarget, connectDragSource, connectDragPreview, event, isDragging, sortOptions, index, day } = this.props
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
            {sortOptions.type === 'unsorted' && connectDragSource(<i onMouseDown={() => this.setState({mouseOverDragHandler: true}, () => {
              setTimeout(() => this.setState({mouseOverDragHandler: false}), 1000)
            })} className='material-icons drag-handle' style={{position: 'absolute', right: 0, display: this.state.hover && !isDragging ? 'initial' : 'none', cursor: 'pointer', opacity: '0.2'}}>unfold_more</i>)}
          </div>
        </td>
        <td className='planner-table-cell' style={{width: '114px', textAlign: 'center'}}>
          <ContextMenuTrigger id={`eventRowContextMenu-${id}`}>
            <EventRowTimeCell id={id} columnState={columnState} day={day} eventIndex={index} />
          </ContextMenuTrigger>
        </td>
        {columnState.map((column, i) => {
          return <td className='planner-table-cell' key={i} style={{width: `calc(232px * ${column.width})`, maxWidth: `calc(232px * ${column.width})`}} colSpan={column.width}>
            {column.name === 'Location' &&
              <ContextMenuTrigger id={`eventRowContextMenu-${id}`}>
                <EventRowLocationCell column={column.name} id={id} columnState={columnState} index={i} day={day} eventIndex={index} />
              </ContextMenuTrigger>
            }
            {column.name !== 'Location' &&
              <ContextMenuTrigger id={`eventRowContextMenu-${id}`}>
                <EventRowInfoCell column={column.name} id={id} columnState={columnState} index={i} day={day} eventIndex={index} />
              </ContextMenuTrigger>
            }
          </td>
        })}
        <td style={{position: 'absolute'}}>
          <i className='material-icons delete-event-button' style={{fontSize: '16px', opacity: '0.2', cursor: 'pointer', position: 'relative', top: '16px'}} onClick={() => this.handleDelete()}>close</i>
        </td>
        <td>
          {!this.state.mouseOverDragHandler && <ContextMenu id={`eventRowContextMenu-${id}`}>
            <MenuItem onClick={() => this.handleDelete()}>
              Delete Row
            </MenuItem>
            <MenuItem divider />
            <MenuItem onClick={() => this.openInMap()}>
              Show On Map
            </MenuItem>
          </ContextMenu>}
        </td>
      </tr>
    ))
  }
}

const mapStateToProps = (state) => {
  return {
    columns: state.columns,
    sortOptions: state.sortOptions,
    events: state.events,
    activeEventId: state.activeEventId
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
    },
    initializeEvents: (events) => {
      dispatch(initializeEvents(events))
    },
    hoverOverEvent: (index, event, day) => {
      dispatch(hoverOverEvent(index, event, day))
    },
    dropPlannerEvent: (event, index) => {
      dispatch(dropPlannerEvent(event, index))
    },
    updateEvent: (id, property, value, fromSidebar) => {
      return dispatch(updateEvent(id, property, value, fromSidebar))
    },
    switchToMapView: () => {
      dispatch(switchToMapView())
    },
    ensureDayIsChecked: (day) => {
      dispatch(ensureDayIsChecked(day))
    },
    setPopupToShow: (name) => {
      dispatch(setPopupToShow(name))
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
  graphql(deleteEvent, { name: 'deleteEvent' }),
  graphql(createEvent, { name: 'createEvent' }),
  graphql(updateBucket, { name: 'updateBucket' }),
  graphql(changingLoadSequence, { name: 'changingLoadSequence' })
)(DragSource('plannerEvent', eventRowSource, collectSource)(DropTarget(['plannerEvent', 'bucketItem'], eventRowTarget, collectTarget)(EventRow))))
