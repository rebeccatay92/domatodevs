import React, { Component } from 'react'
import { connect } from 'react-redux'

import LeftBarDateBox from './LeftBarDateBox'

class PlannerLeftBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // draggable: true
    }
  }

  // shouldComponentUpdate (nextProps) {
  //   return nextProps.events.refetch
  // }

  render () {
    if (!this.props.events) return (<h1>Loading</h1>)
    // 8px * 47 = 376px
    return (
      <div style={{width: '376px', height: 'calc(100vh - 52px - 51px)', borderRight: '1px solid rgba(60, 58, 68, 0.7)', overflow: 'scroll'}}>
        {this.props.daysArr.map((day, i) => {
          let date = null
          if (this.props.datesArr) {
            date = this.props.datesArr[i]
          }
          let dayEvents = this.props.events.events.filter(e => {
            return e.startDay === day
          })
          let sortedDayEvents = dayEvents.sort((a, b) => {
            return a.loadSequence - b.loadSequence
          })
          return (
            <LeftBarDateBox days={this.props.days} daysArr={this.props.daysArr} itineraryId={this.props.itineraryId} day={day} date={date} datesArr={this.props.datesArr} events={sortedDayEvents} key={i} />
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.events
  }
}

export default connect(mapStateToProps)(PlannerLeftBar)
