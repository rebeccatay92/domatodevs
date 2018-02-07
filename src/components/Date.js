import React, { Component } from 'react'
import Radium from 'radium'
import Scroll from 'react-scroll'
import PlannerActivity from './PlannerActivity'
import PlannerTimelineHeader from './PlannerTimelineHeader'
import DateDropdownMenu from './DateDropdownMenu'
import { graphql, compose } from 'react-apollo'
import { changingLoadSequence } from '../apollo/changingLoadSequence'
import { updateItineraryDetails, queryItinerary } from '../apollo/itinerary'
import { DropTarget } from 'react-dnd'
import { connect } from 'react-redux'
import { dropActivity, deleteActivity, plannerActivityHoverOverActivity, hoverOutsidePlanner, initializePlanner } from '../actions/plannerActions'
import { addActivityToBucket, deleteActivityFromBucket } from '../actions/bucketActions'
import { toggleTimeline } from '../actions/plannerTimelineActions'
import PlannerColumnHeader from './PlannerColumnHeader'
import { primaryColor, timelineStyle, dateTableStyle, timelineColumnStyle, timelineTitleStyle, timelineTitleWordStyle, dayTimelineStyle, dayTimelineContainerStyle, dayTimelineWordStyle, dateTableFirstHeaderStyle, headerDayStyle, headerDateStyle, dateTableOtherHeaderStyle, dateTableHorizontalLineStyle } from '../Styles/styles'

// import CreateActivityForm from './CreateActivityForm'
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
      showDateMenu: false
    })
  }

  render () {
    const { connectDropTarget } = this.props
    const timeline = (
      <div style={timelineStyle} />
    )
    let expandButton
    if (this.state.hoveringOverDate && !this.state.showDateMenu) {
      expandButton = <i id={'day' + this.props.day} onClick={() => this.setState({showDateMenu: true})} className='material-icons dateMenu' style={{position: 'absolute', top: '-10px', marginLeft: '5px', fontSize: '30px', cursor: 'default'}} >more_horiz</i>
    } else if (this.state.showDateMenu) {
      expandButton = <i id={'day' + this.props.day} onClick={() => this.setState({showDateMenu: false})} className='material-icons dateMenu' style={{position: 'absolute', top: '-10px', marginLeft: '5px', fontSize: '30px', cursor: 'default', color: '#ed685a'}} >more_horiz</i>
    }
    return (
      <div ref={elem => { this.elem = elem }}>
        <table style={dateTableStyle}>
          <thead>
            <tr>
              <PlannerTimelineHeader firstDay={this.props.firstDay} dates={this.props.dates} itineraryId={this.props.itineraryId} days={this.props.days} />
              <th style={dateTableFirstHeaderStyle} onMouseEnter={() => this.setState({hoveringOverDate: true})} onMouseLeave={() => this.setState({hoveringOverDate: false})}>
                <Element name={'day-' + this.props.day}>
                  <div id={'day-' + this.props.day}>
                    <h3 style={headerDayStyle}>Day {this.props.day} </h3>
                    <span style={headerDateStyle}>{new Date(this.props.date).toDateString().toUpperCase()}</span>
                    <div style={{position: 'relative', display: 'inline'}}>
                      {expandButton}
                      {this.state.showDateMenu && <DateDropdownMenu day={this.props.day} toggleDateDropdown={(event) => this.toggleDateDropdown(event)} />}
                    </div>
                  </div>
                </Element>
              </th>
              {[1, 2, 3].map(i => {
                return !this.props.firstDay && (
                  <th style={dateTableOtherHeaderStyle} key={i} />
                )
              })}
              {this.props.firstDay && (
              this.props.columns.map((column, i) => {
                return (
                  <PlannerColumnHeader key={i} column={column} index={i} />
                )
              })
            )}
            </tr>
            <tr>
              <td style={timelineColumnStyle()}>
                {!this.props.firstDay && this.props.timeline.events && timeline}
              </td>
              <td colSpan='4'>
                <hr style={dateTableHorizontalLineStyle(this.props.firstDay)} />
              </td>
            </tr>
          </thead>
          {connectDropTarget(
            <tbody>
              {this.props.activities.map((activity, i, array) => {
                let isFirstInFlightBooking
                if (activity.type === 'Flight') {
                  isFirstInFlightBooking = activity.Flight.FlightInstance.firstFlight
                }
                return (
                  <PlannerActivity mouseOverTimeline={this.state.mouseOverTimeline} day={this.props.day} itineraryId={this.props.itineraryId} draggable={this.props.draggable} activity={activity} key={i} index={i} isLast={i === array.length - 1} columns={this.props.columns} date={this.props.date} firstDay={this.props.firstDay} lastDay={this.props.lastDay} dates={this.props.dates} firstInFlightBooking={isFirstInFlightBooking} countries={this.props.countries} />
                )
              })}
              <PlannerActivity empty itineraryId={this.props.itineraryId} activity={{day: this.props.day, type: 'empty', empty: {}, location: {name: ''}}} index={this.props.activities.length} lastDay={this.props.lastDay} day={this.props.day} date={this.props.date} dates={this.props.dates} countries={this.props.countries} highestLoadSequence={
                this.props.activities.length > 0 &&
                (this.props.activities[this.props.activities.length - 1].loadSequence ||
                this.props.activities[this.props.activities.length - 1].startLoadSequence ||
                this.props.activities[this.props.activities.length - 1].endLoadSequence ||
                this.props.activities[this.props.activities.length - 1].departureLoadSequence)
                }
              />
            </tbody>
        )}
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
      array.forEach(activity => {
        if (!activity.modelId) result = false
      })
      return result
    }

    if (!checkIfNoBlankBoxes(this.props.activities) && checkIfNoBlankBoxes(nextProps.activities) && nextProps.isOver) {
      // console.log(nextProps.activities)
      // let loadSequenceArr = []
      // console.log(this.elem);
      const changeLoadSeq = () => {
        const loadSequenceArr = nextProps.activities.map((activity, i) => {
          const day = activity.day
          const diff = activity.type === 'Food' || activity.type === 'Activity' ? activity[activity.type].endDay - activity[activity.type].startDay : 0
          // console.log(diff, activity[activity.type].location.name)
          return {...{
            id: activity.type === 'Flight' ? activity.Flight.FlightInstance.id : activity.modelId,
            type: activity.type === 'Flight' ? 'FlightInstance' : activity.type,
            loadSequence: i + 1,
            day: day,
            start: activity.start
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
    }
  }
}

const mapStateToProps = (state) => {
  return {
    columns: state.plannerColumns,
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
  graphql(updateItineraryDetails, { name: 'updateItineraryDetails' })
)(DropTarget(['activity', 'plannerActivity'], dateTarget, collect)(Radium(DateBox))))
