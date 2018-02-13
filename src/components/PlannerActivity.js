import React, { Component } from 'react'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'
import { DropTarget, DragSource } from 'react-dnd'
import { hoverOverActivity, dropActivity, plannerActivityHoverOverActivity, initializePlanner } from '../actions/plannerActions'
import { deleteActivityFromBucket, addActivityToBucket } from '../actions/bucketActions'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
// import { createActivity } from '../apollo/activity'
// import { createFood } from '../apollo/food'
// import { createFlight } from '../apollo/flight'
// import { createLandTransport } from '../apollo/landtransport'
// import { createLodging } from '../apollo/lodging'
import { queryItinerary } from '../apollo/itinerary'
import ActivityInfo from './ActivityInfo'
import PlannerColumnValue from './PlannerColumnValue'
import PlannerActivityTimeline from './PlannerActivityTimeline'
import EventDropdownMenu from './EventDropdownMenu'

import IntuitiveInputHOC from './intuitiveInput/IntuitiveInputHOC'
import CreateEventFormHOC from './createEvent/CreateEventFormHOC'
import EditEventFormHOC from './editEvent/EditEventFormHOC'

import PlannerEventExpandedInfo from './PlannerEventExpandedInfo'
import { timelineStyle, eventBoxStyle, timelineColumnStyle, dateTableFirstHeaderStyle, eventBoxFirstColumnStyle, createEventTextStyle, activityIconStyle, createEventBoxStyle, createEventPickOneStyle, createEventBoxContainerStyle, plannerBlurredBackgroundStyle, expandedEventIconsBoxStyle, expandedEventIconsStyle, expandedEventBoxStyle, expandedEventBoxImageContainerStyle, expandedEventBoxImageStyle, expandedEventBoxTextBoxStyle } from '../Styles/styles'

const plannerActivitySource = {
  beginDrag (props) {
    return {...props.activity, ...{index: props.index}}
  },
  endDrag (props, monitor) {
    if (!monitor.didDrop()) {
      props.initializePlanner(props.data.findItinerary.events)
    }
  },
  canDrag (props) {
    if (props.draggable) return true
    else return false
  }
}

