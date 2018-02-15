import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { compose, withProps, lifecycle } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline, InfoWindow } from 'react-google-maps'
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox'

const FlightMap = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&v=3.31&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: '755px' }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  lifecycle({
    componentWillMount () {
      const refs = {}
      this.setState({
        bounds: null,
        center: {
          lat: 0, lng: 0
        },
        departureWindow: true,
        arrivalWindow: true,
        onMapMounted: ref => {
          refs.map = ref
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter()
          })
        },
        onMarkerMounted: ref => {
          refs.marker = ref
          console.log('marker mounted')
        },
        handleMarkerChange: () => {
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
            refs.map.fitBounds(bounds, 100)
          }
        },
        onDepartureWindowMounted: ref => {
          refs.departureWindow = ref
          console.log('departure window mounted')
        },
        onArrivalWindowMounted: ref => {
          refs.arrivalWindow = ref
        },
        toggleDepartureWindow: () => {
          this.setState({departureWindow: !this.state.departureWindow})
        },
        toggleArrivalWindow: () => {
          this.setState({arrivalWindow: !this.state.arrivalWindow})
        }
      })
    },
    componentDidUpdate (prevProps) {
      // console.log('this', this)
      if ((this.props.departureLocation !== prevProps.departureLocation) || (this.props.arrivalLocation !== prevProps.arrivalLocation)) {
        this.state.handleMarkerChange()
      }
    }
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap ref={props.onMapMounted} defaultZoom={2} center={props.center} onBoundsChanged={props.onBoundsChanged} style={{position: 'relative'}} options={{fullscreenControl: false, mapTypeControl: false, streetViewControl: false, zoomControl: false, gestureHandling: 'none'}}>
    {/* {props.departureLocation &&
      <Marker ref={props.onMarkerMounted} position={{lat: props.departureLocation.latitude, lng: props.departureLocation.longitude}} location={props.departureLocation} clickable={false}>
        <InfoBox key={`${props.departureLocation.latitude}${props.departureLocation.longitude}`} ref={props.onDepartureWindowMounted} position={new window.google.maps.LatLng(props.departureLocation.latitude, props.departureLocation.longitude)} options={{closeBoxURL: ``, enableEventPropagation: true, pixelOffset: new window.google.maps.Size(-100, -100)}}>
          <div style={{backgroundColor: `white`, padding: `10px`, borderRadius: '2px'}}>
            <div style={{ fontSize: `14px`, fontColor: `#08233B` }}>
              {props.departureLocation.name}
            </div>
          </div>
        </InfoBox>
      </Marker>
    } */}
    {props.departureLocation &&
      <Marker ref={props.onMarkerMounted} position={{lat: props.departureLocation.latitude, lng: props.departureLocation.longitude}} location={props.departureLocation} onClick={props.toggleDepartureWindow}>
        {props.departureWindow &&
          <InfoWindow ref={props.onDepartureWindowMounted} onCloseClick={props.toggleDepartureWindow}>
            <div>
              <h5>{props.departureLocation.name}</h5>
            </div>
          </InfoWindow>
        }
      </Marker>
    }
    {props.arrivalLocation &&
      <Marker ref={props.onMarkerMounted} position={{lat: props.arrivalLocation.latitude, lng: props.arrivalLocation.longitude}} location={props.arrivalLocation} onClick={props.toggleArrivalWindow}>
        <InfoWindow ref={props.onArrivalWindowMounted} onCloseClick={props.toggleArrivalWindow}>
          <div>
            <h5>{props.arrivalLocation.name}</h5>
          </div>
        </InfoWindow>
      </Marker>
    }

    {(props.departureLocation && props.arrivalLocation) &&
      <Polyline path={[{lat: props.departureLocation.latitude, lng: props.departureLocation.longitude}, {lat: props.arrivalLocation.latitude, lng: props.arrivalLocation.longitude}]} options={{geodesic: false, icons: [{icon: {path: 'M22.1,15.1c0,0-1.4-1.3-3-3l0-1.9c0-0.2-0.2-0.4-0.4-0.4l-0.5,0c-0.2,0-0.4,0.2-0.4,0.4l0,0.7c-0.5-0.5-1.1-1.1-1.6-1.6l0-1.5c0-0.2-0.2-0.4-0.4-0.4l-0.4,0c-0.2,0-0.4,0.2-0.4,0.4l0,0.3c-1-0.9-1.8-1.7-2-1.9c-0.3-0.2-0.5-0.3-0.6-0.4l-0.3-3.8c0-0.2-0.3-0.9-1.1-0.9c-0.8,0-1.1,0.8-1.1,0.9L9.7,6.1C9.5,6.2,9.4,6.3,9.2,6.4c-0.3,0.2-1,0.9-2,1.9l0-0.3c0-0.2-0.2-0.4-0.4-0.4l-0.4,0C6.2,7.5,6,7.7,6,7.9l0,1.5c-0.5,0.5-1.1,1-1.6,1.6l0-0.7c0-0.2-0.2-0.4-0.4-0.4l-0.5,0c-0.2,0-0.4,0.2-0.4,0.4l0,1.9c-1.7,1.6-3,3-3,3c0,0.1,0,1.2,0,1.2s0.2,0.4,0.5,0.4s4.6-4.4,7.8-4.7c0.7,0,1.1-0.1,1.4,0l0.3,5.8l-2.5,2.2c0,0-0.2,1.1,0,1.1c0.2,0.1,0.6,0,0.7-0.2c0.1-0.2,0.6-0.2,1.4-0.4c0.2,0,0.4-0.1,0.5-0.2c0.1,0.2,0.2,0.4,0.7,0.4c0.5,0,0.6-0.2,0.7-0.4c0.1,0.1,0.3,0.1,0.5,0.2c0.8,0.2,1.3,0.2,1.4,0.4c0.1,0.2,0.6,0.3,0.7,0.2c0.2-0.1,0-1.1,0-1.1l-2.5-2.2l0.3-5.7c0.3-0.3,0.7-0.1,1.6-0.1c3.3,0.3,7.6,4.7,7.8,4.7c0.3,0,0.5-0.4,0.5-0.4S22,15.3,22.1,15.1z', fillColor: 'white', fillOpacity: 1, anchor: new window.google.maps.Point(11, 11), scale: 2, strokeWeight: 2}, offset: '50%'}]}} />
    }
  </GoogleMap>
)

class FlightMapHOC extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <FlightMap departureLocation={this.props.departureLocation} arrivalLocation={this.props.arrivalLocation} />
    )
  }
}

export default FlightMapHOC
