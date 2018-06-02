import React, { Component } from 'react'
import LeftBarEventRow from './LeftBarEventRow'

import { connect } from 'react-redux'
import { clickDayCheckbox } from '../../actions/planner/mapboxActions'
import { updateActiveEvent } from '../../actions/planner/activeEventActions'
import { setRightBarFocusedTab } from '../../actions/planner/plannerViewActions'

import { graphql, compose } from 'react-apollo'
import { createEvent } from '../../apollo/event'
import { queryItinerary } from '../../apollo/itinerary'

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
      this.props.setRightBarFocusedTab('')
    }
    // dispatch clickDayCheckbox redux
    this.props.clickDayCheckbox(day)
  }

  createNewEvent () {
    let day = this.props.day
    let loadSequence = this.props.events.length + 1
    this.props.createEvent({
      variables: {
        ItineraryId: this.props.itineraryId,
        startDay: day,
        loadSequence
      }
    })
      .then(response => {
        // console.log('response', response)
        let returningId = response.data.createEvent.id
        return Promise.all([this.props.data.refetch(), returningId])
      })
      .then(promiseArr => {
        this.props.updateActiveEvent(promiseArr[1])
      })
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
        {isDayChecked &&
          <div style={{display: 'flex', alignItems: 'center', height: '42px', cursor: 'pointer', paddingLeft: '65px'}} onClick={() => this.createNewEvent(this.props.day)}>
            <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', color: 'rgb(60, 58, 68)'}}>+ Add New Event</span>
          </div>
        }
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
    },
    setRightBarFocusedTab: (tabName) => {
      dispatch(setRightBarFocusedTab(tabName))
    }
  }
}

const options = {
  options: props => ({
    variables: {
      id: props.itineraryId
    }
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(queryItinerary, options),
  graphql(createEvent, {name: 'createEvent'})
)(LeftBarDateBox))
