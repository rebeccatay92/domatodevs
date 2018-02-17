import React, { Component } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline, InfoWindow } from 'react-google-maps'
// import InfoBox from 'react-google-maps/lib/components/addons/InfoBox'

class Map extends Component {
  constructor (props) {
    super(props)
    this.state = {
      zoom: 2,
      bounds: null,
      center: {lat: 0, lng: 0},
      departureInfo: true,
      arrivalInfo: true
    }
  }

  onBoundsChanged () {
    if (!this.map) return
    this.setState({
      bounds: this.map.getBounds(),
      center: {lat: this.map.getCenter().lat(), lng: this.map.getCenter().lng()}
    })
  }

  toggleDepartureInfo () {
    this.setState({departureInfo: !this.state.departureInfo})
  }

  toggleArrivalInfo () {
    this.setState({arrivalInfo: !this.state.arrivalInfo})
  }

  handleMarkerChange () {
    var departure = this.props.departureLocation
    var arrival = this.props.arrivalLocation

    // CENTERS MAP IF ONLY 1 MARKER
    if (departure && !arrival) {
      this.setState({center: {lat: departure.latitude, lng: departure.longitude}})
    }
    if (!departure && arrival) {
      this.setState({center: {lat: arrival.latitude, lng: arrival.longitude}})
    }

    // CHANGE BOUNDS IF 2 MARKERS
    if (departure && arrival) {
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend({lat: departure.latitude, lng: departure.longitude})
      bounds.extend({lat: arrival.latitude, lng: arrival.longitude})
      this.map.fitBounds(bounds, 100)
    }
  }

  componentDidUpdate (prevProps) {
    // console.log('this', this)
    if ((this.props.departureLocation !== prevProps.departureLocation) || (this.props.arrivalLocation !== prevProps.arrivalLocation)) {
      this.handleMarkerChange()
    }
  }

  render () {
    return (
      <GoogleMap ref={node => { this.map = node }} defaultZoom={2} center={this.state.center} options={{fullscreenControl: false, mapTypeControl: false, streetViewControl: false, gestureHandling: 'none'}} onBoundsChanged={() => this.onBoundsChanged()} >
        {this.props.departureLocation &&
          <Marker position={{lat: this.props.departureLocation.latitude, lng: this.props.departureLocation.longitude}} onClick={() => this.toggleDepartureInfo()}>
            {this.state.departureInfo &&
              <InfoWindow onCloseClick={() => this.toggleDepartureInfo()}>
                <div>
                  <h5>{this.props.departureLocation.name}</h5>
                </div>
              </InfoWindow>
            }
          </Marker>
        }
        {this.props.arrivalLocation &&
          <Marker position={{lat: this.props.arrivalLocation.latitude, lng: this.props.arrivalLocation.longitude}} onClick={() => this.toggleArrivalInfo()}>
            {this.state.arrivalInfo &&
              <InfoWindow onCloseClick={() => this.toggleArrivalInfo()}>
                <div>
                  <h5>{this.props.arrivalLocation.name}</h5>
                </div>
              </InfoWindow>
            }
          </Marker>
        }
        {(this.props.departureLocation && this.props.arrivalLocation) &&
        <Polyline path={[{lat: this.props.departureLocation.latitude, lng: this.props.departureLocation.longitude}, {lat: this.props.arrivalLocation.latitude, lng: this.props.arrivalLocation.longitude}]} options={{geodesic: false, icons: [{icon: {path: 'M22.1,15.1c0,0-1.4-1.3-3-3l0-1.9c0-0.2-0.2-0.4-0.4-0.4l-0.5,0c-0.2,0-0.4,0.2-0.4,0.4l0,0.7c-0.5-0.5-1.1-1.1-1.6-1.6l0-1.5c0-0.2-0.2-0.4-0.4-0.4l-0.4,0c-0.2,0-0.4,0.2-0.4,0.4l0,0.3c-1-0.9-1.8-1.7-2-1.9c-0.3-0.2-0.5-0.3-0.6-0.4l-0.3-3.8c0-0.2-0.3-0.9-1.1-0.9c-0.8,0-1.1,0.8-1.1,0.9L9.7,6.1C9.5,6.2,9.4,6.3,9.2,6.4c-0.3,0.2-1,0.9-2,1.9l0-0.3c0-0.2-0.2-0.4-0.4-0.4l-0.4,0C6.2,7.5,6,7.7,6,7.9l0,1.5c-0.5,0.5-1.1,1-1.6,1.6l0-0.7c0-0.2-0.2-0.4-0.4-0.4l-0.5,0c-0.2,0-0.4,0.2-0.4,0.4l0,1.9c-1.7,1.6-3,3-3,3c0,0.1,0,1.2,0,1.2s0.2,0.4,0.5,0.4s4.6-4.4,7.8-4.7c0.7,0,1.1-0.1,1.4,0l0.3,5.8l-2.5,2.2c0,0-0.2,1.1,0,1.1c0.2,0.1,0.6,0,0.7-0.2c0.1-0.2,0.6-0.2,1.4-0.4c0.2,0,0.4-0.1,0.5-0.2c0.1,0.2,0.2,0.4,0.7,0.4c0.5,0,0.6-0.2,0.7-0.4c0.1,0.1,0.3,0.1,0.5,0.2c0.8,0.2,1.3,0.2,1.4,0.4c0.1,0.2,0.6,0.3,0.7,0.2c0.2-0.1,0-1.1,0-1.1l-2.5-2.2l0.3-5.7c0.3-0.3,0.7-0.1,1.6-0.1c3.3,0.3,7.6,4.7,7.8,4.7c0.3,0,0.5-0.4,0.5-0.4S22,15.3,22.1,15.1z', fillColor: 'white', fillOpacity: 1, anchor: new window.google.maps.Point(11, 11), scale: 2, strokeWeight: 2}, offset: '50%'}]}} />
        }
      </GoogleMap>
    )
  }
}

const FlightMap = withScriptjs(withGoogleMap(Map))

class FlightMapHOC extends Component {
  render () {
    return (
      <FlightMap googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&v=3.31&libraries=geometry,drawing,places`} loadingElement={<div style={{ height: `100%` }} />} containerElement={<div style={{ height: `100%` }} />} mapElement={<div style={{ height: `100%` }} />} departureLocation={this.props.departureLocation} arrivalLocation={this.props.arrivalLocation} />
    )
  }
}

export default FlightMapHOC
