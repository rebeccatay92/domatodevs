import React, { Component } from 'react'
import { compose, withProps, lifecycle } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps'
import SearchBox from 'react-google-maps/lib/components/places/SearchBox'
import CustomControl from '../location/CustomControl'
const _ = require('lodash')

const MapPlanner = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&v=3.30&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: '100%' }} />,
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
          // console.log('input field', refs.searchInput)
          refs.searchInput.value = ''
          this.setState({markerIndex: null, infoOpen: false, markers: []})

          // if current location exists, open the window again, recenter
          console.log('ref', refs)
          console.log('props', this.props)
          if (refs.currentLocationMarker) {
            this.setState({currentLocationWindow: true})
            this.setState({center: {lat: this.props.currentLocation.latitude, lng: this.props.currentLocation.longitude}})
          }
        },
        onMarkerMounted: ref => {
          refs.marker = ref
        },
        onInfoWindowMounted: ref => {
          refs.infoWindow = ref
        },
        onCurrentLocationMounted: ref => {
          refs.currentLocationMarker = ref
          this.setState({zoom: 16})
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

          // close current location if open
          this.setState({currentLocationWindow: false})
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
        }
      })
    }
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap ref={props.onMapMounted} defaultZoom={2} zoom={props.zoom} center={props.center} onBoundsChanged={props.onBoundsChanged} options={{fullscreenControl: false, mapTypeControl: false, streetViewControl: false}}>
  </GoogleMap>
)

class MapPlannerHOC extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <MapPlanner />
    )
  }
}

export default MapPlannerHOC
