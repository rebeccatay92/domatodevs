import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'

import checkStartAndEndTime from '../helpers/checkStartAndEndTime'
import { constructGooglePlaceDataObj } from '../helpers/location'
import updateEventLoadSeqAssignment from '../helpers/updateEventLoadSeqAssignment'
import LocationSearch from './location/LocationSearch'

import { updateActivity } from '../apollo/activity'
import { updateFlightBooking } from '../apollo/flight'
import { updateLodging } from '../apollo/lodging'
import { updateLandTransport } from '../apollo/landtransport'
import { updateFood } from '../apollo/food'
import { changingLoadSequence } from '../apollo/changingLoadSequence'

import { queryItinerary } from '../apollo/itinerary'

class ActivityInfo extends Component {
  constructor (props) {
    super(props)

    this.state = {
      editing: this.props.editing || false,
      value: this.props.suggestedStartTime || this.props.suggestedEndTime || this.props.value,
      newValue: this.props.suggestedStartTime || this.props.suggestedEndTime || this.props.value,
      startTime: this.props.suggestedStartTime || this.props.startTime,
      newStartTime: this.props.suggestedStartTime || this.props.startTime,
      endTime: this.props.suggestedEndTime || this.props.endTime,
      newEndTime: this.props.suggestedEndTime || this.props.endTime,
      googlePlaceData: this.props.googlePlaceData || {}
    }

    this.toggleDraggable = this.props.toggleDraggable
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value !== this.props.value || nextProps.startTime !== this.props.startTime || nextProps.endTime !== this.props.endTime) {
      this.setState({
        value: nextProps.value,
        newValue: nextProps.value,
        startTime: nextProps.startTime,
        newStartTime: nextProps.startTime,
        endTime: nextProps.endTime,
        newEndTime: nextProps.endTime
      })
    }
  }

  selectLocation (location) {
    this.setState({googlePlaceData: constructGooglePlaceDataObj(location)}, () => {
      this.handleEdit()
    })
    console.log('selected location', location)
  }

  render () {
    if (this.state.editing && this.props.name === 'time') {
      if (this.props.allDay) {
        return (
          <p onKeyDown={(e) => this.handleKeyDown(e)} style={{...this.props.timeStyle, ...{width: '220px'}}}>
            <input type='time' onChange={(e) => this.setState({ newStartTime: e.target.value })} />
            <span> - </span>
            <input type='time' onChange={(e) => this.setState({ newEndTime: e.target.value })} />
          </p>
        )
      }
      return (
        <p onKeyDown={(e) => this.handleKeyDown(e)} style={{...this.props.timeStyle, ...{width: '220px'}}}>
          <input autoFocus type='time' value={this.state.newStartTime} onChange={(e) => this.setState({ newStartTime: e.target.value })} />
          <span> - </span>
          <input type='time' value={this.state.newEndTime} onChange={(e) => this.setState({ newEndTime: e.target.value })} />
        </p>
      )
    }
    if (this.state.editing) {
      if (this.props.name === 'startTime' || this.props.name === 'endTime') {
        return (
          <input autoFocus onKeyDown={(e) => this.handleKeyDown(e)} type='time' value={this.state.newValue} onChange={(e) => this.setState({ newValue: e.target.value })} />
        )
      }
      if (this.props.name === 'googlePlaceData' || this.props.name === 'departureGooglePlaceData' || this.props.name === 'arrivalGooglePlaceData') {
        return (
          <span onKeyDown={(e) => this.handleKeyDown(e)} style={{display: 'inline-block'}}>
            <LocationSearch eventInfo selectLocation={location => this.selectLocation(location)} placeholder='' currentLocation={this.state.googlePlaceData} />
          </span>
        )
      }
      return (
        <input autoFocus onKeyDown={(e) => this.handleKeyDown(e)} style={{position: 'relative', top: '-5px'}} name={this.props.name} onChange={(e) => this.setState({ newValue: e.target.value })} value={this.state.newValue} />
      )
    }
    if (!this.props.value && this.props.name !== 'time') {
      return (
        <span style={{opacity: '0', fontSize: '1px'}}>a</span>
      )
    }
    if (this.props.name === 'time') {
      if (this.props.allDay) {
        return (
          <p style={{...this.props.timeStyle, ...{color: '#438496'}}}>
            <span onClick={() => this.handleClick()} className='activityInfo' style={{padding: '3px 0', display: 'inline-block'}}>
              Unassigned Time
            </span>
          </p>
        )
      }
      return (
        <p style={this.props.timeStyle} onClick={() => this.handleClick()}>
          <span className='activityInfo' style={{paddingTop: '3px', display: 'inline-block'}}>
            <span title={this.state.startTime} style={{display: 'inline-block', height: '18px', maxWidth: '220px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{this.state.startTime}</span>
            <span style={this.props.typeStyle}> - </span>
            <span title={this.state.endTime} style={{display: 'inline-block', height: '18px', maxWidth: '220px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{this.state.endTime}</span>
          </span>
          {this.props.errorIcon}{this.props.errorBox}
        </p>
      )
    }
    return (
      <span className={'activityInfo ' + this.props.type} onClick={() => this.handleClick()} title={this.state.value} style={{display: 'inline-block', height: '18px', padding: '1px', maxWidth: '220px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{this.state.value}</span>
    )
  }

  handleClick () {
    if (this.props.type === 'Flight') return
    this.setState({
      editing: true
    })

    // this.toggleDraggable()
  }

  handleKeyDown (e) {
    if (e.keyCode === 13) {
      this.handleEdit()
    }
  }

  handleClickOutside (event) {
    if (event.target.localName === 'input') return
    this.setState({
      editing: false,
      newValue: this.state.value,
      newStartTime: this.state.startTime,
      newEndTime: this.state.endTime,
      googlePlaceData: this.props.googlePlaceData
    })
  }

  handleEdit () {
    const isTime = this.props.name === 'startTime' || this.props.name === 'endTime' || this.props.name === 'time'

    this.setState({
      editing: false
    })

    if (this.state.newValue === this.props.value && this.state.newStartTime === this.props.startTime && this.state.newEndTime === this.props.endTime && (this.props.googlePlaceData && this.state.googlePlaceData.placeId === this.props.googlePlaceData.placeId)) {
      return
    }

    this.setState({
      value: this.props.googlePlaceData ? this.state.googlePlaceData.name : this.state.newValue,
      endTime: this.state.newEndTime,
      startTime: this.state.newStartTime
    }, () => {
      let unix, startUnix, endUnix, endLessThanStart
      if (isTime) {
        if (this.props.name !== 'time') {
          var hours = this.state.newValue.split(':')[0]
          var mins = this.state.newValue.split(':')[1]
          unix = (hours * 60 * 60) + (mins * 60)
        } else {
          var startHours = this.state.newStartTime.split(':')[0]
          var startMins = this.state.newStartTime.split(':')[1]
          startUnix = (startHours * 60 * 60) + (startMins * 60)
          var endHours = this.state.newEndTime.split(':')[0]
          var endMins = this.state.newEndTime.split(':')[1]
          endUnix = (endHours * 60 * 60) + (endMins * 60)
          if (endUnix < startUnix) endLessThanStart = true
        }
      }

      const update = {
        Activity: this.props.updateActivity,
        Flight: this.props.updateFlightBooking,
        Lodging: this.props.updateLodging,
        Food: this.props.updateFood,
        LandTransport: this.props.updateLandTransport
      }
      if (this.props.name !== 'time') {
        let helperOutput
        if (this.props.name === 'startTime' || this.props.name === 'endTime') {
          helperOutput = updateEventLoadSeqAssignment(this.props.events, this.props.type, this.props.activityId, {...{
            startDay: this.props.event.startDay,
            endDay: this.props.event.endDay,
            startTime: this.props.name === 'startTime' ? unix : this.props.event.startTime,
            endTime: this.props.name === 'endTime' ? unix : this.props.event.endTime
          },
            ...this.props.newDay && this.props.name === 'startTime' && {
              startDay: this.props.newDay
            },
            ...this.props.newDay && this.props.name === 'endTime' && {
              endDay: this.props.newDay
            },
            ...this.props.type === 'LandTransport' && {
              departureUtcOffset: this.props.event.departureLocation.utcOffset,
              arrivalUtcOffset: this.props.event.arrivalLocation.utcOffset
            },
            ...this.props.type === 'Lodging' && {
              utcOffset: this.props.event.location.utcOffset
            }
          })

          this.props.changingLoadSequence({
            variables: {
              input: helperOutput.loadSequenceInput
            }
          })
        }
        update[this.props.type]({
          variables: {
            ...{
              id: this.props.activityId,
              [this.props.name]: isTime ? unix : (this.props.googlePlaceData ? this.state.googlePlaceData : this.state.newValue)
            },
            ...this.props.name === 'startTime' && {
              startLoadSequence: helperOutput.updateEvent.startLoadSequence
            },
            ...this.props.name === 'endTime' && {
              endLoadSequence: helperOutput.updateEvent.endLoadSequence
            },
            ...this.props.newDay && this.props.name === 'startTime' && {
              startDay: this.props.newDay
            },
            ...this.props.newDay && this.props.name === 'endTime' && {
              endDay: this.props.newDay
            }
          },
          refetchQueries: [{
            query: queryItinerary,
            variables: { id: this.props.itineraryId }
          }]
        })
      } else {
        let timeObj = {allDayEvent: false}
        if (!this.state.newStartTime && !this.state.newEndTime) timeObj = checkStartAndEndTime(this.props.events, {}, 'allDayEvent')
        else if (!this.state.newStartTime) timeObj = checkStartAndEndTime(this.props.events, {endTime: endUnix}, 'startTimeMissing')
        else if (!this.state.newEndTime) timeObj = checkStartAndEndTime(this.props.events, {startTime: startUnix}, 'endTimeMissing')

        const helperOutput = updateEventLoadSeqAssignment(this.props.events, this.props.type, this.props.activityId, {
          startDay: this.props.newDay || this.props.event.startDay,
          endDay: this.props.newDay + this.props.event.endDay - this.props.event.startDay || this.props.event.endDay,
          startTime: this.state.newStartTime ? startUnix : timeObj.startTime,
          endTime: this.state.newEndTime ? endUnix : timeObj.endTime,
          utcOffset: this.props.event.location.utcOffset
        })

        console.log('helper output', helperOutput)

        this.props.changingLoadSequence({
          variables: {
            input: helperOutput.loadSequenceInput
          }
        })

        update[this.props.type]({
          variables: {...{
            id: this.props.activityId,
            startTime: this.state.newStartTime ? startUnix : timeObj.startTime,
            endTime: this.state.newEndTime ? endUnix : timeObj.endTime,
            allDayEvent: timeObj.allDayEvent,
            loadSequence: helperOutput.updateEvent.loadSequence
          },
            ...this.props.newDay && {
              startDay: this.props.newDay,
              endDay: this.props.newDay + this.props.event.endDay - this.props.event.startDay
            },
            ...!this.props.newDay && endLessThanStart && this.props.event.endDay === this.props.event.startDay && {
              endDay: this.props.event.startDay + 1
            },
            ...!this.props.newDay && !endLessThanStart && this.props.event.endDay !== this.props.event.startDay && {
              endDay: this.props.event.startDay
            }
          },
          refetchQueries: [{
            query: queryItinerary,
            variables: { id: this.props.itineraryId }
          }]
        })
      }
    })
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.plannerActivities
  }
}

export default connect(mapStateToProps)(compose(
  graphql(updateActivity, { name: 'updateActivity' }),
  graphql(updateFlightBooking, { name: 'updateFlightBooking' }),
  graphql(updateLandTransport, { name: 'updateLandTransport' }),
  graphql(updateLodging, { name: 'updateLodging' }),
  graphql(updateFood, { name: 'updateFood' }),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'})
)(onClickOutside(ActivityInfo)))
