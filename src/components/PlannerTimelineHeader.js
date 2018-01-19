import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { toggleTimeline } from '../actions/plannerTimelineActions'

import { updateItineraryDetails, queryItinerary } from '../apollo/itinerary'

import { primaryColor, timelineColumnStyle, timelineTitleStyle, timelineTitleWordStyle, dayTimelineStyle, dayTimelineContainerStyle, dayTimelineWordStyle, addDayButtonStyle, addDayWordStyle, timelineStyle } from '../Styles/styles'

const _ = require('lodash')

class PlannerTimelineHeader extends Component {
  shouldComponentUpdate (nextProps) {
    if (!this.props.firstDay || (nextProps.timelineDay.timelineAtTop === this.props.timelineDay.timelineAtTop && _.isEqual(nextProps.timelineDay.dateOffsets, this.props.timelineDay.dateOffsets))) return false
    else return true
  }

  render () {
    const timeline = (
      <div style={timelineStyle} />
    )
    const headerSticky = this.props.timelineDay.timelineAtTop
    const sticky = this.props.timelineDay.timelineAtTop && this.props.timeline.days
    return (
      <th id='timeline-top' style={timelineColumnStyle()}>
        {this.props.firstDay && (
          <div style={timelineTitleStyle(headerSticky)}>
            <span style={{fontSize: '24px', color: primaryColor, display: 'inline-block'}}>
              <i key='leftArrowTimeline' onClick={() => this.handleClick()} className='material-icons' style={{width: '15px', overflow: 'hidden', cursor: 'pointer', opacity: '0.6', ':hover': {opacity: '1'}}}>keyboard_arrow_left</i>
              <i key='righttArrowTimeline' onClick={() => this.handleClick()} className='material-icons' style={{cursor: 'pointer', opacity: '0.6', ':hover': {opacity: '1'}}}>keyboard_arrow_right</i>
            </span>
            <span style={timelineTitleWordStyle}>{this.props.timeline.events ? 'Duration' : 'Days'}</span>
          </div>
        )}
        {this.props.firstDay && this.props.timeline.days && !this.props.getItem && (
          <div style={dayTimelineStyle(sticky)}>
            {this.props.dates.map((date, i) => {
              const isDateOnScreen = this.props.timelineDay.dateOffsets[`day ${i + 1}`]
              return (
                <div key={i}>
                  <a href={'#day-' + (i + 1)}>
                    <div style={dayTimelineContainerStyle(isDateOnScreen)}>
                      <span style={dayTimelineWordStyle(isDateOnScreen)}>Day {i + 1}</span>
                    </div>
                  </a>
                  {i < this.props.dates.length - 1 && <div style={{height: '10px', position: 'relative'}}>
                    {timeline}
                  </div>}
                </div>
              )
            })}
            <div onClick={() => this.addDay()} style={addDayButtonStyle}>
              <span style={addDayWordStyle}>+ Day</span>
            </div>
          </div>
        )}
        {!this.props.firstDay && this.props.timeline.events && (
          timeline
        )}
      </th>
    )
  }

  handleClick () {
    this.props.toggleTimeline({
      events: !this.props.timeline.events,
      days: !this.props.timeline.days
    })
  }

  addDay () {
    this.props.updateItineraryDetails({
      variables: {
        id: this.props.itineraryId,
        days: this.props.days + 1
      },
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.itineraryId }
      }]
    })
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleTimeline: (options) => {
      dispatch(toggleTimeline(options))
    }
  }
}

const mapStateToProps = (state) => {
  return {
    timeline: state.plannerTimeline,
    timelineDay: state.plannerTimelineDay
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(updateItineraryDetails, { name: 'updateItineraryDetails' })
)(PlannerTimelineHeader))
