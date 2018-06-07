import React, { Component } from 'react'
import Radium from 'radium'
import Scroll from 'react-scroll'
// import PlannerActivity from './PlannerActivity'
import EventRow from './EventRow'
import ColumnHeader from './ColumnHeader'
import DateDropdownMenu from '../DateDropdownMenu'
import { graphql, compose } from 'react-apollo'
// import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { updateItineraryDetails, queryItinerary } from '../../apollo/itinerary'
import { createEvent, changingLoadSequence } from '../../apollo/event'
import { DropTarget } from 'react-dnd'
import { connect } from 'react-redux'
import { dropActivity, deleteActivity, plannerActivityHoverOverActivity, hoverOutsidePlanner, initializePlanner } from '../../actions/plannerActions'
import { addActivityToBucket, deleteActivityFromBucket } from '../../actions/bucketActions'
import { toggleTimeline } from '../../actions/plannerTimelineActions'
import { toggleSpinner } from '../../actions/spinnerActions'
import { timelineStyle, dateTableStyle, timelineColumnStyle, dateTableFirstHeaderStyle, headerDayStyle, headerDateStyle, dateTableHorizontalLineStyle } from '../../Styles/styles'

import { ContentState } from 'draft-js'

// new actions
import { updateActiveEvent } from '../../actions/planner/activeEventActions'
import { changeActiveField } from '../../actions/planner/activeFieldActions'
import { setRightBarFocusedTab } from '../../actions/planner/plannerViewActions'
import { updateEvent, initializeEvents, plannerEventHoverOverEvent, sortEvents } from '../../actions/planner/eventsActions'
import { setTimeCellFocus } from '../../actions/planner/timeCellFocusActions'
import { changeColumnSort } from '../../actions/planner/sortActions'

import moment from 'moment'

const Element = Scroll.Element

const dateTarget = {
  hover (props, monitor) {
    let day = props.day
    if (props.events.filter(event => event.dropzone && event.startDay === day).length > 0) return
    if (monitor.getItemType() === 'plannerEvent') {
      props.plannerEventHoverOverEvent(props.events.length, monitor.getItem(), day)
    }
  }
}

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    getItem: monitor.getItem()
  }
}

class DateBox extends Component {
  constructor (props) {
    super(props)
    this.state = {
      creatingActivity: false,
      hoveringOverDate: false,
      showDateMenu: false,
      expanded: true
    }
  }

  toggleDateDropdown (event) {
    if (event) {
      if (event.target.textContent === 'more_horiz' && event.target.id === 'day' + this.props.day) return
    }
    this.setState({
      showDateMenu: false,
      hoveringOverDate: false
    })
  }

  handleCreateEvent () {
    const { itineraryId, day, events } = this.props
    const newLoadSeq = events.length > 0 ? events[events.length - 1].loadSequence + 1 : 1
    this.props.updateEvent(null, null, null, false)
    this.props.toggleSpinner(true)
    this.props.createEvent({
      variables: {
        ItineraryId: itineraryId,
        loadSequence: newLoadSeq,
        startDay: day
      }
    })
    .then((response) => {
      return Promise.all([this.props.data.refetch(), response.data.createEvent.id])
    })
    .then(response => {
      this.props.updateActiveEvent(response[1])
      this.props.changeActiveField('startTime')
      // this.props.setTimeCellFocus(true)
    })
  }

  handleSort (type) {
    this.props.changeColumnSort('startTime', type)
    this.props.sortEvents('startTime', type)
  }

