import React, { Component } from 'react'
import { compose, withProps, lifecycle } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline } from 'react-google-maps'

const FlightMap = compose(
  withProps({
    googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDwlTicqOxDlB2u3MhiEusUJyo_QQy-MZU&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: (755 * 0.9) + 'px' }} />,
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
        departureMarker: true,
        arrivalMarker: true,
        onMapMounted: ref => {
          refs.map = ref
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter()
          })
        }
      })
    }
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap ref={props.onMapMounted} defaultZoom={2} center={props.center} onBoundsChanged={props.onBoundsChanged} style={{position: 'relative'}} options={{fullscreenControl: false, mapTypeControl: false, streetViewControl: false}}>
    {props.departureMarker &&
    <Marker position={{lat: 1.3521, lng: 103.8198}} />
    }
    {props.arrivalMarker &&
    <Marker position={{lat: 37.7749, lng: -122.4194}} />
    }
    <Polyline path={[{lat: 1.3521, lng: 103.8198},{lat: 37.7749, lng: -122.4194}]} options={{geodesic: true}} />
  </GoogleMap>
)

class FlightMapHOC extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <FlightMap selectLocation={(obj) => this.props.selectLocation(obj)} toggleMap={() => this.props.toggleMap()} />
      </div>
    )
  }
}

export default FlightMapHOC
