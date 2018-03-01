import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import { graphql, compose } from 'react-apollo'
import { DropTarget, DragSource } from 'react-dnd'
import { hoverOverActivity, dropActivity, plannerActivityHoverOverActivity, initializePlanner } from '../../actions/plannerActions'
import { setCurrentlyFocusedEvent, clearCurrentlyFocusedEvent } from '../../actions/mapPlannerActions'
import { queryItinerary } from '../../apollo/itinerary'
import ActivityInfo from '../ActivityInfo'

import { timelineStyle, eventBoxStyle, timelineColumnStyle, dateTableFirstHeaderStyle, mapPlannerEventBoxStyle, createEventTextStyle, activityIconStyle, createEventBoxStyle, createEventPickOneStyle, createEventBoxContainerStyle, plannerBlurredBackgroundStyle, expandedEventIconsBoxStyle, expandedEventIconsStyle, expandedEventBoxStyle, expandedEventBoxImageContainerStyle, expandedEventBoxImageStyle, expandedEventBoxTextBoxStyle } from '../../Styles/styles'

const _ = require('lodash')

const plannerActivitySource = {
  beginDrag (props) {
    return {...props.event, ...{index: props.index}}
  },
  endDrag (props, monitor) {
    if (!monitor.didDrop()) {
      props.initializePlanner(props.data.findItinerary.events)
    }
  }
}

const plannerActivityTarget = {
  hover (props, monitor, component) {
    let day = props.event.day
    if (props.event.dropzone) return
    // if (monitor.getItemType() === 'activity') props.hoverOverActivity(props.index, day)
    if (monitor.getItemType() === 'plannerActivity') props.plannerActivityHoverOverActivity(props.index, monitor.getItem(), day)
  },
  drop (props, monitor) {
    let day = props.event.day
    if (props.event.day === monitor.getItem().day && monitor.getItem().index === props.index) {
      props.initializePlanner(props.data.findItinerary.events)
      return
    }
    // const typeOfDays = {
    //   Activity: 'startDay',
    //   Food: 'startDay',
    //   Lodging: monitor.getItem().start ? 'startDay' : 'endDay',
    //   Transport: monitor.getItem().start ? 'startDay' : 'endDay',
    //   Flight: monitor.getItem().start ? 'startDay' : 'endDay'
    // }
    let newEvent = {...monitor.getItem(),
      ...{
        day: day
      }
    }
    props.dropActivity(newEvent, props.index)
    // if (monitor.getItemType() === 'activity') {
    //   props.deleteActivityFromBucket(monitor.getItem())
    // }

    // if drag and drop happens clear the currentlyFocusedEvent
    props.clearCurrentlyFocusedEvent()
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
    getItem: monitor.getItem()
  }
}

class SideBarEvent extends Component {
  constructor (props) {
    super(props)

    this.state = {
      hover: false,
      isCurrentFocus: false
    }
  }

  // keep isCurrentFocus in sync with redux state currentlyFocusedEvent
  componentWillReceiveProps (nextProps) {
    if (nextProps.currentlyFocusedEvent !== this.props.currentlyFocusedEvent) {
      var currentEventObj = this.makeCurrentEventObj(this.props.event)
      var isCurrentFocus = _.isEqual(currentEventObj, nextProps.currentlyFocusedEvent)
      this.setState({isCurrentFocus: isCurrentFocus})
    }
  }

  makeCurrentEventObj (event) {
    return {
      modelId: event.modelId,
      eventType: event.type,
      day: event.day,
      loadSequence: event.loadSequence,
      start: event.start,
      flightInstanceId: event.type === 'Flight' ? event.Flight.FlightInstance.id : null
    }
  }

  setCurrentlyFocusedEvent () {
    var currentlyClickedEvent = this.makeCurrentEventObj(this.props.event)
    this.props.setCurrentlyFocusedEvent(currentlyClickedEvent)
  }

  toggleCurrentlyFocusedEvent () {
    if (this.state.isCurrentFocus) {
      this.props.clearCurrentlyFocusedEvent()
    } else {
      this.setCurrentlyFocusedEvent()
    }
  }

