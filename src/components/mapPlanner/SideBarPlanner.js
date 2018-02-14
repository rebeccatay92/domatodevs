import React, { Component } from 'react'
// import { plannerContainerStyle } from '../../Styles/styles'
import SideBarDate from './SideBarDate'
// import PlannerHeader from './PlannerHeader'

const _ = require('lodash')
// split into date, activity component

class SideBarPlanner extends Component {
  render () {
    const getDates = (startDate, days) => {
      let dateArray = []
      let currentDate = new Date(startDate)
      while (dateArray.length < days) {
        dateArray.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }
      return dateArray
    }

    const startDate = new Date(this.props.itinerary.startDate * 1000)

    const days = this.props.itinerary.days

    if (this.props.itinerary.startDate) {
      var dates = getDates(startDate, days)
      var newDates = dates.map(date => {
        return date.getTime()
      })
    } else {
      newDates = null
    }

    // use lodash to create arr of days. range(5) -> [0,1,2,3,4]. range(1,5) -> [1,2,3,4]
    var daysArr = _.range(1, days + 1)
    // console.log('daysArr', daysArr)
    // newDates is mapped to produce days in Planner. change to map by days
    return (
      <div>
        {/* <Scrollbars renderThumbVertical={({ style }) =>
          <div style={{ ...style, backgroundColor: primaryColor, right: '-4px' }} />
        } renderThumbHorizontal={({ style }) =>
          <div style={{ ...style, display: 'none' }} />
        }
          renderTrackVertical={({style}) =>
            <div style={{ ...style, top: 0, right: 0, width: '10px', height: '100%' }} />
        } thumbSize={60} onScroll={(e) => this.handleScroll(e)}> */}
        <div>
          {daysArr.map((day, i) => {
              // if newDates exists, find date using day
            if (newDates) {
              var date = newDates[i]
            } else {
              date = null
            }
            return (
              <SideBarDate days={days} daysArr={daysArr} itineraryId={this.props.itineraryId} day={day} date={date} dates={dates} countries={this.props.itinerary.countries} events={this.props.events.filter(
                  event => {
                    let eventDay = event.day || event.departureDay || event.startDay || event.endDay
                    return eventDay === day
                  }
                )} key={i} firstDay={i === 0} lastDay={i === daysArr.length - 1} />
            )
              // return (
              //   <DateBox days={days} daysArr={daysArr} itineraryId={this.props.id} day={day} date={date} dates={dates} countries={this.props.itinerary.countries} activities={this.props.events.filter(
              //       activity => {
              //         let activityDay = activity.day || activity.departureDay || activity.startDay || activity.endDay
              //         return activityDay === day
              //       }
              //     )} key={i} firstDay={i === 0} lastDay={i === daysArr.length - 1} />
              // )
          })}
        </div>
        {/* </Scrollbars> */}
      </div>
    )
  }
}

export default SideBarPlanner
