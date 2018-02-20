import React, { Component } from 'react'
import Radium from 'radium'
import LocationSearch from './LocationSearch'
import LocationMapHOC from './LocationMapHOC'
import LocationDetails from './LocationDetails'
import { locationMapContainerStyle } from '../../Styles/styles'

class SingleLocationSelection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mapIsOpen: false
    }
  }

  selectLocation (place) {
    this.setState({mapIsOpen: false})
    this.props.selectLocation(place)
  }

  toggleMap () {
    this.setState({mapIsOpen: !this.state.mapIsOpen})
  }

  render () {
    return (
      <div style={{position: 'relative'}}>
        <LocationSearch selectLocation={place => this.selectLocation(place)} toggleMap={() => this.toggleMap()} currentLocation={this.props.currentLocation} />

        <LocationDetails locationDetails={this.props.locationDetails} />

        {this.state.mapIsOpen &&
        <div style={locationMapContainerStyle}>
          <LocationMapHOC selectLocation={(place) => this.selectLocation(place)} toggleMap={() => this.toggleMap()} currentLocation={this.props.currentLocation} />
        </div>
        }
      </div>
    )
  }
}

export default Radium(SingleLocationSelection)
