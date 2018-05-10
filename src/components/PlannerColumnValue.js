import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'
import { columnValueContainerStyle, expandEventIconStyle } from '../Styles/styles'

// import { updateActivity } from '../apollo/activity'
// import { updateFlightBooking, updateFlightInstance } from '../apollo/flight'
// import { updateLodging } from '../apollo/lodging'
// import { updateLandTransport } from '../apollo/landtransport'
// import { updateFood } from '../apollo/food'

import { queryItinerary } from '../apollo/itinerary'

const columnValues = {
  'Price': 'cost',
  'Booking Status': 'bookingStatus',
  'Booking Platform': 'bookedThrough',
  'Booking Number': 'bookingConfirmation',
  'Notes': {
    single: 'notes',
    departure: 'departureNotes',
    arrival: 'arrivalNotes'
  }
}

// const flightBookingOrInstance = {
//   Price: 'FlightBooking',
//   'Booking Status': 'FlightBooking',
//   'Booking Platform': 'FlightBooking',
//   'Booking Number': 'FlightBooking',
//   Notes: 'FlightInstance'
// }

class PlannerColumnValue extends Component {
  constructor (props) {
    super(props)

    let value, currency

    currency = props.activity.currency

    if (!props.expandedEvent && props.column !== 'Notes') value = props.activity[columnValues[props.column]]
    if (!props.expandedEvent && props.column === 'Notes') {
      // if (props.activity.type === 'Flight') {
      //   if (props.activity.start) {
      //     value = props.activity[props.activity.type][flightBookingOrInstance[props.column]][columnValues[props.column].departure]
      //   } else {
      //     value = props.activity[props.activity.type][flightBookingOrInstance[props.column]][columnValues[props.column].arrival]
      //   }
      // } else if (props.activity.type === 'LandTransport') {
      //   if (props.activity.start) {
      //     value = props.activity[props.activity.type][columnValues[props.column].departure]
      //   } else {
      //     value = props.activity[props.activity.type][columnValues[props.column].arrival]
      //   }
      // } else {
      value = props.activity[columnValues[props.column].single]
      // }
    }

    this.state = {
      editing: false,
      value: value,
      newValue: value,
      currency: currency
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.expandedEvent) return
    let value
    value = nextProps.activity[columnValues[nextProps.column]]
    // if (!nextProps.expandedEvent && nextProps.column === 'Notes') {
    //   if (nextProps.activity.type === 'Flight') {
    //     if (nextProps.activity.start) {
    //       value = nextProps.activity[nextProps.activity.type][flightBookingOrInstance[nextProps.column]][columnValues[nextProps.column].departure]
    //     } else {
    //       value = nextProps.activity[nextProps.activity.type][flightBookingOrInstance[nextProps.column]][columnValues[nextProps.column].arrival]
    //     }
    //   } else
    //   if (nextProps.activity.type === 'LandTransport') {
    //     if (nextProps.activity.start) {
    //       value = nextProps.activity[nextProps.activity.type][columnValues[nextProps.column].departure]
    //     } else {
    //       value = nextProps.activity[nextProps.activity.type][columnValues[nextProps.column].arrival]
    //     }
    //   } else {
    //     value = nextProps.activity[nextProps.activity.type][columnValues[nextProps.column].single]
    //   }
    // }
    // if (nextProps.activity.type === 'Flight' && nextProps.column !== 'Notes') value = nextProps.activity[nextProps.activity.type][flightBookingOrInstance[nextProps.column]][columnValues[nextProps.column]]

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

  // handleEdit () {
  //   this.setState({
  //     editing: false
  //   })
  //
  //   if (this.state.value === this.state.newValue) return
  //
  //   this.setState({
  //     value: this.state.newValue
  //   })

    // let noteType
    // if (this.props.activity.type === 'Flight' || this.props.activity.type === 'LandTransport') {
    //   if (this.props.activity.start) {
    //     noteType = 'departure'
    //   } else {
    //     noteType = 'arrival'
    //   }
    // } else {
    // noteType = 'single'
    // }

    // const update = {
    //   Activity: this.props.updateActivity,
    //   Flight: flightBookingOrInstance[this.props.column] === 'FlightBooking' ? this.props.updateFlightBooking : this.props.updateFlightInstance,
    //   Lodging: this.props.updateLodging,
    //   Food: this.props.updateFood,
    //   LandTransport: this.props.updateLandTransport
    // }

  //   update[this.props.activity.type]({
  //     variables: {
  //       ...{
  //         id: flightBookingOrInstance[this.props.column] === 'FlightInstance' && this.props.activity.Flight ? this.props.activity.Flight.FlightInstance.id : this.props.activity.modelId,
  //         flightInstances: []
  //       },
  //       ...this.props.column === 'Booking Number' && {
  //         bookingStatus: this.state.newValue
  //       },
  //       ...this.props.column === 'Notes' && {
  //         [columnValues[this.props.column][noteType]]: this.state.newValue
  //       },
  //       ...this.props.column !== 'Notes' && {
  //         [columnValues[this.props.column]]: this.state.newValue
  //       }
  //     },
  //     refetchQueries: [{
  //       query: queryItinerary,
  //       variables: { id: this.props.itineraryId }
  //     }]
  //   })
  // }

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
            <i key='eventOptions' title='Hide' className='material-icons' style={expandEventIconStyle} onClick={() => this.props.expandEvent()}>arrow_drop_up</i>
          )}
        </td>
      )
    }
    const obj = this.renderInfo()
    const value = obj.value
    const display = obj.display
    return (
      <td onClick={(e) => this.handleClick(e, 'clickOutsideInput')} colSpan={this.props.column === 'Notes' ? 4 : 1} style={columnValueContainerStyle(this.props.column)}>
        {!this.state.editing && display && <span className={'activityInfo ' + columnValues[this.props.column]} onClick={() => this.handleClick()} style={{width: this.props.column === 'Notes' ? '595px' : '75%', height: 'min-content', minHeight: this.props.column === 'Notes' ? '51px' : '22px', maxHeight: '64px', overflow: 'hidden', display: 'inline-block', wordWrap: 'break-word', margin: '0px'}}>
          {value}
        </span>}
        {this.state.editing && this.props.column !== 'Notes' && <input autoFocus type='text' style={{textAlign: 'center', width: '70%', padding: '8px', fontSize: '13px', height: '31px'}} value={this.state.newValue} onChange={(e) => this.setState({newValue: e.target.value})} onKeyDown={(e) => this.handleKeyDown(e)} />}
        {this.state.editing && this.props.column === 'Notes' && <textarea autoFocus style={{width: '595px', resize: 'none', height: '64px'}} value={this.state.newValue} onChange={(e) => this.setState({newValue: e.target.value})} onKeyDown={(e) => this.handleKeyDown(e)} />}
        {this.props.isLast && this.props.hover && !this.props.expandedEvent && !this.props.activity.dropzone && <i key='eventOptions' title='Expand' className='material-icons' style={expandEventIconStyle} onClick={() => this.props.expandEvent()}>arrow_drop_down</i>}
      </td>
    )
  }

  renderInfo () {
    // const start = !this.props.activity.dropzone && (this.props.activity.start || typeof this.props.activity.start !== 'boolean')
    let value = this.state.value
    switch (this.props.column) {
      case 'Notes':
        return {value: value || '', display: true}
      case 'Price':
        // if (this.props.activity.type === 'Flight' && this.props.firstInFlightBooking) {
        //   return {value: this.state.currency + ' ' + value || '', display: true}
        // } else if (this.props.activity.type === 'Flight') {
        //   return {value: '', display: false}
        // } else {
          // if (start)
        return {value: this.state.currency + ' ' + value || '', display: true}
          // else {
          //   return {value: '', display: false}
          // }
        // }
      case 'Booking Status':
        // if (start)
        return {value: value === false ? 'Not Booked' : 'Booked', display: true}
        // else {
        //   return {value: '', display: false}
        // }
      case 'Booking Platform':
        // if (start)
        return {value: value, display: true}
        // else {
        //   return {value: '', display: false}
        // }
      case 'Booking Number':
        // if (start)
        return {value: value, display: true}
        // else {
        //   return {value: '', display: false}
        // }
      default:
        return {value: value, display: true}
    }
  }
}

export default compose(
  // graphql(updateActivity, { name: 'updateActivity' }),
  // graphql(updateFlightBooking, { name: 'updateFlightBooking' }),
  // graphql(updateFlightInstance, { name: 'updateFlightInstance' }),
  // graphql(updateLandTransport, { name: 'updateLandTransport' }),
  // graphql(updateLodging, { name: 'updateLodging' }),
  // graphql(updateFood, { name: 'updateFood' })
)(onClickOutside(Radium(PlannerColumnValue)))
