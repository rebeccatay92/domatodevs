import React, { Component } from 'react'
import { DropTarget } from 'react-dnd'

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
  render () {
    const { connectDropTarget } = this.props
    return (
      <div>
        <table style={{width: '100%', marginTop: '20px', marginLeft: '20px'}}>
          <thead>
            <tr>
              <th onMouseEnter={() => this.setState({hoveringOverDate: true})} onMouseLeave={() => this.setState({hoveringOverDate: false})}>
                <div id={'day-' + this.props.day}>
                  <h3 style={headerDayStyle}>Day {this.props.day} </h3>
                  {this.props.date &&
                    <span style={headerDateStyle}>{new Date(this.props.date).toDateString().toUpperCase()}</span>
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
              {this.props.events.map((event, i, array) => {
                let isFirstInFlightBooking
                if (event.type === 'Flight') {
                  isFirstInFlightBooking = event.Flight.FlightInstance.firstFlight
                }
                return (
                //   <PlannerActivity mouseOverTimeline={this.state.mouseOverTimeline} day={this.props.day} itineraryId={this.props.itineraryId} draggable={this.props.draggable} activity={activity} key={i} index={i} isLast={i === array.length - 1} columns={this.props.columns} date={this.props.date} daysArr={this.props.daysArr} firstDay={this.props.firstDay} lastDay={this.props.lastDay} dates={this.props.dates} firstInFlightBooking={isFirstInFlightBooking} countries={this.props.countries} />
                  <SideBarEvent day={this.props.day} itineraryId={this.props.itineraryId} draggable={this.props.draggable} event={event} key={i} index={i} isLast={i === array.length - 1} date={this.props.date} daysArr={this.props.daysArr} firstDay={this.props.firstDay} lastDay={this.props.lastDay} dates={this.props.dates} firstInFlightBooking={isFirstInFlightBooking} countries={this.props.countries} />
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

export default DropTarget(['activity', 'plannerActivity'], dateTarget, collect)(SideBarDate)
