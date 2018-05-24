import React, { Component } from 'react'
import LeftBarEventRow from './LeftBarEventRow'

import { connect } from 'react-redux'
import { clickDayCheckbox } from '../../actions/planner/mapboxActions'
import { updateActiveEvent } from '../../actions/planner/activeEventActions'

import moment from 'moment'

class LeftBarDateBox extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hoveringOverDate: false
    }
  }

  clickDayCheckbox (day) {
    // if activeEventId is in a soon to be collapsed day, also dispatch updateActiveEvent('')
    let daysToShow = this.props.mapbox.daysToShow
    let isDayChecked = daysToShow.includes(day)

    // this.props.events is events in this day (passed from parent)
    let isActiveEventInThisDay = this.props.events.find(e => {
      return e.id === this.props.activeEventId
    })

    // console.log('isDayChecked', isDayChecked, 'isActiveEventInThisDay', isActiveEventInThisDay
    if (isDayChecked && isActiveEventInThisDay) {
      this.props.updateActiveEvent('')
    }
    // dispatch clickDayCheckbox redux
    this.props.clickDayCheckbox(day)
  }

  render () {
    if (this.props.date) {
      var dateString = moment.unix(this.props.date).format('ddd DD MMM YYYY')
      var dateStringUpcase = dateString.toUpperCase()
    }

    let daysToShow = this.props.mapbox.daysToShow
    let isDayChecked = daysToShow.includes(this.props.day)
    return (
      <div>
        <div style={{display: 'flex', alignItems: 'center', alignContent: 'center', height: '42px', paddingLeft: '50px', cursor: 'pointer'}} onMouseEnter={() => this.setState({hoveringOverDate: true})} onMouseLeave={() => this.setState({hoveringOverDate: false})} onClick={() => this.clickDayCheckbox(this.props.day)}>
          <h6 style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, color: 'rgba(60, 58, 68, 1)', fontSize: '24px', margin: '0 10px 0 0', padding: 0}}>Day {this.props.day}</h6>
          {this.props.date &&
            <h6 style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, color: 'rgba(60, 58, 68, 1)', fontSize: '16px', margin: '5px 0 0 0', padding: 0}}>{dateStringUpcase}</h6>
          }
          {this.state.hoveringOverDate && isDayChecked &&
            <span>Collapse</span>
          }
          {this.state.hoveringOverDate && !isDayChecked &&
            <span>Expand</span>
          }
        </div>
        {isDayChecked && this.props.events.map((event, i) => {
          return (
            <div key={i}>
              <hr style={{margin: 0}} />
              <LeftBarEventRow event={event} />
            </div>
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    mapbox: state.mapbox,
    activeEventId: state.activeEventId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clickDayCheckbox: (day) => {
      dispatch(clickDayCheckbox(day))
    },
    updateActiveEvent: (id) => {
      dispatch(updateActiveEvent(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftBarDateBox)