const plannerActivityTarget = {
  hover (props, monitor, component) {
    let day = props.activity.day
    if (props.activity.dropzone) return
    // if (monitor.getItemType() === 'activity') props.hoverOverActivity(props.index, day)
    if (monitor.getItemType() === 'plannerActivity') props.plannerActivityHoverOverActivity(props.index, monitor.getItem(), day)
  },
  drop (props, monitor) {
    let day = props.activity.day
    if (props.activity.day === monitor.getItem().day && monitor.getItem().index === props.index) {
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
    let newActivity = {...monitor.getItem(),
      ...{
        day: day
      }
    }
    props.dropActivity(newActivity, props.index)
    // if (monitor.getItemType() === 'activity') {
    //   props.deleteActivityFromBucket(monitor.getItem())
    // }
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

class PlannerActivity extends Component {
  constructor (props) {
    super(props)

    this.state = {
      creatingEvent: false,
      createEventType: null,
      // editingEvent: false,
      editEventType: null,
      onBox: false,
      draggable: false,
      expanded: false,
      hover: false,
      showClashes: false
      // activityName: this.props.activity.name,
      // locationName: this.props.activity.location.name,
      // Activity: this.props.activity.__typename === 'Activity' && this.props.activity,
      // Flight: this.props.activity.__typename === 'Flight' && this.props.activity,
      // Lodging: this.props.activity.__typename === 'Lodging' && this.props.activity,
      // Transport: this.props.activity.__typename === 'Transport' && this.props.activity,
      // Food: this.props.activity.__typename === 'Food' && this.props.activity
    }
  }

  render () {
    const { connectDropTarget, connectDragSource, connectDragPreview, getItem } = this.props
    let minHeight
    if (!this.props.activity.modelId && !this.props.empty) {
      minHeight = '12vh'
    }
    let type
    if (this.props.activity.type) type = this.props.activity.type
    const timeline = (
      <div style={{...timelineStyle,
        ...{
          height: this.props.lastDay && this.props.isLast ? '60%' : '100%',
          top: this.props.firstDay && this.props.index === 0 ? '20px' : '0'
        }
      }} />
    )
    const startTime = this.props.activity.type === 'Flight' ? this.props.activity[type].FlightInstance.startTime : this.props.activity[type].startTime
    const endTime = this.props.activity.type === 'Flight' ? this.props.activity[type].FlightInstance.endTime : this.props.activity[type].endTime
    let activityBox = (
      <tr style={eventBoxStyle(this.state.draggable && !this.state.expanded, this.props.activity.modelId, this.props.activity.timelineClash || this.props.activity.inBetweenStartEndRow, this.props.activity[type].allDayEvent)} onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})}>
        <td style={timelineColumnStyle(this.props.activity.timelineClash || this.props.activity.inBetweenStartEndRow, this.props.activity[type].allDayEvent)}>
          {this.props.timeline.events && timeline}
          {this.props.timeline.events && <PlannerActivityTimeline activity={this.props.activity} doNotShowTime={this.props.activity.timelineClash || this.props.activity.inBetweenStartEndRow || this.props.activity[type].allDayEvent} day={this.props.day} start={this.props.activity.start} type={this.props.activity.type} checkout={this.props.activity.type === 'Lodging' && !this.props.activity.start} isLast={this.props.isLast} lastDay={this.props.lastDay} startTime={startTime} endTime={endTime} id={this.props.activity.modelId} draggingItem={getItem} expanded={this.state.expanded} startLocation={!this.props.empty && (this.props.activity[type].location || this.props.activity[type].departureLocation || (this.props.activity[type].FlightInstance && this.props.activity[type].FlightInstance.departureLocation))} endLocation={!this.props.empty && (this.props.activity[type].location || this.props.activity[type].arrivalLocation || (this.props.activity[type].FlightInstance && this.props.activity[type].FlightInstance.arrivalLocation))} />}
        </td>
        <td colSpan={this.state.expanded ? '4' : '1'} style={dateTableFirstHeaderStyle}>
          {this.state.editEventType &&
            <EditEventFormHOC eventType={this.state.editEventType} ItineraryId={this.props.itineraryId} day={this.props.day} date={this.props.date} dates={this.props.dates} daysArr={this.props.daysArr} event={this.props.activity[`${this.state.editEventType}`]} toggleEditEventType={() => this.handleEditEventClick()} />
          }
          {connectDragPreview(<div style={eventBoxFirstColumnStyle(this.props.activity, minHeight, getItem || {})} key={this.props.activity.modelId}>
            {this.state.hover && !this.state.expanded && this.props.activity.type !== 'Flight' && connectDragSource(<i className='material-icons' style={{opacity: getItem ? 0 : 1, position: 'absolute', top: '22px', left: '-12px', cursor: 'move', zIndex: 2, ':hover': {color: '#ed685a'}}}>drag_handle</i>)}
            {this.renderInfo(this.props.activity.type, this.state.expanded)}
          </div>)}
        </td>
        {this.state.editEventType && <td style={plannerBlurredBackgroundStyle} />}
        {!this.state.expanded && this.props.columns && this.props.columns.includes('Notes') &&
          <PlannerColumnValue column='Notes' activity={this.props.activity} isLast hover={this.state.hover} itineraryId={this.props.itineraryId} expandEvent={() => this.expandEvent()} expandedEvent={this.state.expanded} />
        }
        {!this.state.expanded && this.props.columns && !this.props.columns.includes('Notes') && this.props.columns.map((column, i) => {
          return <PlannerColumnValue key={i} column={column} activity={this.props.activity} isLast={i === 2} hover={this.state.hover} firstInFlightBooking={this.props.firstInFlightBooking} itineraryId={this.props.itineraryId} expandEvent={() => this.expandEvent()} expandedEvent={this.state.expanded} />
        })}
        {this.state.expanded && this.props.columns.map((column, i) => {
          return <PlannerColumnValue key={i} isLast={i === 2} expandEvent={() => this.expandEvent()} expandedEvent={this.state.expanded} />
        })}
      </tr>
    )
    let createEventBox = (
      <div style={{
        cursor: 'pointer'
      }}>
        <p style={createEventTextStyle}>+ Add Event</p>
      </div>
    )
    const iconTypes = ['directions_run', 'restaurant', 'hotel', 'flight', 'directions_subway', 'local_car_wash', 'directions_boat']
    const eventTypes = ['Activity', 'Food', 'Lodging', 'Flight', 'Train', 'LandTransport', 'SeaTransport']
    const eventsListBox = (
      <div style={{...createEventBoxStyle, ...this.state.intuitiveInputType && {position: 'absolute', top: '35px'}}}>
        <span className='createEventBox'>
          {iconTypes.map((type, i) => {
            return (
              <i title={eventTypes[i]} key={i} onClick={() => this.handleIntuitiveInput(eventTypes[i])} className='material-icons' style={{...activityIconStyle, ...eventTypes[i] === this.state.intuitiveInputType && {WebkitTextStroke: '1px #ed685a'}}}>{type}</i>
            )
          })}
          <span style={createEventPickOneStyle}>Pick One</span>
        </span>
      </div>
    )
    if (this.state.creatingEvent && !this.state.intuitiveInputType) {
      createEventBox = eventsListBox
    } else if (this.state.intuitiveInputType) {
      createEventBox = (
        <div>
          <IntuitiveInputHOC intuitiveInputType={this.state.intuitiveInputType} itineraryId={this.props.itineraryId} dates={this.props.dates} day={this.props.day} daysArr={this.props.daysArr} date={this.props.date} toggleIntuitiveInput={() => this.handleIntuitiveInput()} handleCreateEventClick={(eventType) => this.handleCreateEventClick(eventType)} />
          {eventsListBox}
        </div>
      )
    }
    if (this.props.empty) {
      return connectDropTarget(
        <tr>
          <td style={timelineColumnStyle()}>
            {!this.props.lastDay && this.props.timeline.events && timeline}
          </td>
          <td colSpan='4'>
            <div onClick={() => this.setState({creatingEvent: true})} style={createEventBoxContainerStyle}>
              {createEventBox}
            </div>

            {this.state.createEventType &&
              <CreateEventFormHOC eventType={this.state.createEventType} ItineraryId={this.props.itineraryId} day={this.props.day} date={this.props.date} dates={this.props.dates} daysArr={this.props.daysArr} toggleCreateEventType={() => this.handleCreateEventClick()} />
            }
          </td>
          {this.state.createEventType && <td style={plannerBlurredBackgroundStyle} />}
        </tr>
      )
    }
    // if (this.state.draggable && !this.state.expanded) {
    //   return connectDragSource(connectDropTarget(activityBox))
    // } else {
    return connectDropTarget(activityBox)
    // }
  }

  handleClickOutside (event) {
    if (!this.props.empty) return
    this.setState({
      creatingEvent: false,
      intuitiveInputType: null,
      _radiumStyleState: {}
    })
  }

  handleIntuitiveInput (eventType = '') {
    this.setState({
      intuitiveInputType: eventType
    }, () => this.setState({creatingEvent: !!this.state.intuitiveInputType}))
  }

  handleCreateEventClick (eventType = null) {
    this.setState({
      createEventType: eventType
    })
  }

  handleEditEventClick (eventType = null) {
    this.setState({
      // editEventType: this.props.activity.type
      editEventType: eventType,
      hover: false
    })
  }

  toggleEventDropdown (event) {
    if (event) {
      if (event.target.textContent === 'more_horiz' && event.target.id === this.props.activity.type + this.props.activity.modelId + this.props.activity.start) return
    }
    this.setState({
      expandedMenu: false
    })
  }

  expandEvent () {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  renderInfo (type, expanded) {
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
    const expandMenu = this.state.expandedMenu && (
      <EventDropdownMenu expandedEvent={this.state.expanded} event={this.props.activity} itineraryId={this.props.itineraryId} toggleEventDropdown={(event) => this.toggleEventDropdown(event)} toggleEditEvent={() => this.handleEditEventClick(this.props.activity.type)} />
    )
    let expandButton
    if (this.state.hover && !this.state.expandedMenu) {
      expandButton = (
        <i key='expandButton' id={this.props.activity.type + this.props.activity.modelId + this.props.activity.start} className='material-icons' style={{fontSize: '30px', position: 'absolute', top: '-11px', ':hover': {color: '#ed685a'}}} onClick={() => this.setState({expandedMenu: true})}>more_horiz</i>
      )
    } else if (this.state.expandedMenu) {
      expandButton = (
        <i key='expandButton' id={this.props.activity.type + this.props.activity.modelId + this.props.activity.start} className='material-icons' style={{fontSize: '30px', position: 'absolute', top: '-11px', color: '#ed685a'}} onClick={() => this.setState({expandedMenu: false})}>more_horiz</i>
      )
    }
    const errorIcon = (this.props.activity.timelineClash || this.props.activity.inBetweenStartEndRow) && <i onMouseEnter={() => this.setState({showClashes: true})} onMouseLeave={() => this.setState({showClashes: false})} className='material-icons' style={{position: 'absolute', top: '-2px', marginLeft: '4px', color: 'red'}}>error</i>

    const errorBox = this.state.showClashes && errorIcon && <span style={{display: 'block', position: 'absolute', width: 'fit-content', left: this.props.activity.type === 'Food' || this.props.activity.type === 'Activity' ? '117px' : '72px', top: '11px', backgroundColor: 'white', zIndex: 1, color: 'black', boxShadow: '0px 1px 5px 2px rgba(0, 0, 0, .2)'}}>{this.props.activity.timelineClash && <span style={{display: 'block', padding: '8px'}}>Timing Clash</span>}{this.props.activity.inBetweenStartEndRow && <span style={{display: 'block', padding: '8px'}}>Event happens between a flight/transport</span>}</span>

    let startTime = new Date(this.props.activity[type].startTime * 1000).toGMTString().substring(17, 22)
    if (type === 'Flight') startTime = new Date(this.props.activity[type].FlightInstance.startTime * 1000).toGMTString().substring(17, 22)
    let endTime = new Date(this.props.activity[type].endTime * 1000).toGMTString().substring(17, 22)
    if (type === 'Flight') endTime = new Date(this.props.activity[type].FlightInstance.endTime * 1000).toGMTString().substring(17, 22)

    let suggestedStartTime = this.props.activity.suggestedStartTime && new Date(this.props.activity.suggestedStartTime * 1000).toGMTString().substring(17, 22)
    let suggestedEndTime = this.props.activity.suggestedEndTime && new Date(this.props.activity.suggestedEndTime * 1000).toGMTString().substring(17, 22)

    if (!expanded) {
      switch (type) {
        case 'Activity':
          return (
            <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
              <p style={nameStyle}>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity[type].location && this.props.activity[type].location.name} googlePlaceData={this.props.activity[type].location} /><span style={typeStyle}> - </span>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='description' value={this.props.activity[type].description} />
              </p>
              <div style={{position: 'relative', display: 'inline'}}>
                {expandButton}
                {expandMenu}
              </div>
              <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='time' startTime={startTime} endTime={endTime} timeStyle={timeStyle} typeStyle={typeStyle} errorBox={errorBox} errorIcon={errorIcon} allDay={this.props.activity[type].allDayEvent} event={this.props.activity[type]} editing={this.props.activity.isDropped} suggestedStartTime={suggestedStartTime} suggestedEndTime={suggestedEndTime} newDay={this.props.activity.newDay} />
            </div>
          )
        case 'Flight':
          if (this.props.activity.start) {
            return (
              <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
                <p style={nameStyle}><ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='departureLocation' value={this.props.activity[type].FlightInstance.departureLocation.name} />
                  <span style={typeStyle}> - </span>
                  <span style={typeStyle}>Flight Departure</span>
                </p>
                <div style={{position: 'relative', display: 'inline'}}>
                  {expandButton}
                  {expandMenu}
                </div>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='departureTime' value={startTime} />{errorIcon}{errorBox}</p>
              </div>
            )
          } else if (!this.props.activity.start) {
            return (
              <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
                <p style={nameStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalLocation' value={this.props.activity[type].FlightInstance.arrivalLocation.name} />
                  <span style={typeStyle}> - </span>
                  <span style={typeStyle}>Flight Arrival</span>
                </p>
                <div style={{position: 'relative', display: 'inline'}}>
                  {expandButton}
                  {expandMenu}
                </div>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalTime' value={endTime} />{errorIcon}{errorBox}</p>
              </div>
            )
          }
          break
        case 'Food':
          return (
            <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
              <p style={nameStyle}>
                <ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity[type].location.name} googlePlaceData={this.props.activity[type].location} /><span style={typeStyle}> - </span>
                <ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='description' value={this.props.activity[type].description} />
              </p>
              <div style={{position: 'relative', display: 'inline'}}>
                {expandButton}
                {expandMenu}
              </div>
              <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='time' startTime={startTime} endTime={endTime} timeStyle={timeStyle} typeStyle={typeStyle} errorBox={errorBox} errorIcon={errorIcon} allDay={this.props.activity[type].allDayEvent} event={this.props.activity[type]} editing={this.props.activity.isDropped} suggestedStartTime={suggestedStartTime} suggestedEndTime={suggestedEndTime}
                newDay={this.props.activity.newDay} />
            </div>
          )
        case 'LandTransport':
          if (this.props.activity.start) {
            return (
              <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
                <p style={nameStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='departureGooglePlaceData' value={this.props.activity[type].departureLocation.name} googlePlaceData={this.props.activity[type].departureLocation} /><span style={typeStyle}> - </span>
                  <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='name' value='Departure' />
                </p>
                <div style={{position: 'relative', display: 'inline'}}>
                  {expandButton}
                  {expandMenu}
                </div>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='startTime' value={startTime} event={this.props.activity[type]} editing={this.props.activity.isDropped} suggestedStartTime={suggestedStartTime} />{errorIcon}{errorBox}</p>
              </div>
            )
          } else if (!this.props.activity.start) {
            return (
              <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
                <p style={nameStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalGooglePlaceData' value={this.props.activity[type].arrivalLocation.name} googlePlaceData={this.props.activity[type].arrivalLocation} /><span style={typeStyle}> - </span>
                  <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='name' value='Arrival' />
                </p>
                <div style={{position: 'relative', display: 'inline'}}>
                  {expandButton}
                  {expandMenu}
                </div>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='endTime' value={endTime} event={this.props.activity[type]} editing={this.props.activity.isDropped} suggestedEndTime={suggestedEndTime} />{errorIcon}{errorBox}</p>
              </div>
            )
          }
          break
        case 'Lodging':
          let time, name
          if (this.props.activity.start) {
            time = startTime
            name = 'startTime'
          } else {
            time = endTime
            name = 'endTime'
          }
          return (
            <div style={{...activityBoxStyle, ...{height: '10vh'}}}>
              <div style={{display: 'inline'}}>
                <p style={nameStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity[type].location.name} googlePlaceData={this.props.activity[type].location} />
                  <span style={typeStyle}> - </span>
                  <span style={typeStyle}>{this.props.activity.start ? 'Check In' : 'Check Out'}</span>
                </p>
                <div style={{position: 'relative', display: 'inline'}}>
                  {expandButton}
                  {expandMenu}
                </div>
                <p style={timeStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name={name} value={time} event={this.props.activity[type]} editing={this.props.activity.isDropped} suggestedStartTime={suggestedStartTime} suggestedEndTime={suggestedEndTime}
                  newDay={this.props.activity.newDay} />{errorIcon}{errorBox}</p>
              </div>
            </div>
          )
        default:
          return null
      }
    } else if (expanded) {
      const expandedEventIcons = (
        <div style={expandedEventIconsBoxStyle}>
          <i onClick={() => this.handleEditEventClick()} key='expandedActivityEdit' className='material-icons' style={{...expandedEventIconsStyle, ...{marginRight: '5px'}}}>mode_edit</i>
          <i key='expandedActivityMap' className='material-icons' style={{...expandedEventIconsStyle, ...{marginRight: '5px'}}}>map</i>
        </div>
      )
      switch (type) {
        case 'Activity' :
          return (
            <div style={{...activityBoxStyle, ...{marginBottom: '20px'}}}>
              <p style={nameStyle}>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity[type].location && this.props.activity[type].location.name} googlePlaceData={this.props.activity[type].location} /><span style={typeStyle}> - </span>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='description' value={this.props.activity[type].description} />
              </p>
              <div style={{position: 'relative', display: 'inline'}}>
                {expandButton}
                {expandMenu}
              </div>
              <div style={expandedEventBoxStyle}>
                {expandedEventIcons}
                <div style={expandedEventBoxImageContainerStyle}>
                  <img src={this.props.activity[type].backgroundImage} style={expandedEventBoxImageStyle} />
                </div>
                <div style={expandedEventBoxTextBoxStyle}>
                  <p style={{textDecoration: 'underline', fontWeight: 'bold'}}>Details</p>
                  {this.props.activity[type].allDayEvent ? <p style={{fontWeight: 'bold'}}>Time: <span style={{color: '#438496'}}>Unassigned Time</span></p> :
                  <PlannerEventExpandedInfo name='Time:' value={`${startTime} to ${endTime}`} />}{(this.props.activity.timelineClash || this.props.activity.inBetweenStartEndRow) && <i className='material-icons' style={{position: 'absolute', top: '17px', left: '120px', color: 'red'}}>error</i>}
                  {this.props.activity[type].location && <PlannerEventExpandedInfo name='Location:' value={`${this.props.activity[type].location.name}`} />}
                  {this.props.activity[type].locationAlias && <PlannerEventExpandedInfo name='Alias:' value={`${this.props.activity[type].locationAlias}`} />}
                  {this.props.activity[type].location && this.props.activity[type].location.address && <PlannerEventExpandedInfo name='Address:' value={`${this.props.activity[type].location.address}`} />}
                  <p style={{textDecoration: 'underline', fontWeight: 'bold'}}>Booking Details</p>
                  <PlannerEventExpandedInfo name='Booking Service:' value={this.props.activity[type].bookedThrough} />
                  <PlannerEventExpandedInfo name='Confirmation Number:' value={this.props.activity[type].bookingConfirmation} />
                  {this.props.activity[type].cost && <PlannerEventExpandedInfo name='Price:' value={`${this.props.activity[type].currency} ${this.props.activity[type].cost}`} />}
                  <p style={{textDecoration: 'underline', fontWeight: 'bold'}}>Notes</p>
                  <PlannerEventExpandedInfo name='' value={this.props.activity[type].notes} />
                </div>
              </div>
            </div>
          )
        case 'Food':
          return (
            <div style={{...activityBoxStyle, ...{marginBottom: '20px'}}}>
              <p style={nameStyle}>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity[type].location.name} googlePlaceData={this.props.activity[type].location} /><span style={typeStyle}> - </span>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='description' value={this.props.activity[type].description} />
              </p>
              <div style={{position: 'relative', display: 'inline'}}>
                {expandButton}
                {expandMenu}
              </div>
              <div style={expandedEventBoxStyle}>
                {expandedEventIcons}
                <div style={expandedEventBoxImageContainerStyle}>
                  <img src={this.props.activity[type].backgroundImage} style={expandedEventBoxImageStyle} />
                </div>
                <div style={expandedEventBoxTextBoxStyle}>
                  <p style={{textDecoration: 'underline', fontWeight: 'bold'}}>Details</p>
                  {this.props.activity[type].allDayEvent ? <p style={{fontWeight: 'bold'}}>Time: <span style={{color: '#438496'}}>Unassigned Time</span></p> :
                  <PlannerEventExpandedInfo name='Time:' value={`${startTime} to ${endTime}`} />}{(this.props.activity.timelineClash || this.props.activity.inBetweenStartEndRow) && <i className='material-icons' style={{position: 'absolute', top: '17px', left: '120px', color: 'red'}}>error</i>}
                  <PlannerEventExpandedInfo name='Location:' value={`${this.props.activity[type].location.name}`} />
                  {this.props.activity[type].locationAlias && <PlannerEventExpandedInfo name='Alias:' value={`${this.props.activity[type].locationAlias}`} />}
                  <PlannerEventExpandedInfo name='Address:' value={`${this.props.activity[type].location.address}`} />
                  <p style={{textDecoration: 'underline', fontWeight: 'bold'}}>Booking Details</p>
                  <PlannerEventExpandedInfo name='Booking Service:' value={this.props.activity[type].bookedThrough} />
                  <PlannerEventExpandedInfo name='Confirmation Number:' value={this.props.activity[type].bookingConfirmation} />
                  <PlannerEventExpandedInfo name='Price:' value={`${this.props.activity[type].currency} ${this.props.activity[type].cost}`} />
                  <p style={{textDecoration: 'underline', fontWeight: 'bold'}}>Notes</p>
                  <PlannerEventExpandedInfo name='' value={this.props.activity[type].notes} />
                </div>
              </div>
            </div>
          )
        case 'LandTransport':
          return (
            <div style={{...activityBoxStyle, ...{marginBottom: '20px'}}}>
              <p style={nameStyle}>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name={this.props.activity.start ? 'departureGooglePlaceData' : 'arrivalGooglePlaceData'} value={this.props.activity.start ? this.props.activity[type].departureLocation.name : this.props.activity[type].arrivalLocation.name} googlePlaceData={this.props.activity.start ? this.props.activity[type].departureLocation : this.props.activity[type].arrivalLocation} /><span style={typeStyle}> - </span>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='name' value={this.props.activity.start ? 'Departure' : 'Arrival'} />
              </p>
              <div style={{position: 'relative', display: 'inline'}}>
                {expandButton}
                {expandMenu}
              </div>
              <div style={expandedEventBoxStyle}>
                {expandedEventIcons}
                <div style={expandedEventBoxImageContainerStyle}>
                  <img src={this.props.activity[type].backgroundImage} style={expandedEventBoxImageStyle} />
                </div>
                <div style={expandedEventBoxTextBoxStyle}>
                  <p style={{textDecoration: 'underline', fontWeight: 'bold'}}>{this.props.activity.start ? 'Departure Location Details' : 'Arrival Location Details'}</p>
                  <PlannerEventExpandedInfo name={this.props.activity.start ? 'Departure Time:' : 'Arrival Time:'} value={this.props.activity.start ? startTime : endTime} />
                  <PlannerEventExpandedInfo name='Location:' value={this.props.activity.start ? `${this.props.activity[type].departureLocation.name}` : `${this.props.activity[type].arrivalLocation.name}`} />
                  <PlannerEventExpandedInfo name='Address:' value={this.props.activity.start ? `${this.props.activity[type].departureLocation.address}` : `${this.props.activity[type].arrivalLocation.address}`} />
                  <p style={{textDecoration: 'underline', fontWeight: 'bold'}}>Booking Details</p>
                  <PlannerEventExpandedInfo name='Booking Service:' value={this.props.activity[type].bookedThrough} />
                  <PlannerEventExpandedInfo name='Confirmation Number:' value={this.props.activity[type].bookingConfirmation} />
                  <PlannerEventExpandedInfo name='Price:' value={`${this.props.activity[type].currency} ${this.props.activity[type].cost}`} />
                  <p style={{textDecoration: 'underline', fontWeight: 'bold'}}>Notes</p>
                  <PlannerEventExpandedInfo name='' value={this.props.activity[type].notes} />
                </div>
              </div>
            </div>
          )
        case 'Lodging':
          return (
            <div style={{...activityBoxStyle, ...{marginBottom: '20px'}}}>
              <p style={nameStyle}>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity[type].location.name} googlePlaceData={this.props.activity[type].location} /><span style={typeStyle}> - </span>
                <span style={typeStyle}>{this.props.activity.start ? ' Check In' : ' Check Out'}</span>
              </p>
              <div style={{position: 'relative', display: 'inline'}}>
                {expandButton}
                {expandMenu}
              </div>
              <div style={expandedEventBoxStyle}>
                {expandedEventIcons}
                <div style={expandedEventBoxImageContainerStyle}>
                  <img src={this.props.activity[type].backgroundImage} style={expandedEventBoxImageStyle} />
                </div>
                <div style={expandedEventBoxTextBoxStyle}>
                  <PlannerEventExpandedInfo name={this.props.activity.start ? 'Check In Time:' : 'Check Out Time:'} value={this.props.activity.start ? startTime : endTime} />
                  <PlannerEventExpandedInfo name='Price:' value={`${this.props.activity[type].currency} ${this.props.activity[type].cost}`} />
                  <PlannerEventExpandedInfo name='Booking Platform:' value={this.props.activity[type].bookedThrough} />
                  <PlannerEventExpandedInfo name='Booking Number:' value={this.props.activity[type].bookingConfirmation} />
                  <PlannerEventExpandedInfo name='Notes:' value={this.props.activity[type].notes} />
                </div>
              </div>
            </div>
          )
        case 'Flight':
          return (
            <div style={{...activityBoxStyle, ...{marginBottom: '20px'}}}>
              <p style={nameStyle}>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity.start ? this.props.activity[type].FlightInstance.departureLocation.name : this.props.activity[type].FlightInstance.arrivalLocation.name} /><span style={typeStyle}> - </span>
                <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='name' value={this.props.activity.start ? 'Flight Departure' : 'Flight Arrival'} />
              </p>
              <div style={{position: 'relative', display: 'inline'}}>
                {expandButton}
                {expandMenu}
              </div>
              <div style={expandedEventBoxStyle}>
                {expandedEventIcons}
                <div style={expandedEventBoxImageContainerStyle}>
                  <img src={this.props.activity[type].FlightBooking.backgroundImage} style={expandedEventBoxImageStyle} />
                </div>
                <div style={expandedEventBoxTextBoxStyle}>
                  <PlannerEventExpandedInfo name={this.props.activity.start ? 'Departure Time:' : 'Arrival Time:'} value={this.props.activity.start ? startTime : endTime} />
                  <PlannerEventExpandedInfo name='Price:' value={`${this.props.activity[type].FlightBooking.currency} ${this.props.activity[type].FlightBooking.cost}`} />
                  <PlannerEventExpandedInfo name='Booking Platform:' value={this.props.activity[type].FlightBooking.bookedThrough} />
                  <PlannerEventExpandedInfo name='Booking Number:' value={this.props.activity[type].FlightBooking.bookingConfirmation} />
                  <PlannerEventExpandedInfo name='Notes:' value={this.props.activity[type].FlightInstance.notes} />
                </div>
              </div>
            </div>
          )
      }
    }
  }

  toggleDraggable () {
    this.setState({
      draggable: !this.state.draggable
    })
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
    deleteActivityFromBucket: (activity) => {
      dispatch(deleteActivityFromBucket(activity))
    },
    plannerActivityHoverOverActivity: (index, activity, date) => {
      dispatch(plannerActivityHoverOverActivity(index, activity, date))
    },
    addActivityToBucket: (activity) => {
      dispatch(addActivityToBucket(activity))
    },
    initializePlanner: (activities) => {
      dispatch(initializePlanner(activities))
    }
  }
}

const mapStateToProps = (state) => {
  return {
    timeline: state.plannerTimeline
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
)(DragSource('plannerActivity', plannerActivitySource, collectSource)(DropTarget(['activity', 'plannerActivity'], plannerActivityTarget, collectTarget)(onClickOutside(Radium(PlannerActivity))))))
