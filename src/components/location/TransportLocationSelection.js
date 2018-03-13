import React, { Component } from 'react'
import LocationSearch from './LocationSearch'
import TransportMapHOC from './TransportMapHOC'
import LocationDetails from './LocationDetails'

import { locationMapContainerStyle, eventDescContainerStyle } from '../../Styles/styles'

// ENTIRE LOCATION COMPONENT (DEPARTURE + ARRIVAL + ADDRESS + SHARED MAP)

class TransportLocationSelection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mapIsOpen: false,
      mapLocationType: null
    }
  }

  selectLocation (place, type) {
    this.props.selectLocation(place, type)

    this.setState({mapIsOpen: false})
    this.setState({mapLocationType: null})
  }

  toggleMap (type) {
    this.setState({mapIsOpen: !this.state.mapIsOpen})
    if (type) {
      this.setState({mapLocationType: type})
    } else {
      this.setState({mapLocationType: null})
    }
  }

  render () {
    return (
      <div style={{position: 'relative'}}>
        <div style={{...eventDescContainerStyle, ...{position: 'relative'}}}>
          <LocationSearch placeholder={'Search for a departure location'} eventType={this.props.eventType} selectLocation={place => this.selectLocation(place, 'departure')} toggleMap={() => this.toggleMap('departure')} currentLocation={this.props.departureLocation} />
          {/* DEPARTURE PLACEHOLDER OVERFLOW NOT SEEN */}
          {this.props.departureLocation.placeId && <LocationDetails locationDetails={this.props.departureLocationDetails} />}
        </div>

        <div style={{...eventDescContainerStyle, ...{position: 'relative'}}}>
          <LocationSearch placeholder={'Search for an arrival location'} eventType={this.props.eventType + 'End'} selectLocation={place => this.selectLocation(place, 'arrival')} toggleMap={() => this.toggleMap('arrival')} currentLocation={this.props.arrivalLocation} />
          {this.props.arrivalLocation.placeId && <LocationDetails locationDetails={this.props.arrivalLocationDetails} />}
        </div>

        {this.state.mapIsOpen &&
        <div style={locationMapContainerStyle}>
          <TransportMapHOC toggleMap={() => this.toggleMap()} selectLocation={(place) => this.selectLocation(place, this.state.mapLocationType)} departureLocation={this.props.departureLocation} arrivalLocation={this.props.arrivalLocation} mapLocationType={this.state.mapLocationType} />
        </div>
        }
      </div>
    )
  }
}

export default TransportLocationSelection
