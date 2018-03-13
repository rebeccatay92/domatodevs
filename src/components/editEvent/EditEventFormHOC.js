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
      <div style={{backgroundColor: 'transparent', position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, zIndex: 999, overflow: 'auto', maxHeight: '100vh', maxWidth: '100vw'}}>
        <Style rules={{
          html: {
            overflowY: 'hidden'
          }
        }} />
        {/* REMOVE PROPS EVENTS, DATE */}
        <EditEventForm ItineraryId={this.props.ItineraryId} day={this.props.day} date={this.props.date} dates={this.props.dates} daysArr={this.props.daysArr} event={this.props.event} toggleEditEventType={() => this.props.toggleEditEventType()} mapEditEventFormSuccess={() => this.props.mapEditEventFormSuccess()} mapEditEventFormCancel={() => this.props.mapEditEventFormCancel()} />
      </div>
    )
  }
}

export default Radium(EditEventFormHOC)
