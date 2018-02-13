import React, { Component } from 'react'
import { compose, withProps, lifecycle } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline, InfoWindow } from 'react-google-maps'
import SearchBox from 'react-google-maps/lib/components/places/SearchBox'
import CustomControl from './CustomControl'
const _ = require('lodash')

const TransportMap = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: '755px' }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  lifecycle({
    componentWillMount () {
      const refs = {}
      this.setState({
        bounds: null,
        center: {lat: 0, lng: 0},
        zoom: 2,
        markers: [],
        infoOpen: false,
        markerIndex: null,
        departureMarker: true,
        arrivalMarker: true,
        departureWindow: true,
        arrivalWindow: true,
        onMapMounted: ref => {
          refs.map = ref
          console.log('props', this.props)

          var departure = this.props.departureLocation
          var arrival = this.props.arrivalLocation
          // set center if only 1 marker exists
          if (departure.latitude && !arrival.latitude) {
            this.setState({center: {lat: departure.latitude, lng: departure.longitude}})
            this.setState({zoom: 16})
          } else if (!departure.latitude && arrival.latitude) {
            this.setState({center: {lat: arrival.latitude, lng: arrival.longitude}})
            this.setState({zoom: 16})
          } else if (departure.latitude && arrival.latitude) {
            const bounds = new window.google.maps.LatLngBounds()
            bounds.extend({lat: departure.latitude, lng: departure.longitude})
            bounds.extend({lat: arrival.latitude, lng: arrival.longitude})
            if (refs.map) {
              refs.map.fitBounds(bounds, 150)
            }
          }
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter()
          })
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref
        },
        onSearchInputMounted: ref => {
          refs.searchInput = ref
        },
        clearSearch: () => {
          refs.searchInput.value = ''
          this.setState({markerIndex: null, infoOpen: false, markers: []})

          // make currently selected locations reappear if they exist. need to recenter or fit bounds
          if (this.props.departureLocation.latitude) {
            this.setState({departureMarker: true, departureWindow: true})
          }
          if (this.props.arrivalLocation.latitude) {
            this.setState({arrivalMarker: true, arrivalWindow: true})
          }

          // recenter, rezoom, refit if search is cleared
          var departure = this.props.departureLocation
          var arrival = this.props.arrivalLocation
          if (departure.latitude && !arrival.latitude) {
            this.setState({center: {lat: departure.latitude, lng: departure.longitude}})
            this.setState({zoom: 16})
          } else if (!departure.latitude && arrival.latitude) {
            this.setState({center: {lat: arrival.latitude, lng: arrival.longitude}})
            this.setState({zoom: 16})
          } else if (departure.latitude && arrival.latitude) {
            const bounds = new window.google.maps.LatLngBounds()
            bounds.extend({lat: departure.latitude, lng: departure.longitude})
            bounds.extend({lat: arrival.latitude, lng: arrival.longitude})
            if (refs.map) {
              refs.map.fitBounds(bounds, 150)
            }
          }
        },
        onMarkerMounted: ref => {
          refs.marker = ref
        },
        onInfoWindowMounted: ref => {
          refs.infoWindow = ref
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces()
          const bounds = new window.google.maps.LatLngBounds()

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          })
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
            place: place
          }))
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center)

          this.setState({
            center: nextCenter,
            markers: nextMarkers
          })
          refs.map.fitBounds(bounds)

          // close any info windows that were open for previous search
          this.setState({infoOpen: false})
          this.setState({markerIndex: null})

          // close departure/arrival windows, hide currently selected location markers
          this.setState({departureMarker: false, departureWindow: false})
          this.setState({arrivalMarker: false, arrivalWindow: false})

          // infowindow auto opens if only 1 result is present
          if (places.length === 1) {
            this.setState({infoOpen: true})
            this.setState({markerIndex: 0})
          }
        },
        handleMarkerClick: (index) => {
          // var marker = this.state.markers[index]
          // console.log('marker place', marker.place)
          if (!this.state.infoOpen || this.state.markerIndex !== index) {
            this.setState({infoOpen: true})
            this.setState({markerIndex: index})
          } else {
            this.setState({infoOpen: false})
            this.setState({markerIndex: null})
          }
        },
        handleSelectLocationClick: (placeId) => {
          var request = {placeId: placeId}

          if (refs.map) {
            var service = new window.google.maps.places.PlacesService(refs.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED)
          }

          service.getDetails(request, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              console.log('placeDetails', place)
              this.props.selectLocation(place)
            }
          })
        },
        closeInfoWindow: () => {
          this.setState({infoOpen: false})
          this.setState({markerIndex: null})
        },
        onDepartureMarkerMounted: ref => {
          refs.departureMarker = ref
        },
        onArrivalMarkerMounted: ref => {
          refs.arrivalMarker = ref
        },
        onDepartureWindowMounted: ref => {
          refs.departureWindow = ref
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
    }
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap ref={props.onMapMounted} defaultZoom={2} zoom={props.zoom} center={props.center} onBoundsChanged={props.onBoundsChanged} style={{position: 'relative'}} options={{fullscreenControl: false, mapTypeControl: false, streetViewControl: false}}>
    <CustomControl controlPosition={window.google.maps.ControlPosition.RIGHT_TOP}>
      <button onClick={() => props.toggleMap()} style={{boxSizing: 'border-box', border: '1px solid transparent', borderRadius: '3px', boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: 'none', height: '30px', marginTop: '10px', marginRight: '10px'}}>BACK</button>
    </CustomControl>
    <SearchBox ref={props.onSearchBoxMounted} bounds={props.bounds} controlPosition={window.google.maps.ControlPosition.TOP_LEFT} onPlacesChanged={props.onPlacesChanged} >
      <div>
        <input ref={props.onSearchInputMounted} type='text' placeholder={`Search for ${props.mapLocationType} location`}
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `300px`,
            height: `30px`,
            marginTop: `10px`,
            marginLeft: '10px',
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`
          }}
        />
        <button onClick={() => props.clearSearch()} style={{boxSizing: 'border-box', border: '1px solid transparent', borderRadius: '3px', boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: 'none', height: '30px', marginLeft: '10px'}}>Clear</button>
      </div>
    </SearchBox>
    {props.markers.map((marker, index) =>
      <Marker ref={props.onMarkerMounted} key={index} position={marker.position} onClick={() => props.handleMarkerClick(index)}>
        {props.infoOpen && props.markerIndex === index &&
          <InfoWindow ref={props.onInfoWindowMounted} key={index} onCloseClick={props.closeInfoWindow}>
            <div>
              <h5>Name: {marker.place.name}</h5>
              <h5>Address: {marker.place.formatted_address}</h5>
              <h5>place_id: {marker.place.place_id}</h5>
              <button onClick={() => props.handleSelectLocationClick(marker.place.place_id)} >Set as {props.mapLocationType} location</button>
            </div>
          </InfoWindow>
      }
      </Marker>
    )}

    {props.departureLocation.latitude && props.departureMarker &&
      <Marker ref={props.onDepartureMarkerMounted} position={{lat: props.departureLocation.latitude, lng: props.departureLocation.longitude}} location={props.departureLocation} onClick={props.toggleDepartureWindow}>
        {props.departureWindow &&
        <InfoWindow ref={props.onDepartureWindowMounted} onCloseClick={props.toggleDepartureWindow}>
          <div>
            <h5>Departure: {props.departureLocation.name}</h5>
          </div>
        </InfoWindow>
        }
      </Marker>
    }
    {props.arrivalLocation.latitude && props.arrivalMarker &&
      <Marker ref={props.onArrivalMarkerMounted} position={{lat: props.arrivalLocation.latitude, lng: props.arrivalLocation.longitude}} location={props.arrivalLocation} onClick={props.toggleArrivalWindow}>
        {props.arrivalWindow &&
        <InfoWindow ref={props.onArrivalWindowMounted} onCloseClick={props.toggleArrivalWindow}>
          <div>
            <h5>Arrival: {props.arrivalLocation.name}</h5>
          </div>
        </InfoWindow>
        }
      </Marker>
    }

  </GoogleMap>
)

class TransportMapHOC extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <TransportMap selectLocation={(obj) => this.props.selectLocation(obj)} toggleMap={() => this.props.toggleMap()} departureLocation={this.props.departureLocation} arrivalLocation={this.props.arrivalLocation} mapLocationType={this.props.mapLocationType} />
    )
  }
}

export default TransportMapHOC
