import React, { Component } from 'react'

class MapCreateEventHOC extends Component {
  constructor (props) {
    super(props)
    this.components = {
    }
  }

  // receive currentlyClicked.place, eventType as props. render input fields depending on eventType

  render () {
    return (
      <div>
        <div>Location name: </div>
        <div>Opening hours dropdown</div>
        <div>description / arrival location</div>
        <div>start date, start day</div>
        <div>start time</div>
        <div>end date, end day</div>
        <div>end time</div>
      </div>
    )
  }
}

export default MapCreateEventHOC
