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
    var event = this.props.event

    // if eventType is Flight, and comes from planner. extract flight instance row out of entire Flight obj and pass as event to editFlightForm
    // if coming from map. event is alrdy flight instance row. no need to manipulate
    if (this.props.eventType === 'Flight' && !this.props.openedFromMap) {
      event = this.props.event.FlightInstance
    }

    return (
      <div style={{backgroundColor: 'transparent', position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, zIndex: 999, overflow: 'auto', maxHeight: '100vh', maxWidth: '100vw'}}>
        <Style rules={{
          html: {
            overflowY: 'hidden'
          }
        }} />
        {/* REMOVE PROPS EVENTS, DATE, DAY */}
        <EditEventForm openedFromMap={this.props.openedFromMap} ItineraryId={this.props.ItineraryId} dates={this.props.dates} daysArr={this.props.daysArr} event={event} toggleEditEventType={() => this.props.toggleEditEventType()} mapEditEventFormSuccess={(eventObj) => this.props.mapEditEventFormSuccess(eventObj)} mapEditEventFormCancel={() => this.props.mapEditEventFormCancel()} defaultStartDay={this.props.defaultStartDay} defaultEndDay={this.props.defaultEndDay} defaultStartTime={this.props.defaultStartTime} defaultEndTime={this.props.defaultEndTime} defaultDescription={this.props.defaultDescription} defaultGooglePlaceData={this.props.defaultDescription} defaultDepartureGooglePlaceData={this.props.defaultDepartureGooglePlaceData} defaultArrivalGooglePlaceData={this.props.defaultArrivalGooglePlaceData} />
      </div>
    )
  }
}

export default Radium(EditEventFormHOC)
