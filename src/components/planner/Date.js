import React, { Component } from 'react'
import Radium from 'radium'
import Scroll from 'react-scroll'
// import PlannerActivity from './PlannerActivity'
import EventRow from './EventRow'
import ColumnHeader from './ColumnHeader'
import DateDropdownMenu from '../DateDropdownMenu'
import { graphql, compose } from 'react-apollo'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { updateItineraryDetails, queryItinerary } from '../../apollo/itinerary'
import { createEvent } from '../../apollo/event'
import { DropTarget } from 'react-dnd'
import { connect } from 'react-redux'
import { dropActivity, deleteActivity, plannerActivityHoverOverActivity, hoverOutsidePlanner, initializePlanner } from '../../actions/plannerActions'
import { addActivityToBucket, deleteActivityFromBucket } from '../../actions/bucketActions'
import { toggleTimeline } from '../../actions/plannerTimelineActions'
import { timelineStyle, dateTableStyle, timelineColumnStyle, dateTableFirstHeaderStyle, headerDayStyle, headerDateStyle, dateTableHorizontalLineStyle } from '../../Styles/styles'

// new actions
import { updateActiveEvent } from '../../actions/planner/activeEventActions'
import { changeActiveField } from '../../actions/planner/activeFieldActions'
import { setRightBarFocusedTab } from '../../actions/planner/plannerViewActions'

import moment from 'moment'

const Element = Scroll.Element

const dateTarget = {
  drop (props, monitor) {
  },
  hover (props, monitor) {
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
      showDateMenu: false
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
    const newLoadSeq = events.length + 1
    this.props.createEvent({
      variables: {
        ItineraryId: itineraryId,
        loadSequence: newLoadSeq,
        startDay: day
      },
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.itineraryId }
      }]
    })
    .then(response => {
      // this.props.setRightBarFocusedTab('event')
      this.props.updateActiveEvent(response.data.createEvent.id)
      this.props.changeActiveField('startTime')
    })
  }

  render () {
    // console.log('PROPS DATE UNIX', this.props.date)
    let dateString = moment.unix(this.props.date).format('ddd DD MMM YYYY')
    let dateStringUpcase = dateString.toUpperCase()

    // console.log(this.props.events);
    const { connectDropTarget, day, firstIndex } = this.props
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
            {this.props.firstDay && <tr>
              <td style={{width: '0px'}}></td>
              <td style={{textAlign: 'center', width: '114px'}}>Time</td>
              {columnState.map((column, i) => {
                const columnHeader = <ColumnHeader key={i} name={column.name} colSpan={column.width} startingColumn={startingColumn} endingColumn={startingColumn + column.width - 1} />
                startingColumn += column.width
                return columnHeader
              })}
            </tr>}
            {this.props.events.map((event, i) => {
              return <EventRow key={i} event={event} index={i + firstIndex} day={day} id={event.id} />
            })}
            <tr>
              <td style={{width: '0px'}}><div style={{minHeight: '83px'}} /></td>
              <td>
                <span onClick={() => this.handleCreateEvent()} style={{paddingLeft: '24px', cursor: 'pointer'}} className='add-event-link'>+ Add Event</span>
              </td>
            </tr>
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

  // scrollToDate (date) {
  //   const div = document.querySelector(date)
  //   console.log(div)
  // }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isOver === !this.props.isOver) {
      if (!nextProps.isOver) this.props.hoverOutsidePlanner()
    }

    const checkIfNoBlankBoxes = array => {
      let result = true
      array.forEach(event => {
        if (!event.id) result = false
      })
      return result
    }

    if (!checkIfNoBlankBoxes(this.props.events) && checkIfNoBlankBoxes(nextProps.events) && nextProps.isOver) {
      // console.log(nextProps.activities)
      // let loadSequenceArr = []
      // console.log(this.elem);
      const changeLoadSeq = () => {
        const loadSequenceArr = nextProps.events.map((event, i) => {
          const day = event.day
          const diff = event.type === 'Food' || event.type === 'Activity' ? event[event.type].endDay - event[event.type].startDay : 0
          // console.log(diff, activity[activity.type].location.name)
          return {...{
            id: event.id,
            loadSequence: i + 1,
            day: day,
            start: event.start
          },
          ...diff && {diff: diff}
          }
        })
        // console.log(loadSequenceArr)
        this.props.changingLoadSequence({
          variables: {
            input: loadSequenceArr
          },
          refetchQueries: [{
            query: queryItinerary,
            variables: { id: this.props.itineraryId }
          }]
        })
      }
      const handleKeydown = (event) => {
        if (event.keyCode === 27) {
          // console.log(this.props.data);
          this.props.data.refetch()
            .then(response => this.props.initializePlanner(response.data.findItinerary.events))
        }
        // if (event.keyCode === 13) changeLoadSeq()
      }
      if (nextProps.activities.length !== 1) document.addEventListener('keydown', event => handleKeydown(event))
      if (nextProps.activities.length === 1) {
        changeLoadSeq()
      }
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
    setRightBarFocusedTab: (tabName) => {
      return dispatch(setRightBarFocusedTab(tabName))
    }
  }
}

const mapStateToProps = (state) => {
  return {
    columns: state.columns,
    timeline: state.plannerTimeline,
    timelineDay: state.plannerTimelineDay
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
)(DropTarget(['activity', 'plannerActivity'], dateTarget, collect)(Radium(DateBox))))