  render () {
    const { connectDropTarget, connectDragSource, connectDragPreview, getItem } = this.props
    let minHeight
    if (!this.props.event.modelId && !this.props.empty) {
      minHeight = '12vh'
    }
    let type
    if (this.props.event.type) type = this.props.event.type

    let eventBox = (
      <tr onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})} onClick={() => this.toggleCurrentlyFocusedEvent()} style={{background: this.state.isCurrentFocus || this.state.hover ? '#ffc588' : '#FAFAFA'}}>
        <td>
          {connectDragPreview(<div style={mapPlannerEventBoxStyle(this.props.event, minHeight, getItem || {})} key={this.props.event.modelId}>
            {this.state.hover && !this.state.expanded && this.props.event.type !== 'Flight' && connectDragSource(<i className='material-icons' style={{opacity: getItem ? 0 : 1, position: 'absolute', top: '22px', right: '8%', cursor: 'move', zIndex: 2, ':hover': {color: '#ed685a'}}}>drag_handle</i>)}
            {this.renderInfo(this.props.event.type)}
          </div>)}
        </td>
      </tr>
    )
    return connectDropTarget(eventBox)
  }

  renderInfo (type) {
    const activityBoxStyle = {
      fontSize: '16px',
      marginLeft: '1vw',
      marginTop: '5px',
      fontWeight: '300',
      position: 'relative'
    }
    const nameStyle = {
      display: 'inline-block',
      margin: '10px 0 5 0',
      position: 'relative'
      // width: '300px',
      // overflow: 'hidden',
      // whiteSpace: 'nowrap',
      // textOverflow: 'ellipsis'
    }
    const typeStyle = {
      verticalAlign: 'top',
      padding: '1px',
      display: 'inline-block'
    }
    const timeStyle = {
      marginTop: 0,
      color: '#9FACBC',
      position: 'relative'
    }
    const errorIcon = (this.props.event.timelineClash || this.props.event.inBetweenStartEndRow) && <i onMouseEnter={() => this.setState({showClashes: true})} onMouseLeave={() => this.setState({showClashes: false})} className='material-icons' style={{position: 'absolute', top: '-2px', marginLeft: '4px', color: 'red'}}>error</i>

    const errorBox = this.state.showClashes && errorIcon && <span style={{display: 'block', position: 'absolute', width: 'fit-content', left: this.props.event.type === 'Food' || this.props.event.type === 'Activity' ? '117px' : '72px', top: '11px', backgroundColor: 'white', zIndex: 1, color: 'black', boxShadow: '0px 1px 5px 2px rgba(0, 0, 0, .2)'}}>{this.props.event.timelineClash && <span style={{display: 'block', padding: '8px'}}>Timing Clash</span>}{this.props.event.inBetweenStartEndRow && <span style={{display: 'block', padding: '8px'}}>Event happens between a flight/transport</span>}</span>

    let startTime = new Date(this.props.event[type].startTime * 1000).toGMTString().substring(17, 22)
    if (type === 'Flight') startTime = new Date(this.props.event[type].FlightInstance.startTime * 1000).toGMTString().substring(17, 22)
    let endTime = new Date(this.props.event[type].endTime * 1000).toGMTString().substring(17, 22)
    if (type === 'Flight') endTime = new Date(this.props.event[type].FlightInstance.endTime * 1000).toGMTString().substring(17, 22)

    let suggestedStartTime = this.props.event.suggestedStartTime && new Date(this.props.event.suggestedStartTime * 1000).toGMTString().substring(17, 22)
    let suggestedEndTime = this.props.event.suggestedEndTime && new Date(this.props.event.suggestedEndTime * 1000).toGMTString().substring(17, 22)

    if (type === 'Activity') {
      return (
        <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
          <p style={nameStyle}>
            <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.event.modelId} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.event[type].location && this.props.event[type].location.name} googlePlaceData={this.props.event[type].location} />
          </p>
          <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.event.modelId} itineraryId={this.props.itineraryId} type={type} name='time' startTime={startTime} endTime={endTime} timeStyle={timeStyle} typeStyle={typeStyle} errorBox={errorBox} errorIcon={errorIcon} allDay={this.props.event[type].allDayEvent} event={this.props.event[type]} editing={this.props.event.isDropped} suggestedStartTime={suggestedStartTime} suggestedEndTime={suggestedEndTime} newDay={this.props.event.newDay} />
        </div>
      )
    } else if (type === 'Flight') {
      if (this.props.event.start) {
        return (
          <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
            <p style={nameStyle}>
              <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.event.modelId} itineraryId={this.props.itineraryId} type={type} name='departureLocation' value={this.props.event[type].FlightInstance.departureLocation.name} />
            </p>
            <p style={timeStyle}><ActivityInfo activityId={this.props.event.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='departureTime' value={startTime} />{errorIcon}{errorBox}</p>
          </div>
        )
      } else if (!this.props.event.start) {
        return (
          <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
            <p style={nameStyle}>
              <ActivityInfo activityId={this.props.event.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalLocation' value={this.props.event[type].FlightInstance.arrivalLocation.name} />
            </p>
            <p style={timeStyle}><ActivityInfo activityId={this.props.event.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalTime' value={endTime} />{errorIcon}{errorBox}</p>
          </div>
        )
      }
    } else if (type === 'Food') {
      return (
        <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
          <p style={nameStyle}>
            <ActivityInfo activityId={this.props.event.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.event[type].location.name} googlePlaceData={this.props.event[type].location} />
          </p>
          <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.event.modelId} itineraryId={this.props.itineraryId} type={type} name='time' startTime={startTime} endTime={endTime} timeStyle={timeStyle} typeStyle={typeStyle} errorBox={errorBox} errorIcon={errorIcon} allDay={this.props.event[type].allDayEvent} event={this.props.event[type]} editing={this.props.event.isDropped} suggestedStartTime={suggestedStartTime} suggestedEndTime={suggestedEndTime}
            newDay={this.props.event.newDay} />
        </div>
      )
    } else if (type === 'LandTransport') {
      if (this.props.event.start) {
        return (
          <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
            <p style={nameStyle}>
              <ActivityInfo activityId={this.props.event.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='departureGooglePlaceData' value={this.props.event[type].departureLocation.name} googlePlaceData={this.props.event[type].departureLocation} />
            </p>
            <p style={timeStyle}><ActivityInfo activityId={this.props.event.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='startTime' value={startTime} event={this.props.event[type]} editing={this.props.event.isDropped} suggestedStartTime={suggestedStartTime} />{errorIcon}{errorBox}</p>
          </div>
        )
      } else if (!this.props.event.start) {
        return (
          <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
            <p style={nameStyle}>
              <ActivityInfo activityId={this.props.event.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalGooglePlaceData' value={this.props.event[type].arrivalLocation.name} googlePlaceData={this.props.event[type].arrivalLocation} />
            </p>
            <p style={timeStyle}><ActivityInfo activityId={this.props.event.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='endTime' value={endTime} event={this.props.event[type]} editing={this.props.event.isDropped} suggestedEndTime={suggestedEndTime} />{errorIcon}{errorBox}</p>
          </div>
        )
      }
    } else if (type === 'Lodging') {
      let time, name
      if (this.props.event.start) {
        time = startTime
        name = 'startTime'
      } else {
        time = endTime
        name = 'endTime'
      }
      return (
        <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
          <div style={{display: 'inline'}}>
            <p style={nameStyle}>
              <ActivityInfo activityId={this.props.event.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.event[type].location.name} googlePlaceData={this.props.event[type].location} />
            </p>
            <p style={timeStyle}><ActivityInfo activityId={this.props.event.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name={name} value={time} event={this.props.event[type]} editing={this.props.event.isDropped} suggestedStartTime={suggestedStartTime} suggestedEndTime={suggestedEndTime}
              newDay={this.props.event.newDay} />{errorIcon}{errorBox}</p>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    hoverOverActivity: (index, date) => {
      dispatch(hoverOverActivity(index, date))
    },
    dropActivity: (activity, index) => {
      dispatch(dropActivity(activity, index))
    },
    plannerActivityHoverOverActivity: (index, activity, date) => {
      dispatch(plannerActivityHoverOverActivity(index, activity, date))
    },
    initializePlanner: (activities) => {
      dispatch(initializePlanner(activities))
    },
    setCurrentlyFocusedEvent: (currentlyFocusedEvent) => {
      dispatch(setCurrentlyFocusedEvent(currentlyFocusedEvent))
    },
    clearCurrentlyFocusedEvent: () => {
      dispatch(clearCurrentlyFocusedEvent())
    }
  }
}

const mapStateToProps = (state) => {
  return {
    currentlyFocusedEvent: state.currentlyFocusedEvent
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
  graphql(queryItinerary, options)
)(DragSource('plannerActivity', plannerActivitySource, collectSource)(DropTarget(['activity', 'plannerActivity'], plannerActivityTarget, collectTarget)(Radium(SideBarEvent)))))
