import React, { Component } from 'react'
import EditActivityForm from './EditActivityForm'
import EditFoodForm from './EditFoodForm'
import EditLodgingForm from './EditLodgingForm'
import EditLandTransportForm from './EditLandTransportForm'
import EditFlightForm from './EditFlightForm'
import Radium, { Style } from 'radium'

class EditEventFormHOC extends Component {
  constructor (props) {
    super(props)
    this.components = {
      Activity: EditActivityForm,
      Food: EditFoodForm,
      Lodging: EditLodgingForm,
      LandTransport: EditLandTransportForm,
      Flight: EditFlightForm
    }
  }
  render () {
    const EditEventForm = this.components[this.props.eventType]
    return (
      <div>
        <Style rules={{
          html: {
            overflowY: 'hidden'
          }
        }} />
        <EditEventForm ItineraryId={this.props.ItineraryId} day={this.props.day} date={this.props.date} dates={this.props.dates} daysArr={this.props.daysArr} event={this.props.event} events={this.props.events} toggleEditEventType={() => this.props.toggleEditEventType()} />
      </div>
    )
  }
}

export default Radium(EditEventFormHOC)
