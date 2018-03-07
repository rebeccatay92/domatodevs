import React, { Component } from 'react'
import CreateActivityForm from './CreateActivityForm'
import CreateFoodForm from './CreateFoodForm'
import CreateFlightForm from './CreateFlightForm'
import CreateLodgingForm from './CreateLodgingForm'
import CreateLandTransportForm from './CreateLandTransportForm'
import Radium, { Style } from 'radium'

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
    console.log('this.props.dates arr', this.props.dates)
    console.log('this.props.date', this.props.date)

    const CreateEventForm = this.components[this.props.eventType]
    return (
      <div>
        <Style rules={{
          html: {
            overflowY: 'hidden'
          }
        }} />
        {/* DATES ARR HERE IS JS DATE OBJECT. PROP.DATE IS MILLISECS */}
        <CreateEventForm ItineraryId={this.props.ItineraryId} day={this.props.day} date={this.props.date} dates={this.props.dates} daysArr={this.props.daysArr} eventType={this.props.eventType} toggleCreateEventType={() => this.props.toggleCreateEventType()} />
      </div>
    )
  }
}

export default Radium(CreateEventFormHOC)
