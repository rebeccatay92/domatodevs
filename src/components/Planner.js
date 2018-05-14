import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { EditorState, convertFromRaw } from 'draft-js'
import { initializeEvents } from '../actions/planner/eventsActions'
import { toggleTimelineDay } from '../actions/plannerTimelineDayActions'
import { toggleSpinner } from '../actions/spinnerActions'
import { queryItinerary } from '../apollo/itinerary'
import { plannerContainerStyle } from '../Styles/styles'
import DateBox from './planner/Date'
// import PlannerHeader from './PlannerHeader'

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
    // this.handleScrollBound = (e) => this.handleScroll(e)

    this.state = {
      draggable: true
    }
  }

  shouldComponentUpdate (nextProps) {
    if (!nextProps.events.refetch) {
      return false
    } else {
      return true
    }
  }

  render () {
    if (this.props.data.loading) return (<h1>Loading</h1>)
    // console.log('apollo', this.props.data.findItinerary)
    // console.log(this.props.events);

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
        {/* PLANNER HEADER TAKES DATE PROP OF TYPE MILLISECS (GETTIME) */}
        <div>
          {/* {newDates &&
            <PlannerHeader name={this.props.data.findItinerary.name} description={this.props.data.findItinerary.description} id={this.props.id} days={days} startDate={newDates[0]} endDate={newDates[newDates.length - 1]} />
          }
          {!newDates &&
            <PlannerHeader name={this.props.data.findItinerary.name} description={this.props.data.findItinerary.description} id={this.props.id} days={days} />
          } */}
          <div>
            {daysArr.map((day, i) => {
              // if newDates exists, find date using day
              if (newDates) {
                var date = newDates[i]
                // console.log('date in planner', date)
              } else {
                date = null
              }
              // DATE BOX TAKES JS DATE OBJ ARR, DATE OBJ.
              const firstEventIndexOfDay = this.props.events.events.findIndex(event => event.startDay === day)
              return (
                <DateBox days={days} daysArr={daysArr} dateOffsets={this.state.dateOffsets || {'day 1': true}} itineraryId={this.props.id} day={day} date={date} dates={dates} countries={this.props.data.findItinerary.countries} events={this.props.events.events.filter(
                    event => {
                      let eventDay = event.startDay
                      return eventDay === day
                    }
                  )} draggable={this.state.draggable} key={i} firstDay={i === 0} lastDay={i === daysArr.length - 1} firstIndex={firstEventIndexOfDay} />
              )
            })}
          </div>
        </div>
        {/* </Scrollbars> */}
      </div>
    )
  }

  componentDidMount () {
    document.addEventListener('scroll', this.handleScrollBound)
  }

  componentWillUnmount () {
    document.removeEventListener('scroll', this.handleScrollBound)
  }

  // handleScroll (e) {
  //   function offset (el) {
  //     const rect = el.getBoundingClientRect()
  //       // scrollTop = window.pageYOffset || document.documentElement.scrollTop
  //     return { top: rect.top }
  //   }
  //
  //   var div = document.querySelector('#timeline-top')
  //   var divOffset
  //   divOffset = offset(div)
  //   const days = this.props.data.findItinerary.days
  //   let obj = {}
  //   for (var i = 1; i <= days; i++) {
  //     var dateDiv = document.querySelector(`#day-${i}`)
  //     if (i === 1 || offset(dateDiv).top < 100) {
  //       Object.keys(obj).forEach(key => {
  //         obj[key] = false
  //       })
  //       obj[`day ${i}`] = i === 1 ? true : offset(dateDiv).top < 100
  //     }
  //   }
  //   // console.log(_.isEqual(obj, this.state.dateOffsets))
  //   // if ((divOffset.top < 0) === this.props.timelineDay.timelineAtTop && _.isEqual(obj, this.props.timelineDay.dateOffsets)) return
  //   this.props.toggleTimelineDay({
  //     timelineAtTop: divOffset.top < 50,
  //     dateOffsets: obj
  //   })
  // }

  componentWillReceiveProps (nextProps) {
    if (this.props.data.findItinerary !== nextProps.data.findItinerary) {
      const allEvents = nextProps.data.findItinerary.events.map(event => {
        return {
          ...event,
          ...{
            eventType: EditorState.createEmpty(),
            location: EditorState.createEmpty(),
            cost: EditorState.createEmpty(),
            notes: EditorState.createEmpty()
          }
        }
      })
      // const activitiesWithTimelineErrors = checkForTimelineErrorsInPlanner(allEvents)
      // console.log(activitiesWithTimelineErrors)
      // this.props.initializePlanner(activitiesWithTimelineErrors)
      console.log(allEvents)
      this.props.initializeEvents(allEvents)
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
    events: state.events
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeEvents: (events) => {
      dispatch(initializeEvents(events))
    },
    toggleSpinner: (spinner) => {
      dispatch(toggleSpinner(spinner))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(graphql(queryItinerary, options)(Planner))
