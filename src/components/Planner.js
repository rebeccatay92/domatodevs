import React, { Component } from 'react'

import { connect } from 'react-redux'
import { EditorState, convertFromRaw, ContentState } from 'draft-js'

import { toggleTimelineDay } from '../actions/plannerTimelineDayActions'
// import { plannerContainerStyle } from '../Styles/styles'
import DateBox from './planner/Date'
// import PlannerHeader from './PlannerHeader'

import { PlannerStyles as styles } from '../Styles/PlannerStyles'

class Planner extends Component {
  constructor (props) {
    super(props)
    // this.handleScrollBound = (e) => this.handleScroll(e)

    this.state = {
      draggable: true
    }
  }

  shouldComponentUpdate (nextProps) {
    // if refetch is true return true
    return nextProps.events.refetch
  }

  render () {
    if (!this.props.events) return (<h1>Loading</h1>)
    // console.log(this.props.events);

    return (
      // TABLE PLANNER CONTAINER IS 1274PX, HORIZONTALLY CENTERED.
      <div style={styles.tablePlannerContainer}>
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
            {this.props.daysArr.map((day, i) => {
              // if dates arr was passed down as prop. find date for this day
              let date = null
              if (this.props.datesArr) {
                date = this.props.datesArr[i] // UNIX secs
                // console.log('date in planner', date)
              }
              // DATE / DATES ARR IS UNIX (SECS)
              return (
                <DateBox days={this.props.days} daysArr={this.props.daysArr} dateOffsets={this.state.dateOffsets || {'day 1': true}} itineraryId={this.props.itineraryId} day={day} date={date} datesArr={this.props.datesArr} events={this.props.events.events.filter(
                  event => {
                    let eventDay = event.startDay
                    return eventDay === day
                  }
                )} draggable={this.state.draggable} key={i} firstDay={i === 0} lastDay={i === this.props.daysArr.length - 1} />
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
}

const mapStateToProps = (state) => {
  return {
    events: state.events
  }
}

export default connect(mapStateToProps)(Planner)
