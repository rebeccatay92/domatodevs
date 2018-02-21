import React, { Component } from 'react'
import SideBarDate from './SideBarDate'

// DATES DAY ARR CALCULATION MOVED UP TO MAPPLANNERPAGE

class SideBarPlanner extends Component {
  render () {
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
          {this.props.daysArr.map((day, i) => {
            if (this.props.datesArr) {
              var date = this.props.datesArr[i]
            } else {
              date = null
            }

            return (
              <SideBarDate days={this.props.days} daysArr={this.props.daysArr} itineraryId={this.props.itineraryId} day={day} date={date} dates={this.props.datesArr} countries={this.props.itinerary.countries} events={this.props.events.filter(
                  event => {
                    let eventDay = event.day || event.departureDay || event.startDay || event.endDay
                    return eventDay === day
                  }
                )} key={i} firstDay={i === 0} lastDay={i === this.props.daysArr.length - 1} />
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
