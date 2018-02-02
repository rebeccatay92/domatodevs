import React, { Component } from 'react'
import { compose, withProps, lifecycle } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps'
import SearchBox from 'react-google-maps/lib/components/places/SearchBox'
import CustomControl from './CustomControl'
const _ = require('lodash')

const LocationMap = compose(
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
        center: {
          lat: 41.9, lng: -87.624
        },
        markers: [],
        infoOpen: false,
        markerIndex: null,
        currentLocationWindow: false,
        googlePlaceData: {
          placeId: null,
          name: null,
          address: null,
          latitude: null,
          longitude: null,
          openingHours: null,
          countryCode: null
        },
        onMapMounted: ref => {
          refs.map = ref
          console.log('current location', this.props.currentLocation)
          // even if current location doesnt exist, HOC still passes an empty obj down. check key exists
          if (this.props.currentLocation.latitude) {
            this.setState({center: {lat: this.props.currentLocation.latitude, lng: this.props.currentLocation.longitude}})
            this.setState({currentLocationWindow: true})
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
          console.log('input field', refs.searchInput)
          refs.searchInput.value = ''
          this.setState({markerIndex: null, infoOpen: false, markers: []})
        },
        onMarkerMounted: ref => {
          refs.marker = ref
        },
        onInfoWindowMounted: ref => {
          refs.infoWindow = ref
        },
        onCurrentLocationMounted: ref => {
          refs.currentLocationMarker = ref
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
        handleCurrentLocationClick: () => {
          this.setState({currentLocationWindow: !this.state.currentLocationWindow})
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
        closeCurrentLocationWindow: () => {
          this.setState({currentLocationWindow: false})
        }
      })
    }
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap ref={props.onMapMounted} defaultZoom={15} center={props.center} onBoundsChanged={props.onBoundsChanged} style={{position: 'relative'}} options={{fullscreenControl: false, mapTypeControl: false, streetViewControl: false}}>
    <CustomControl controlPosition={window.google.maps.ControlPosition.RIGHT_TOP}>
      <button onClick={() => props.toggleMap()} style={{width: '50px', height: '50px'}}>BACK</button>
    </CustomControl>
    <SearchBox ref={props.onSearchBoxMounted} bounds={props.bounds} controlPosition={window.google.maps.ControlPosition.TOP_LEFT} onPlacesChanged={props.onPlacesChanged} >
      <div>
        <input ref={props.onSearchInputMounted} type='text' placeholder='Search for location'
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `300px`,
            height: `30px`,
            marginTop: `10px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`
          }}
        />
        <button onClick={() => props.clearSearch()}>CLEAR</button>
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
              <button onClick={() => props.handleSelectLocationClick(marker.place.place_id)} >Select this location</button>
            </div>
          </InfoWindow>
      }
      </Marker>
    )}
    {props.currentLocation.latitude &&
      <Marker ref={props.onCurrentLocationMounted} position={{lat: props.currentLocation.latitude, lng: props.currentLocation.longitude}} onClick={() => props.handleCurrentLocationClick()}>
        {props.currentLocationWindow &&
          <InfoWindow onCloseClick={props.closeCurrentLocationWindow}>
            <div>
              <h5>Currently selected location</h5>
              <h5>Name: {props.currentLocation.name}</h5>
              <h5>Address: {props.currentLocation.address}</h5>
            </div>
          </InfoWindow>
        }
      </Marker>
    }
  </GoogleMap>
)

class LocationMapHOC extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <LocationMap selectLocation={(obj) => this.props.selectLocation(obj)} toggleMap={() => this.props.toggleMap()} currentLocation={this.props.currentLocation} />
    )
  }
}

export default LocationMapHOC
