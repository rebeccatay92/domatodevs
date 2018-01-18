import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'
import { columnValueContainerStyle, expandEventIconStyle } from '../Styles/styles'

import { updateActivity } from '../apollo/activity'
import { updateFlightBooking } from '../apollo/flight'
import { updateLodging } from '../apollo/lodging'
import { updateLandTransport } from '../apollo/landtransport'
import { updateFood } from '../apollo/food'

import { queryItinerary } from '../apollo/itinerary'

const columnValues = {
  'Price': 'cost',
  'Booking Status': 'bookingStatus',
  'Booking Platform': 'bookedThrough',
  'Notes': 'notes'
}

const flightBookingOrInstance = {
  Price: 'FlightBooking',
  'Booking Status': 'FlightBooking',
  'Booking Platform': 'FlightBooking',
  Notes: 'FlightInstance'
}

class PlannerColumnValue extends Component {
  constructor (props) {
    super(props)

    let value

    if (!props.expandedEvent) value = props.activity[props.activity.type][columnValues[props.column]]

    if (!props.expandedEvent && props.activity.type === 'Flight') value = props.activity[props.activity.type][flightBookingOrInstance[props.column]][columnValues[props.column]]

    this.state = {
      editing: false,
      value: value,
      newValue: value
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.expandedEvent) return
    let value
    value = nextProps.activity[nextProps.activity.type][columnValues[nextProps.column]]
    if (nextProps.activity.type === 'Flight') value = nextProps.activity[nextProps.activity.type][flightBookingOrInstance[nextProps.column]][columnValues[nextProps.column]]

    if (this.state.value !== value) {
      this.setState({
        value: value,
        newValue: value
      })
    }
  }

  handleClickOutside (event) {
    this.setState({
      newValue: this.state.value,
      editing: false
    })
  }

  handleKeyDown (e) {
    if (e.keyCode === 13) {
      this.handleEdit()
    }
  }

  handleEdit () {
    this.setState({
      editing: false
    })

    if (this.state.value === this.state.newValue) return

    this.setState({
      value: this.state.newValue
    })

    const update = {
      Activity: this.props.updateActivity,
      Flight: this.props.updateFlightBooking,
      Lodging: this.props.updateLodging,
      Food: this.props.updateFood,
      LandTransport: this.props.updateLandTransport
    }

    update[this.props.activity.type]({
      variables: {
        id: this.props.activity.modelId,
        [columnValues[this.props.column]]: this.state.newValue
      },
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.itineraryId }
      }]
    })
  }

  handleClick (e, clickOutsideInput) {
    if (clickOutsideInput && this.state.editing) {
      if (e.target.localName !== 'input' && e.target.localName !== 'textarea') {
        this.setState({
          editing: false
        })
      }
      return
    } else if (clickOutsideInput) return
    if (this.props.column === 'Booking Status') return
    this.setState({
      editing: true
    })
  }

  render () {
    if (this.props.expandedEvent) {
      return (
        <td style={{position: 'relative'}}>
          {this.props.isLast && this.props.expandedEvent && (
            <i key='eventOptions' className='material-icons' style={expandEventIconStyle} onClick={() => this.props.expandEvent()}>expand_less</i>
          )}
        </td>
      )
    }
    const obj = this.renderInfo()
    const value = obj.value
    const display = obj.display
    return (
      <td onClick={(e) => this.handleClick(e, 'clickOutsideInput')} colSpan={this.props.column === 'Notes' ? 4 : 1} style={columnValueContainerStyle(this.props.column)}>
        {!this.state.editing && display && <span className={'activityInfo ' + columnValues[this.props.column]} onClick={() => this.handleClick()} style={{padding: '1px', width: this.props.column === 'Notes' ? '95%' : '75%', minHeight: this.props.column === 'Notes' ? '51px' : '28px', display: 'inline-block', wordWrap: 'break-word'}}>
          {value}
        </span>}
        {this.state.editing && this.props.column !== 'Notes' && <input autoFocus type='text' style={{width: '70%'}} value={this.state.newValue} onChange={(e) => this.setState({newValue: e.target.value})} onKeyDown={(e) => this.handleKeyDown(e)} />}
        {this.state.editing && this.props.column === 'Notes' && <textarea autoFocus style={{width: '90%', resize: 'none'}} value={this.state.newValue} onChange={(e) => this.setState({newValue: e.target.value})} onKeyDown={(e) => this.handleKeyDown(e)} />}
        {this.props.isLast && this.props.hover && !this.props.expandedEvent && !this.props.activity.dropzone && <i key='eventOptions' className='material-icons' style={expandEventIconStyle} onClick={() => this.props.expandEvent()}>expand_more</i>}
      </td>
    )
  }

  renderInfo () {
    const start = !this.props.activity.dropzone && (this.props.activity.start || typeof this.props.activity.start !== 'boolean')
    let value = this.state.value
    switch (this.props.column) {
      case 'Notes':
        if (start) return {value: value || '', display: true}
        else {
          return {value: '', display: false}
        }
      case 'Price':
        if (this.props.activity.type === 'Flight' && this.props.firstInFlightBooking && start) {
          return {value: value || '', display: true}
        } else if (this.props.activity.type === 'Flight') {
          return {value: '', display: false}
        } else {
          if (start) return {value: value || '', display: true}
          else {
            return {value: '', display: false}
          }
        }
      case 'Booking Status':
        if (start) return {value: value === false ? 'Not Booked' : 'Booked', display: true}
        else {
          return {value: '', display: false}
        }
      case 'Booking Platform':
        if (start) return {value: value, display: true}
        else {
          return {value: '', display: false}
        }
      default:
        return value
    }
  }
}

export default compose(
  graphql(updateActivity, { name: 'updateActivity' }),
  graphql(updateFlightBooking, { name: 'updateFlightBooking' }),
  graphql(updateLandTransport, { name: 'updateLandTransport' }),
  graphql(updateLodging, { name: 'updateLodging' }),
  graphql(updateFood, { name: 'updateFood' })
)(onClickOutside(Radium(PlannerColumnValue)))
