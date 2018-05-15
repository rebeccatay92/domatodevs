import React, { Component } from 'react'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'
import { DropTarget, DragSource } from 'react-dnd'
import { hoverOverActivity, dropActivity, plannerActivityHoverOverActivity, initializePlanner } from '../actions/plannerActions'
import { deleteActivityFromBucket, addActivityToBucket } from '../actions/bucketActions'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'

// UPDATED APOLLO
import { queryItinerary } from '../apollo/itinerary'

import ActivityInfo from './ActivityInfo'
import PlannerColumnValue from './PlannerColumnValue'
import PlannerActivityTimeline from './PlannerActivityTimeline'
import EventDropdownMenu from './EventDropdownMenu'

import IntuitiveInputHOC from './intuitiveInput/IntuitiveInputHOC'
// import CreateEventFormHOC from './createEvent/CreateEventFormHOC'
// import EditEventFormHOC from './editEvent/EditEventFormHOC'

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
      intuitiveInputType: 'Activity',
      // editingEvent: false,
      editEventType: null,
      onBox: false,
      draggable: false,
      expanded: false,
      hover: false,
      showClashes: false,
      editing: false
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
          height: (this.props.lastDay && this.props.isLast) || (this.props.firstDay && this.props.index === 0) ? '60%' : '100%',
          top: this.props.firstDay && this.props.index === 0 ? '26px' : '0'
        }
      }} />
    )
    const startTime = this.props.activity.startTime
    const endTime = this.props.activity.endTime
    let activityBox = (
      <tr style={eventBoxStyle(this.state.draggable && !this.state.expanded, this.props.activity.modelId, this.props.activity.timelineClash || this.props.activity.inBetweenStartEndRow, this.props.activity.allDayEvent)} onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})}>
        <td style={timelineColumnStyle(this.props.activity.timelineClash || this.props.activity.inBetweenStartEndRow, this.props.activity.allDayEvent)}>
          {/* {this.props.timeline.events && timeline}
          {this.props.timeline.events && <PlannerActivityTimeline activity={this.props.activity} doNotShowTime={this.props.activity.timelineClash || this.props.activity.inBetweenStartEndRow || this.props.activity.allDayEvent} day={this.props.day} isLast={this.props.isLast} lastDay={this.props.lastDay} startTime={startTime} endTime={endTime} id={this.props.activity.id} draggingItem={getItem} expanded={this.state.expanded} startLocation={!this.props.empty && (this.props.activity.location)} endLocation={!this.props.empty && (this.props.activity.location)} />} */}
        </td>
        <td colSpan={this.state.expanded ? '4' : '1'} style={dateTableFirstHeaderStyle}>
          {/* I HID THE FORMS HOC BECAUSE APOLLO IMPORT WILL FAIL */}

          {/* {this.state.editEventType &&
            <EditEventFormHOC eventType={this.state.editEventType} ItineraryId={this.props.itineraryId} day={this.props.day} date={this.props.date} dates={this.props.dates} daysArr={this.props.daysArr} event={this.props.activity[`${this.state.editEventType}`]} toggleEditEventType={() => this.handleEditEventClick()} />
          } */}
          {connectDragPreview(<div style={eventBoxFirstColumnStyle(this.props.activity, minHeight, getItem || {})} key={this.props.activity.modelId}>
            {!this.state.editing && this.state.hover && !this.state.expanded && connectDragSource(<i className='material-icons' style={{opacity: getItem ? 0 : 0.7, position: 'absolute', top: '22px', left: '-12px', cursor: 'move', zIndex: 2, ':hover': {color: '#ed685a', opacity: getItem ? 0 : 1}}}>unfold_more</i>)}
            {this.renderInfo()}
          </div>)}
        </td>
        {this.state.editEventType && <td style={plannerBlurredBackgroundStyle} />}
        {!this.state.expanded && this.props.columns && this.props.columns.includes('Notes') &&
          <PlannerColumnValue column='Notes' activity={this.props.activity} isLast hover={!this.state.editing && this.state.hover} itineraryId={this.props.itineraryId} expandEvent={() => this.expandEvent()} expandedEvent={this.state.expanded} />
        }
        {!this.state.expanded && this.props.columns && !this.props.columns.includes('Notes') && this.props.columns.map((column, i) => {
          return <PlannerColumnValue key={i} column={column} activity={this.props.activity} isLast={i === 2} hover={!this.state.editing && this.state.hover} firstInFlightBooking={this.props.firstInFlightBooking} itineraryId={this.props.itineraryId} expandEvent={() => this.expandEvent()} expandedEvent={this.state.expanded} />
        })}
        {this.state.expanded && this.props.columns.map((column, i) => {
          return <PlannerColumnValue key={i} isLast={i === 2} expandEvent={() => this.expandEvent()} expandedEvent={this.state.expanded} />
        })}
      </tr>
    )
    // let createEventBox = (
    //   <div style={{
    //     height: '80px',
    //     padding: '30px 0'
    //   }}>
    //     <span onClick={() => this.setState({creatingEvent: true, intuitiveInputType: 'Activity'})} style={createEventTextStyle}>+ Add Event</span>
    //   </div>
    // )
    // const iconTypes = ['directions_run', 'restaurant', 'hotel', 'flight', 'directions_subway', 'local_car_wash', 'directions_boat']
    // const eventTypes = ['Activity', 'Food', 'Lodging', 'Flight', 'Train', 'LandTransport', 'SeaTransport']
    // const eventsListBox = (
    //   <div style={{...createEventBoxStyle, ...{position: 'absolute', top: '52px', padding: '0'}}}>
    //     <span className='createEventBox' style={{marginLeft: '8px'}}>
    //       {iconTypes.map((type, i) => {
    //         return (
    //           <i title={eventTypes[i]} key={i} onClick={() => this.handleIntuitiveInput(eventTypes[i])} className='material-icons' style={{...activityIconStyle, ...eventTypes[i] === this.state.intuitiveInputType && {WebkitTextStroke: '1px #ed685a'}}}>{type}</i>
    //         )
    //       })}
    //       <span style={createEventPickOneStyle}>Pick One</span>
    //     </span>
    //   </div>
    // )
    const createEventBox = (
      <div>
        {/* <IntuitiveInputHOC intuitiveInputType={this.state.intuitiveInputType} itineraryId={this.props.itineraryId} dates={this.props.dates} day={this.props.day} daysArr={this.props.daysArr} date={this.props.date} toggleIntuitiveInput={() => this.handleIntuitiveInput()} handleCreateEventClick={(eventType) => this.handleCreateEventClick(eventType)} handleIntuitiveInput={(eventType) => this.handleIntuitiveInput(eventType)} /> */}
      </div>
    )
    if (this.props.empty) {
      return connectDropTarget(
        <tr>
          <td style={timelineColumnStyle()}>
            {!this.props.lastDay && this.props.timeline.events && timeline}
          </td>
          <td colSpan='4'>
            <div style={createEventBoxContainerStyle}>
              {createEventBox}
            </div>

            {/* {this.state.createEventType &&
              <CreateEventFormHOC eventType={this.state.createEventType} ItineraryId={this.props.itineraryId} day={this.props.day} dates={this.props.dates} daysArr={this.props.daysArr} toggleCreateEventType={() => this.handleCreateEventClick()} />
            } */}
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
      _radiumStyleState: {}
    })
  }

  handleIntuitiveInput (eventType = '') {
    if (!eventType) return
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

  componentDidMount () {
    document.addEventListener('keydown', event => this.handleKeydown(event))
  }

  toggleEdit () {
    this.setState({
      editing: !this.state.editing
    })
  }

  handleKeydown (event) {
    if (event.keyCode === 13) {
      if (this.state.editing) {
        this.setState({
          handleEdit: !this.state.handleEdit,
          editing: false
        })
      }
    }
  }

  renderInfo (expanded) {
    const activityBoxStyle = {
      fontSize: '16px',
      marginLeft: '16px',
      padding: this.state.editing ? '11px 0' : '18px 0',
      fontWeight: '300',
      position: 'relative'
    }
    const nameStyle = {
      display: 'inline-block',
      margin: this.state.editing ? '0' : this.state.expanded ? '0 0 9px 0' : '0 0 5px 0',
      position: 'relative'
      // width: '300px',
      // overflow: 'hidden',
      // whiteSpace: 'nowrap',
      // textOverflow: 'ellipsis'
    }
    const typeStyle = {
      overflow: 'hidden',
      height: '18px',
      padding: '1px',
      display: 'inline-block'
    }
    const timeStyle = {
      marginTop: 0,
      color: 'rgba(60, 58, 68, 0.7)',
      position: 'relative'
    }
    const expandMenu = this.state.expandedMenu && (
      <EventDropdownMenu expandedEvent={this.state.expanded} event={this.props.activity} itineraryId={this.props.itineraryId} toggleEventDropdown={(event) => this.toggleEventDropdown(event)} toggleEditEvent={() => this.handleEditEventClick(this.props.activity.type)} />
    )
    let expandButton
    if (!this.state.editing && this.state.hover && !this.state.expandedMenu) {
      expandButton = (
        <i key='expandButton' id={this.props.activity.type + this.props.activity.modelId + this.props.activity.start} className='material-icons' style={{opacity: '0.7', cursor: 'pointer', marginLeft: '8px', fontSize: '20px', position: 'absolute', top: '-4px', ':hover': {color: '#ed685a', opacity: '1'}}} onClick={() => this.setState({expandedMenu: true})}>more_horiz</i>
      )
    } else if (this.state.expandedMenu) {
      expandButton = (
        <i key='expandButton' id={this.props.activity.type + this.props.activity.modelId + this.props.activity.start} className='material-icons' style={{cursor: 'pointer', marginLeft: '8px', fontSize: '20px', position: 'absolute', top: '-3px', color: '#ed685a'}} onClick={() => this.setState({expandedMenu: false})}>more_horiz</i>
      )
    }
    // const errorIcon = (this.props.activity.timelineClash || this.props.activity.inBetweenStartEndRow) && <i onMouseEnter={() => this.setState({showClashes: true})} onMouseLeave={() => this.setState({showClashes: false})} className='material-icons' style={{position: 'absolute', top: '-2px', marginLeft: '4px', color: 'red'}}>error</i>
    //
    // const errorBox = this.state.showClashes && errorIcon && <span style={{display: 'block', position: 'absolute', width: 'fit-content', left: this.props.activity.type === 'Food' || this.props.activity.type === 'Activity' ? '117px' : '72px', top: '11px', backgroundColor: 'white', zIndex: 1, color: 'black', boxShadow: '0px 1px 5px 2px rgba(0, 0, 0, .2)'}}>{this.props.activity.timelineClash && <span style={{display: 'block', padding: '8px'}}>Timing Clash</span>}{this.props.activity.inBetweenStartEndRow && <span style={{display: 'block', padding: '8px'}}>Event happens between a flight/transport</span>}</span>

    let startTime = new Date(this.props.activity.startTime * 1000).toGMTString().substring(17, 22)
    // if (type === 'Flight') startTime = new Date(this.props.activity.FlightInstance.startTime * 1000).toGMTString().substring(17, 22)
    let endTime = new Date(this.props.activity.endTime * 1000).toGMTString().substring(17, 22)
    // if (type === 'Flight') endTime = new Date(this.props.activity.FlightInstance.endTime * 1000).toGMTString().substring(17, 22)

    let suggestedStartTime = this.props.activity.suggestedStartTime && new Date(this.props.activity.suggestedStartTime * 1000).toGMTString().substring(17, 22)
    let suggestedEndTime = this.props.activity.suggestedEndTime && new Date(this.props.activity.suggestedEndTime * 1000).toGMTString().substring(17, 22)

    if (!expanded) {
      // switch (type) {
      //   case 'Activity':
      return (
        <div style={{...activityBoxStyle, ...{height: '80px'}}}>
          <p style={nameStyle}>
            <ActivityInfo handleEdit={this.state.handleEdit} toggleEdit={() => this.toggleEdit()} toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.id} editing={this.state.editing} itineraryId={this.props.itineraryId} name='googlePlaceData' value={this.props.activity.location && this.props.activity.location.name} googlePlaceData={this.props.activity.location} /><span style={{...typeStyle, ...{padding: '1px 4px'}}}> - </span>
            <ActivityInfo handleEdit={this.state.handleEdit} toggleEdit={() => this.toggleEdit()} toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} editing={this.state.editing} itineraryId={this.props.itineraryId} name='description' value={this.props.activity.description} />
            <span style={{position: 'relative', display: 'inline'}}>
              {expandButton}
              {expandMenu}
            </span>
          </p>
          <ActivityInfo handleEdit={this.state.handleEdit} toggleEdit={() => this.toggleEdit()} toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} name='time' startTime={startTime} endTime={endTime} timeStyle={timeStyle} typeStyle={typeStyle} allDay={this.props.activity.allDayEvent} event={this.props.activity} editing={this.props.activity.isDropped || this.state.editing} suggestedStartTime={suggestedStartTime} suggestedEndTime={suggestedEndTime} newDay={this.props.activity.newDay} />
        </div>
      )
      //   case 'Flight':
      //     if (this.props.activity.start) {
      //       return (
      //         <div style={{...activityBoxStyle, ...{height: '80px'}}}>
      //           <p style={nameStyle}><ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='departureLocation' value={this.props.activity.FlightInstance.departureLocation.name} />
      //             <span style={{...typeStyle, ...{padding: '1px 4px'}}}> - </span>
      //             <span style={typeStyle}>Flight Departure</span>
      //           </p>
      //           <div style={{position: 'relative', display: 'inline'}}>
      //             {expandButton}
      //             {expandMenu}
      //           </div>
      //           <p style={timeStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='departureTime' value={startTime} />{errorIcon}{errorBox}</p>
      //         </div>
      //       )
      //     } else if (!this.props.activity.start) {
      //       return (
      //         <div style={{...activityBoxStyle, ...{height: '80px'}}}>
      //           <p style={nameStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalLocation' value={this.props.activity.FlightInstance.arrivalLocation.name} />
      //             <span style={{...typeStyle, ...{padding: '1px 4px'}}}> - </span>
      //             <span style={typeStyle}>Flight Arrival</span>
      //           </p>
      //           <div style={{position: 'relative', display: 'inline'}}>
      //             {expandButton}
      //             {expandMenu}
      //           </div>
      //           <p style={timeStyle}><ActivityInfo activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalTime' value={endTime} />{errorIcon}{errorBox}</p>
      //         </div>
      //       )
      //     }
      //     break
      //   case 'Food':
      //     return (
      //       <div style={{...activityBoxStyle, ...{height: '80px'}}}>
      //         <p style={nameStyle}>
      //           <ActivityInfo handleEdit={this.state.handleEdit} toggleEdit={() => this.toggleEdit()} editing={this.state.editing} activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity.location.name} googlePlaceData={this.props.activity.location} /><span style={{...typeStyle, ...{padding: '1px 4px'}}}> - </span>
      //           <ActivityInfo handleEdit={this.state.handleEdit} toggleEdit={() => this.toggleEdit()} editing={this.state.editing} activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='description' value={this.props.activity.description} />
      //           <span style={{position: 'relative', display: 'inline'}}>
      //             {expandButton}
      //             {expandMenu}
      //           </span>
      //         </p>
      //         <ActivityInfo handleEdit={this.state.handleEdit} toggleEdit={() => this.toggleEdit()} toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='time' startTime={startTime} endTime={endTime} timeStyle={timeStyle} typeStyle={typeStyle} errorBox={errorBox} errorIcon={errorIcon} allDay={this.props.activity.allDayEvent} event={this.props.activity} editing={this.props.activity.isDropped || this.state.editing} suggestedStartTime={suggestedStartTime} suggestedEndTime={suggestedEndTime}
      //           newDay={this.props.activity.newDay} />
      //       </div>
      //     )
      //   case 'LandTransport':
      //     if (this.props.activity.start) {
      //       return (
      //         <div style={{...activityBoxStyle, ...{height: '80px'}}}>
      //           <p style={nameStyle}><ActivityInfo handleEdit={this.state.handleEdit} toggleEdit={() => this.toggleEdit()} editing={this.state.editing} activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='departureGooglePlaceData' value={this.props.activity.departureLocation.name} googlePlaceData={this.props.activity.departureLocation} /><span style={{...typeStyle, ...{padding: '1px 4px'}}}> - </span>
      //             <span style={typeStyle}>Departure</span>
      //           </p>
      //           <div style={{position: 'relative', display: 'inline'}}>
      //             {expandButton}
      //             {expandMenu}
      //           </div>
      //           <p style={timeStyle}><ActivityInfo handleEdit={this.state.handleEdit} toggleEdit={() => this.toggleEdit()} activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='startTime' value={startTime} event={this.props.activity} editing={this.props.activity.isDropped || this.state.editing} suggestedStartTime={suggestedStartTime} />{errorIcon}{errorBox}</p>
      //         </div>
      //       )
      //     } else if (!this.props.activity.start) {
      //       return (
      //         <div style={{...activityBoxStyle, ...{height: '80px'}}}>
      //           <p style={nameStyle}><ActivityInfo handleEdit={this.state.handleEdit} toggleEdit={() => this.toggleEdit()} editing={this.state.editing} activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='arrivalGooglePlaceData' value={this.props.activity.arrivalLocation.name} googlePlaceData={this.props.activity.arrivalLocation} /><span style={{...typeStyle, ...{padding: '1px 4px'}}}> - </span>
      //             <span style={typeStyle}>Arrival</span>
      //           </p>
      //           <div style={{position: 'relative', display: 'inline'}}>
      //             {expandButton}
      //             {expandMenu}
      //           </div>
      //           <p style={timeStyle}><ActivityInfo handleEdit={this.state.handleEdit} toggleEdit={() => this.toggleEdit()} activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='endTime' value={endTime} event={this.props.activity} editing={this.props.activity.isDropped || this.state.editing} suggestedEndTime={suggestedEndTime} />{errorIcon}{errorBox}</p>
      //         </div>
      //       )
      //     }
      //     break
      //   case 'Lodging':
      //     let time, name
      //     if (this.props.activity.start) {
      //       time = startTime
      //       name = 'startTime'
      //     } else {
      //       time = endTime
      //       name = 'endTime'
      //     }
      //     return (
      //       <div style={{...activityBoxStyle, ...{height: '80px'}}}>
      //         <div style={{display: 'inline'}}>
      //           <p style={nameStyle}><ActivityInfo handleEdit={this.state.handleEdit} toggleEdit={() => this.toggleEdit()} editing={this.state.editing} activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity.location.name} googlePlaceData={this.props.activity.location} />
      //             <span style={{...typeStyle, ...{padding: '1px 4px'}}}> - </span>
      //             <span style={typeStyle}>{this.props.activity.start ? 'Check In' : 'Check Out'}</span>
      //           </p>
      //           <div style={{position: 'relative', display: 'inline'}}>
      //             {expandButton}
      //             {expandMenu}
      //           </div>
      //           <p style={timeStyle}><ActivityInfo handleEdit={this.state.handleEdit} toggleEdit={() => this.toggleEdit()} activityId={this.props.activity.modelId} toggleDraggable={() => this.toggleDraggable()} itineraryId={this.props.itineraryId} type={type} name={name} value={time} event={this.props.activity} editing={this.props.activity.isDropped || this.state.editing} suggestedStartTime={suggestedStartTime} suggestedEndTime={suggestedEndTime}
      //             newDay={this.props.activity.newDay} />{errorIcon}{errorBox}</p>
      //         </div>
      //       </div>
      //     )
      //   default:
      //     return null
      // }
    } else if (expanded) {
      const expandedEventIcons = (
        <div style={expandedEventIconsBoxStyle}>
          <i onClick={() => this.handleEditEventClick()} key='expandedActivityEdit' className='material-icons' style={{...expandedEventIconsStyle, ...{marginRight: '5px'}}}>mode_edit</i>
          <i key='expandedActivityMap' className='material-icons' style={{...expandedEventIconsStyle, ...{marginRight: '5px'}}}>map</i>
        </div>
      )
      // switch (type) {
      //   case 'Activity' :
      return (
        <div style={{...activityBoxStyle, ...{marginBottom: '20px'}}}>
          <p style={nameStyle}>
            <ActivityInfo handleEdit={this.state.handleEdit} toggleEdit={() => this.toggleEdit()} editing={this.state.editing} toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} name='googlePlaceData' value={this.props.activity.location && this.props.activity.location.name} googlePlaceData={this.props.activity.location} /><span style={{...typeStyle, ...{padding: '1px 4px'}}}> - </span>
            <ActivityInfo handleEdit={this.state.handleEdit} toggleEdit={() => this.toggleEdit()} editing={this.state.editing} toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} name='description' value={this.props.activity.description} />
          </p>
          <div style={{position: 'relative', display: 'inline'}}>
            {expandButton}
            {expandMenu}
          </div>
          <div style={expandedEventBoxStyle}>
            {expandedEventIcons}
            <div style={expandedEventBoxImageContainerStyle}>
              <img src={this.props.activity.backgroundImage} style={expandedEventBoxImageStyle} />
            </div>
            <div style={expandedEventBoxTextBoxStyle}>
              <p style={{textDecoration: 'underline', fontWeight: 'bold'}}>Details</p>
              {this.props.activity.allDayEvent ? <p style={{fontWeight: 'bold'}}>Time: <span style={{color: '#438496'}}>Unassigned Time</span></p> :
              <PlannerEventExpandedInfo name='Time:' value={`${startTime} to ${endTime}`} />}{(this.props.activity.timelineClash || this.props.activity.inBetweenStartEndRow) && <i className='material-icons' style={{position: 'absolute', top: '17px', left: '120px', color: 'red'}}>error</i>}
              {this.props.activity.location && <PlannerEventExpandedInfo name='Location:' value={`${this.props.activity.location.name}`} />}
              {this.props.activity.locationAlias && <PlannerEventExpandedInfo name='Alias:' value={`${this.props.activity.locationAlias}`} />}
              {this.props.activity.location && this.props.activity.location.address && <PlannerEventExpandedInfo name='Address:' value={`${this.props.activity.location.address}`} />}
              <p style={{textDecoration: 'underline', fontWeight: 'bold'}}>Booking Details</p>
              <PlannerEventExpandedInfo name='Booking Service:' value={this.props.activity.bookedThrough} />
              <PlannerEventExpandedInfo name='Confirmation Number:' value={this.props.activity.bookingConfirmation} />
              {this.props.activity.cost && <PlannerEventExpandedInfo name='Price:' value={`${this.props.activity.currency} ${this.props.activity.cost}`} />}
              <p style={{textDecoration: 'underline', fontWeight: 'bold'}}>Notes</p>
              <PlannerEventExpandedInfo name='' value={this.props.activity.notes} />
            </div>
          </div>
        </div>
      )
    //     case 'Food':
    //       return (
    //         <div style={{...activityBoxStyle, ...{marginBottom: '20px'}}}>
    //           <p style={nameStyle}>
    //             <ActivityInfo handleEdit={this.state.handleEdit} toggleEdit={() => this.toggleEdit()} editing={this.state.editing} toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity.location.name} googlePlaceData={this.props.activity.location} /><span style={{...typeStyle, ...{padding: '1px 4px'}}}> - </span>
    //             <ActivityInfo handleEdit={this.state.handleEdit} toggleEdit={() => this.toggleEdit()} editing={this.state.editing} toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='description' value={this.props.activity.description} />
    //           </p>
    //           <div style={{position: 'relative', display: 'inline'}}>
    //             {expandButton}
    //             {expandMenu}
    //           </div>
    //           <div style={expandedEventBoxStyle}>
    //             {expandedEventIcons}
    //             <div style={expandedEventBoxImageContainerStyle}>
    //               <img src={this.props.activity.backgroundImage} style={expandedEventBoxImageStyle} />
    //             </div>
    //             <div style={expandedEventBoxTextBoxStyle}>
    //               <p style={{textDecoration: 'underline', fontWeight: 'bold'}}>Details</p>
    //               {this.props.activity.allDayEvent ? <p style={{fontWeight: 'bold'}}>Time: <span style={{color: '#438496'}}>Unassigned Time</span></p> :
    //               <PlannerEventExpandedInfo name='Time:' value={`${startTime} to ${endTime}`} />}{(this.props.activity.timelineClash || this.props.activity.inBetweenStartEndRow) && <i className='material-icons' style={{position: 'absolute', top: '17px', left: '120px', color: 'red'}}>error</i>}
    //               <PlannerEventExpandedInfo name='Location:' value={`${this.props.activity.location.name}`} />
    //               {this.props.activity.locationAlias && <PlannerEventExpandedInfo name='Alias:' value={`${this.props.activity.locationAlias}`} />}
    //               <PlannerEventExpandedInfo name='Address:' value={`${this.props.activity.location.address}`} />
    //               <p style={{textDecoration: 'underline', fontWeight: 'bold'}}>Booking Details</p>
    //               <PlannerEventExpandedInfo name='Booking Service:' value={this.props.activity.bookedThrough} />
    //               <PlannerEventExpandedInfo name='Confirmation Number:' value={this.props.activity.bookingConfirmation} />
    //               <PlannerEventExpandedInfo name='Price:' value={`${this.props.activity.currency} ${this.props.activity.cost}`} />
    //               <p style={{textDecoration: 'underline', fontWeight: 'bold'}}>Notes</p>
    //               <PlannerEventExpandedInfo name='' value={this.props.activity.notes} />
    //             </div>
    //           </div>
    //         </div>
    //       )
    //     case 'LandTransport':
    //       return (
    //         <div style={{...activityBoxStyle, ...{marginBottom: '20px'}}}>
    //           <p style={nameStyle}>
    //             <ActivityInfo handleEdit={this.state.handleEdit} toggleEdit={() => this.toggleEdit()} editing={this.state.editing} toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name={this.props.activity.start ? 'departureGooglePlaceData' : 'arrivalGooglePlaceData'} value={this.props.activity.start ? this.props.activity.departureLocation.name : this.props.activity.arrivalLocation.name} googlePlaceData={this.props.activity.start ? this.props.activity.departureLocation : this.props.activity.arrivalLocation} /><span style={{...typeStyle, ...{padding: '1px 4px'}}}> - </span>
    //             <span style={typeStyle}>{this.props.activity.start ? ' Departure' : ' Arrival'}</span>
    //           </p>
    //           <div style={{position: 'relative', display: 'inline'}}>
    //             {expandButton}
    //             {expandMenu}
    //           </div>
    //           <div style={expandedEventBoxStyle}>
    //             {expandedEventIcons}
    //             <div style={expandedEventBoxImageContainerStyle}>
    //               <img src={this.props.activity.backgroundImage} style={expandedEventBoxImageStyle} />
    //             </div>
    //             <div style={expandedEventBoxTextBoxStyle}>
    //               <p style={{textDecoration: 'underline', fontWeight: 'bold'}}>{this.props.activity.start ? 'Departure Location Details' : 'Arrival Location Details'}</p>
    //               <PlannerEventExpandedInfo name={this.props.activity.start ? 'Departure Time:' : 'Arrival Time:'} value={this.props.activity.start ? startTime : endTime} />
    //               <PlannerEventExpandedInfo name='Location:' value={this.props.activity.start ? `${this.props.activity.departureLocation.name}` : `${this.props.activity.arrivalLocation.name}`} />
    //               <PlannerEventExpandedInfo name='Address:' value={this.props.activity.start ? `${this.props.activity.departureLocation.address}` : `${this.props.activity.arrivalLocation.address}`} />
    //               <p style={{textDecoration: 'underline', fontWeight: 'bold'}}>Booking Details</p>
    //               <PlannerEventExpandedInfo name='Booking Service:' value={this.props.activity.bookedThrough} />
    //               <PlannerEventExpandedInfo name='Confirmation Number:' value={this.props.activity.bookingConfirmation} />
    //               <PlannerEventExpandedInfo name='Price:' value={`${this.props.activity.currency} ${this.props.activity.cost}`} />
    //               <p style={{textDecoration: 'underline', fontWeight: 'bold'}}>Notes</p>
    //               <PlannerEventExpandedInfo name='' value={this.props.activity.start ? this.props.activity.departureNotes : this.props.activity.arrivalNotes} />
    //             </div>
    //           </div>
    //         </div>
    //       )
    //     case 'Lodging':
    //       return (
    //         <div style={{...activityBoxStyle, ...{marginBottom: '20px'}}}>
    //           <p style={nameStyle}>
    //             <ActivityInfo handleEdit={this.state.handleEdit} toggleEdit={() => this.toggleEdit()} editing={this.state.editing} toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity.location.name} googlePlaceData={this.props.activity.location} /><span style={{...typeStyle, ...{padding: '1px 4px'}}}> - </span>
    //             <span style={typeStyle}>{this.props.activity.start ? ' Check In' : ' Check Out'}</span>
    //           </p>
    //           <div style={{position: 'relative', display: 'inline'}}>
    //             {expandButton}
    //             {expandMenu}
    //           </div>
    //           <div style={expandedEventBoxStyle}>
    //             {expandedEventIcons}
    //             <div style={expandedEventBoxImageContainerStyle}>
    //               <img src={this.props.activity.backgroundImage} style={expandedEventBoxImageStyle} />
    //             </div>
    //             <div style={expandedEventBoxTextBoxStyle}>
    //               <PlannerEventExpandedInfo name={this.props.activity.start ? 'Check In Time:' : 'Check Out Time:'} value={this.props.activity.start ? startTime : endTime} />
    //               <PlannerEventExpandedInfo name='Price:' value={`${this.props.activity.currency} ${this.props.activity.cost}`} />
    //               <PlannerEventExpandedInfo name='Booking Platform:' value={this.props.activity.bookedThrough} />
    //               <PlannerEventExpandedInfo name='Booking Number:' value={this.props.activity.bookingConfirmation} />
    //               <PlannerEventExpandedInfo name='Notes:' value={this.props.activity.notes} />
    //             </div>
    //           </div>
    //         </div>
    //       )
    //     case 'Flight':
    //       return (
    //         <div style={{...activityBoxStyle, ...{marginBottom: '20px'}}}>
    //           <p style={nameStyle}>
    //             <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='googlePlaceData' value={this.props.activity.start ? this.props.activity.FlightInstance.departureLocation.name : this.props.activity.FlightInstance.arrivalLocation.name} /><span style={{...typeStyle, ...{padding: '1px 4px'}}}> - </span>
    //             <ActivityInfo toggleDraggable={() => this.toggleDraggable()} activityId={this.props.activity.modelId} itineraryId={this.props.itineraryId} type={type} name='name' value={this.props.activity.start ? 'Flight Departure' : 'Flight Arrival'} />
    //           </p>
    //           <div style={{position: 'relative', display: 'inline'}}>
    //             {expandButton}
    //             {expandMenu}
    //           </div>
    //           <div style={expandedEventBoxStyle}>
    //             {expandedEventIcons}
    //             <div style={expandedEventBoxImageContainerStyle}>
    //               <img src={this.props.activity.FlightBooking.backgroundImage} style={expandedEventBoxImageStyle} />
    //             </div>
    //             <div style={expandedEventBoxTextBoxStyle}>
    //               <PlannerEventExpandedInfo name={this.props.activity.start ? 'Departure Time:' : 'Arrival Time:'} value={this.props.activity.start ? startTime : endTime} />
    //               <PlannerEventExpandedInfo name='Price:' value={`${this.props.activity.FlightBooking.currency} ${this.props.activity.FlightBooking.cost}`} />
    //               <PlannerEventExpandedInfo name='Booking Platform:' value={this.props.activity.FlightBooking.bookedThrough} />
    //               <PlannerEventExpandedInfo name='Booking Number:' value={this.props.activity.FlightBooking.bookingConfirmation} />
    //               <PlannerEventExpandedInfo name='Notes:' value={this.props.activity.FlightInstance.notes} />
    //             </div>
    //           </div>
    //         </div>
    //       )
    //   }
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
