import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { initializePlanner } from '../actions/plannerActions'
import { toggleTimelineDay } from '../actions/plannerTimelineDayActions'
import { toggleSpinner } from '../actions/spinnerActions'
import { queryItinerary } from '../apollo/itinerary'
import { Scrollbars } from 'react-custom-scrollbars'
import { plannerContainerStyle } from '../Styles/styles'
import DateBox from './Date'
import PlannerHeader from './PlannerHeader'

const _ = require('lodash')

const getDates = (startDate, days) => {
  let dateArray = []
  let currentDate = new Date(startDate)
  while (dateArray.length < days) {
    dateArray.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return dateArray
}

class Planner extends Component {
  constructor (props) {
    super(props)

    this.state = {
      draggable: true
    }
  }

  shouldComponentUpdate (nextProps) {
    if (_.isEqual(nextProps.activities, this.props.activities) && _.isEqual(nextProps.data.findItinerary, this.props.data.findItinerary)) return false
    else return true
  }

  render () {
    if (this.props.data.loading) return (<h1>Loading</h1>)
    // console.log('apollo', this.props.data.findItinerary)

    const startDate = new Date(this.props.data.findItinerary.startDate * 1000)

    const days = this.props.data.findItinerary.days

    if (this.props.data.findItinerary.startDate) {
      var dates = getDates(startDate, days)
      var newDates = dates.map(date => {
        return date.getTime()
      })
    } else {
      newDates = null
    }

    // use lodash to create arr of days
    var daysArr = _.range(1, days + 1)

    return (
      <div style={plannerContainerStyle}>
        {/* <Scrollbars renderThumbVertical={({ style }) =>
          <div style={{ ...style, backgroundColor: primaryColor, right: '-4px' }} />
        } renderThumbHorizontal={({ style }) =>
          <div style={{ ...style, display: 'none' }} />
        }
          renderTrackVertical={({style}) =>
            <div style={{ ...style, top: 0, right: 0, width: '10px', height: '100%' }} />
        } thumbSize={60} onScroll={(e) => this.handleScroll(e)}> */}
        <div style={{
          paddingLeft: '10px'
        }}>
          {newDates &&
            <PlannerHeader name={this.props.data.findItinerary.name} description={this.props.data.findItinerary.description} id={this.props.id} days={days} startDate={newDates[0]} endDate={newDates[newDates.length - 1]} />
          }
          {!newDates &&
            <PlannerHeader name={this.props.data.findItinerary.name} description={this.props.data.findItinerary.description} id={this.props.id} days={days} />
          }
          <div>
            {daysArr.map((day, i) => {
              // if newDates exists, find date using day
              if (newDates) {
                var date = newDates[i]
              } else {
                date = null
              }
              return (
                <DateBox days={days} daysArr={daysArr} timelineAtTop={this.state.timelineAtTop} dateOffsets={this.state.dateOffsets || {'day 1': true}} itineraryId={this.props.id} day={day} date={date} dates={dates} countries={this.props.data.findItinerary.countries} activities={this.props.activities.filter(
                    activity => {
                      let activityDay = activity.day || activity.departureDay || activity.startDay || activity.endDay
                      return activityDay === day
                    }
                  )} draggable={this.state.draggable} key={i} firstDay={i === 0} lastDay={i === daysArr.length - 1} />
              )
            })}
          </div>
        </div>
        {/* </Scrollbars> */}
      </div>
    )
  }

  componentDidMount () {
    document.addEventListener('scroll', (e) => this.handleScroll(e))
  }

  componentWillUnmount () {
    document.removeEventListener('scroll', (e) => this.handleScroll(e))
  }

  handleScroll (e) {
    function offset (el) {
      const rect = el.getBoundingClientRect(),
        scrollTop = window.pageYOffset || document.documentElement.scrollTop
      return { top: rect.top }
    }

    var div = document.querySelector('#timeline-top')
    var divOffset = offset(div)
    const days = this.props.data.findItinerary.days
    let obj = {}
    for (var i = 1; i <= days; i++) {
      var dateDiv = document.querySelector(`#day-${i}`)
      if (i === 1 || offset(dateDiv).top < 100) {
        Object.keys(obj).forEach(key => {
          obj[key] = false
        })
        obj[`day ${i}`] = i === 1 ? true : offset(dateDiv).top < 100
      }
    }
    // console.log(_.isEqual(obj, this.state.dateOffsets))
    // if ((divOffset.top < 0) === this.props.timelineDay.timelineAtTop && _.isEqual(obj, this.props.timelineDay.dateOffsets)) return
    this.props.toggleTimelineDay({
      timelineAtTop: divOffset.top < 50,
      dateOffsets: obj
    })
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.data.findItinerary !== nextProps.data.findItinerary) {
      const allEvents = nextProps.data.findItinerary.events
      // const activitiesWithTimelineErrors = checkForTimelineErrorsInPlanner(allEvents)
      // console.log(activitiesWithTimelineErrors)
      // this.props.initializePlanner(activitiesWithTimelineErrors)
      console.log(allEvents)
      this.props.initializePlanner(allEvents)
      setTimeout(() => this.props.toggleSpinner(false), 750)
    }
  }
}

const options = {
  options: props => ({
    variables: {
      id: props.id
    }
  })
}

const mapStateToProps = (state) => {
  return {
    activities: state.plannerActivities
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializePlanner: (activities) => {
      dispatch(initializePlanner(activities))
    },
    toggleTimelineDay: (options) => {
      dispatch(toggleTimelineDay(options))
    },
    toggleSpinner: (spinner) => {
      dispatch(toggleSpinner(spinner))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(graphql(queryItinerary, options)(Planner))
