import React, { Component } from 'react'
import CreateActivityForm from './CreateActivityForm'
import CreateFoodForm from './CreateFoodForm'
import CreateFlightForm from './CreateFlightForm'
import CreateLodgingForm from './CreateLodgingForm'
import CreateLandTransportForm from './CreateLandTransportForm'

class CreateEventFormHOC extends Component {
  constructor (props) {
    super(props)
    this.components = {
      Activity: CreateActivityForm,
      Food: CreateFoodForm,
      Lodging: CreateLodgingForm,
      LandTransport: CreateLandTransportForm,
      Flight: CreateFlightForm
    }
  }
  render () {
    const CreateEventForm = this.components[this.props.eventType]
    return (
      <CreateEventForm ItineraryId={this.props.ItineraryId} day={this.props.day} date={this.props.date} dates={this.props.dates} daysArr={this.props.daysArr} toggleCreateEventType={() => this.props.toggleCreateEventType()} />
    )
  }
}

export default CreateEventFormHOC
