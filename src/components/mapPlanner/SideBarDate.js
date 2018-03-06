import React, { Component } from 'react'
import { DropTarget } from 'react-dnd'
import { connect } from 'react-redux'
import { toggleDaysFilter } from '../../actions/mapPlannerActions'
import SideBarEvent from './SideBarEvent'

import { primaryColor, timelineStyle, dateTableStyle, timelineColumnStyle, timelineTitleStyle, timelineTitleWordStyle, dayTimelineStyle, dayTimelineContainerStyle, dayTimelineWordStyle, dateTableFirstHeaderStyle, headerDayStyle, headerDateStyle, dateTableOtherHeaderStyle, mapPlannerDateTableHorizontalLineStyle } from '../../Styles/styles'

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

class SideBarDate extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hoveringOverDate: false
    }
  }
  render () {
    var isExpanded = this.props.mapPlannerDaysFilterArr.includes(this.props.day)
    const { connectDropTarget } = this.props
    return (
      <div>
        <table style={{width: '100%', marginTop: '20px', marginLeft: '20px'}}>
          <thead>
            <tr>
              <th onMouseEnter={() => this.setState({hoveringOverDate: true})} onMouseLeave={() => this.setState({hoveringOverDate: false})} onClick={() => this.props.toggleDaysFilter(this.props.day)}>
                <div id={'day-' + this.props.day}>
                  <h3 style={headerDayStyle}>Day {this.props.day} </h3>
                  {/* THIS.PROPS.DATE IS UNIX SECS */}
                  {this.props.date &&
                    <span style={headerDateStyle}>{new Date(this.props.date * 1000).toDateString().toUpperCase()}</span>
                  }
                  {this.state.hoveringOverDate && !isExpanded &&
                    <span>Expand</span>
                  }
                  {this.state.hoveringOverDate && isExpanded &&
                    <span>Collapse</span>
                  }
                </div>
              </th>
            </tr>
            <tr>
              <td>
                <hr style={mapPlannerDateTableHorizontalLineStyle(false)} />
              </td>
            </tr>
          </thead>
          {connectDropTarget(
            <tbody>
              {isExpanded && this.props.events.map((event, i, array) => {
                let isFirstInFlightBooking
                if (event.type === 'Flight') {
                  isFirstInFlightBooking = event.Flight.FlightInstance.firstFlight
                }
                return (
                  <SideBarEvent day={this.props.day} itineraryId={this.props.itineraryId} draggable={this.props.draggable} event={event} key={i} index={i} isLast={i === array.length - 1} date={this.props.date} daysArr={this.props.daysArr} firstDay={this.props.firstDay} lastDay={this.props.lastDay} dates={this.props.dates} firstInFlightBooking={isFirstInFlightBooking} />
                )
              })}
              {/* <PlannerActivity empty itineraryId={this.props.itineraryId} activity={{day: this.props.day, type: 'empty', empty: {}, location: {name: ''}}} index={this.props.activities.length} lastDay={this.props.lastDay} day={this.props.day} date={this.props.date} dates={this.props.dates} daysArr={this.props.daysArr} /> */}
            </tbody>
          )}
        </table>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleDaysFilter: (dayInt) => {
      dispatch(toggleDaysFilter(dayInt))
    }
  }
}
const mapStateToProps = (state) => {
  return {
    mapPlannerDaysFilterArr: state.mapPlannerDaysFilterArr
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DropTarget(['activity', 'plannerActivity'], dateTarget, collect)(SideBarDate))
