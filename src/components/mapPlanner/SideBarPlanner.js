import React, { Component } from 'react'
import SideBarDate from './SideBarDate'

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
            //DATESARR IS IN UNIX SECS
            if (this.props.datesArr) {
              var date = this.props.datesArr[i]
            } else {
              date = null
            }
            return (
              <SideBarDate days={this.props.days} daysArr={this.props.daysArr} itineraryId={this.props.itineraryId} day={day} date={date} dates={this.props.datesArr} events={this.props.events.filter(e => {
                return e.day === day
              })} key={i} firstDay={i === 0} lastDay={i === this.props.daysArr.length - 1} />
            )
          })}
        </div>
        {/* </Scrollbars> */}
      </div>
    )
  }
}

export default SideBarPlanner