  render () {
    // console.log(this.props.events)
    // console.log('PROPS DATE UNIX', this.props.date)
    let dateString = moment.unix(this.props.date).format('ddd DD MMM YYYY')
    let dateStringUpcase = dateString.toUpperCase()

    // console.log(this.props.events);
    const { connectDropTarget, day, itineraryId, sortOptions } = this.props
    const timeline = (
      <div style={timelineStyle} />
    )
    let expandButton
    if (this.state.hoveringOverDate && !this.state.showDateMenu) {
      expandButton = <i id={'day' + this.props.day} onClick={() => this.setState({showDateMenu: true})} className='material-icons dateMenu' style={{cursor: 'pointer', position: 'absolute', top: '-5px', marginLeft: '8px', fontSize: '20px'}} >more_horiz</i>
    } else if (this.state.showDateMenu) {
      expandButton = <i id={'day' + this.props.day} onClick={() => this.setState({showDateMenu: false})} className='material-icons dateMenu' style={{cursor: 'pointer', position: 'absolute', top: '-5px', marginLeft: '8px', fontSize: '20px', color: '#ed685a'}} >more_horiz</i>
    }
    let columnState = []
    let activeColumn = ''
    this.props.columns.forEach((column, i) => {
      if (i > 0) activeColumn = this.props.columns[i - 1]
      if (activeColumn !== column) {
        columnState.push({name: column, width: 1})
      } else if (activeColumn === column) {
        columnState[columnState.length - 1].width++
      }
    })
    let startingColumn = 0
    return (
      <div ref={elem => { this.elem = elem }}>
        <table style={dateTableStyle}>
          <thead>
            <tr>
              {/* <PlannerTimelineHeader firstDay={this.props.firstDay} dates={this.props.dates} itineraryId={this.props.itineraryId} days={this.props.days} daysArr={this.props.daysArr} /> */}
              <th style={{width: '0px'}}></th>
              <th colSpan={this.props.columns.length + 1} style={dateTableFirstHeaderStyle} onMouseEnter={() => this.setState({hoveringOverDate: true})} onMouseLeave={() => this.setState({hoveringOverDate: false})}>
                <Element name={'day-' + this.props.day}>
                  <div id={'day-' + this.props.day} style={{position: 'absolute', bottom: '8px', cursor: 'default'}}>
                    <h3 style={headerDayStyle}>Day {this.props.day} </h3>
                    {this.props.date &&
                      <span style={headerDateStyle}>
                        {dateStringUpcase}
                      </span>
                    }
                    <div style={{position: 'relative', display: 'inline'}}>
                      {expandButton}
                      {this.state.showDateMenu && <DateDropdownMenu day={this.props.day} days={this.props.days} itineraryId={this.props.itineraryId} toggleDateDropdown={(event) => this.toggleDateDropdown(event)} />}
                    </div>
                  </div>
                  <div style={{position: 'absolute', right: '0', top: '5px', height: '100%', display: 'flex', alignItems: 'center'}}>
                    <i onClick={() => this.setState({expanded: !this.state.expanded})} className='material-icons' style={{cursor: 'pointer'}}>{this.state.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
                  </div>
                </Element>
              </th>
              {/* {[1, 2, 3].map(i => {
                return !this.props.firstDay && (
                  <th style={dateTableOtherHeaderStyle} key={i} />
                )
              })} */}
              {/* {this.props.firstDay && (
              this.props.columns.map((column, i) => {
                return (
                  <PlannerColumnHeader key={i} column={column} index={i} />
                )
              }))} */}
            </tr>
            <tr>
              <td style={timelineColumnStyle()}>
              </td>
              <td colSpan='6'>
                <hr style={dateTableHorizontalLineStyle(this.props.firstDay)} />
              </td>
            </tr>
          </thead>
          <tbody>
            {this.state.expanded && <tr>
              <td style={{width: '0px'}}></td>
              <td style={{textAlign: 'center', width: '114px'}}>
                Time
                {(sortOptions.column !== 'startTime' || sortOptions.type === 'unsorted') && <i className='material-icons' style={{verticalAlign: 'top', fontSize: '20px', cursor: 'pointer'}} onClick={() => this.handleSort('descending')}>unfold_more</i>}
                {(sortOptions.column === 'startTime' && sortOptions.type === 'descending') && <i className='material-icons' style={{verticalAlign: 'top', fontSize: '20px', cursor: 'pointer'}} onClick={() => this.handleSort('ascending')}>keyboard_arrow_down</i>}
                {(sortOptions.column === 'startTime' && sortOptions.type === 'ascending') && <i className='material-icons' style={{verticalAlign: 'top', fontSize: '20px', cursor: 'pointer'}} onClick={() => this.handleSort('unsorted')}>keyboard_arrow_up</i>}
              </td>
              {columnState.map((column, i) => {
                const columnHeader = <ColumnHeader key={i} name={column.name} colSpan={column.width} startingColumn={startingColumn} endingColumn={startingColumn + column.width - 1} />
                startingColumn += column.width
                return columnHeader
              })}
            </tr>}
            {this.state.expanded && this.props.events.map((event, i) => {
              return <EventRow key={i} event={event} day={day} id={event.id} itineraryId={itineraryId} index={i} />
            })}
            {this.state.expanded && connectDropTarget(<tr>
              <td style={{width: '0px'}}><div style={{minHeight: '83px'}} /></td>
              <td>
                <span onClick={() => this.handleCreateEvent()} style={{paddingLeft: '24px', cursor: 'pointer'}} className='add-event-link'>+ Add Event</span>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>
    )
  }

  handleClick () {
    this.props.toggleTimeline({
      events: !this.props.timeline.events,
      days: !this.props.timeline.days
    })
  }

  componentWillReceiveProps (nextProps) {
    // If event is dropped in this date
    if (this.props.events.filter(event => event.dropzone).length > 0 && nextProps.events.filter(event => event.dropzone).length < 1 && this.props.events.length === nextProps.events.length) {
      const newEventsArr = nextProps.events.map((event, i) => {
        return {
          EventId: event.id,
          loadSequence: i + 1,
          startDay: nextProps.day
        }
      })

      this.props.changingLoadSequence({
        variables: {
          input: newEventsArr
        }
      })
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dropActivity: (activity) => {
      dispatch(dropActivity(activity))
    },
    deleteActivity: (activity) => {
      dispatch(deleteActivity(activity))
    },
    addActivityToBucket: (activity) => {
      dispatch(addActivityToBucket(activity))
    },
    deleteActivityFromBucket: (activity) => {
      dispatch(deleteActivityFromBucket(activity))
    },
    plannerActivityHoverOverActivity: (index, activity, day) => {
      dispatch(plannerActivityHoverOverActivity(index, activity, day))
    },
    hoverOutsidePlanner: () => {
      dispatch(hoverOutsidePlanner())
    },
    toggleTimeline: (options) => {
      dispatch(toggleTimeline(options))
    },
    initializePlanner: (activities) => {
      dispatch(initializePlanner(activities))
    },
    updateActiveEvent: (id) => {
      return dispatch(updateActiveEvent(id))
    },
    changeActiveField: (field) => {
      return dispatch(changeActiveField(field))
    },
    updateEvent: (id, property, value, fromSidebar) => {
      return dispatch(updateEvent(id, property, value, fromSidebar))
    },
    initializeEvents: (events) => {
      dispatch(initializeEvents(events))
    },
    toggleSpinner: (spinner) => {
      dispatch(toggleSpinner(spinner))
    },
    setTimeCellFocus: (focus) => {
      dispatch(setTimeCellFocus(focus))
    },
    plannerEventHoverOverEvent: (index, event, day) => {
      dispatch(plannerEventHoverOverEvent(index, event, day))
    },
    changeColumnSort: (column, sortType) => {
      return dispatch(changeColumnSort(column, sortType))
    },
    sortEvents: (column, sortType) => {
      return dispatch(sortEvents(column, sortType))
    }
  }
}

const mapStateToProps = (state) => {
  return {
    columns: state.columns,
    timeline: state.plannerTimeline,
    timelineDay: state.plannerTimelineDay,
    plannerView: state.plannerView,
    sortOptions: state.sortOptions
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
  graphql(changingLoadSequence, { name: 'changingLoadSequence' }),
  graphql(updateItineraryDetails, { name: 'updateItineraryDetails' }),
  graphql(createEvent, { name: 'createEvent' })
)(DropTarget(['plannerEvent'], dateTarget, collect)(Radium(DateBox))))
