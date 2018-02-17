import React, { Component } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps'
import SearchBox from 'react-google-maps/lib/components/places/SearchBox'
import CustomControl from './CustomControl'
const _ = require('lodash')

class Map extends Component {
  constructor (props) {
    super(props)
    this.state = {
      zoom: 2,
      bounds: null,
      center: {lat: 0, lng: 0},
      searchMarkers: [],
      markerIndex: null,
      marker: null,
      isInfoOpen: false,
      departureMarker: false,
      arrivalMarker: false,
      departureInfo: false,
      arrivalInfo: false
    }
  }

  onBoundsChanged () {
    if (!this.map) return
    this.setState({
      bounds: this.map.getBounds(),
      center: {lat: this.map.getCenter().lat(), lng: this.map.getCenter().lng()}
    })
  }

  onPlacesChanged () {
    if (!this.searchBox) return
    const places = this.searchBox.getPlaces()
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

    // center needs to be latlng literal
    this.setState({
      center: nextCenter,
      searchMarkers: nextMarkers
    })
    this.map.fitBounds(bounds)

    // close any info windows that may be open
    this.setState({isinfoOpen: false, markerIndex: null, marker: null})
    this.setState({departureMarker: false, departureInfo: false, arrivalMarker: false, arrivalInfo: false})

    if (nextMarkers.length === 1) {
      this.setState({isInfoOpen: true, markerIndex: 0, marker: nextMarkers[0]})
    }
  }

  clearSearch () {
    this.searchInput.value = ''
    this.setState({isInfoOpen: false, markerIndex: null, marker: null, searchMarkers: []})

    // make currently selected locations reappear if they exist. need to recenter or fit bounds
    if (this.props.departureLocation.latitude) {
      this.setState({departureMarker: true, departureInfo: true})
    }
    if (this.props.arrivalLocation.latitude) {
      this.setState({arrivalMarker: true, arrivalInfo: true})
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
      if (this.map) {
        this.map.fitBounds(bounds, 150)
      }
    }
  }

  onSearchMarkerClicked (index) {
    this.setState({isInfoOpen: true, markerIndex: index, marker: this.state.searchMarkers[index]})
  }

  onCloseInfo () {
    this.setState({isInfoOpen: false, markerIndex: null, marker: null})
  }

  handleSelectLocationClick (placeId) {
    var request = {placeId: placeId}

    if (this.map) {
      var service = new window.google.maps.places.PlacesService(this.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED)
    }

    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log('placeDetails', place)
        this.props.selectLocation(place)
      }
    })
  }

  toggleDepartureInfo () {
    this.setState({departureInfo: !this.state.departureInfo})
  }

  toggleArrivalInfo () {
    this.setState({arrivalInfo: !this.state.arrivalInfo})
  }

  componentDidMount () {
    console.log('props', this.props)

    var departure = this.props.departureLocation
    var arrival = this.props.arrivalLocation
    // set center if only 1 marker exists
    if (departure.latitude && !arrival.latitude) {
      this.setState({center: {lat: departure.latitude, lng: departure.longitude}})
      this.setState({zoom: 16})
      this.setState({departureMarker: true, departureInfo: true})
    } else if (!departure.latitude && arrival.latitude) {
      this.setState({center: {lat: arrival.latitude, lng: arrival.longitude}})
      this.setState({zoom: 16})
      this.setState({arrivalMarker: true, arrivalInfo: true})
    } else if (departure.latitude && arrival.latitude) {
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend({lat: departure.latitude, lng: departure.longitude})
      bounds.extend({lat: arrival.latitude, lng: arrival.longitude})
      if (this.map) {
        this.map.fitBounds(bounds, 150)
      }
      this.setState({departureMarker: true, departureInfo: true, arrivalMarker: true, arrivalInfo: true})
    }
  }

  render () {
    return (
      <GoogleMap ref={node => { this.map = node }} defaultZoom={2} defaultCenter={{lat: 0, lng: 0}} center={this.state.center} zoom={this.state.zoom} onBoundsChanged={() => this.onBoundsChanged()} options={{fullscreenControl: false, mapTypeControl: false, streetViewControl: false}}>
        {/* CLOSE MAP */}
        <CustomControl controlPosition={window.google.maps.ControlPosition.RIGHT_TOP}>
          <button onClick={() => this.props.toggleMap()} style={{boxSizing: 'border-box', border: '1px solid transparent', borderRadius: '3px', boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: 'none', height: '30px', marginTop: '10px', marginRight: '10px'}}>BACK</button>
        </CustomControl>

        <SearchBox ref={node => { this.searchBox = node }} bounds={this.state.bounds} controlPosition={window.google.maps.ControlPosition.TOP_LEFT} onPlacesChanged={() => this.onPlacesChanged()} >
          <div>
            <input ref={node => { this.searchInput = node }} type='text' placeholder={`Search for ${this.props.mapLocationType} location`}
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
            <button onClick={() => this.clearSearch()} style={{boxSizing: 'border-box', border: '1px solid transparent', borderRadius: '3px', boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: 'none', height: '30px', marginLeft: '10px'}}>Clear</button>
          </div>
        </SearchBox>

        {this.state.searchMarkers.map((marker, index) =>
          <Marker key={index} position={marker.position} onClick={() => this.onSearchMarkerClicked(index)} />
        )}
        {this.state.isInfoOpen &&
          <InfoWindow position={this.state.marker.position} onCloseClick={() => this.onCloseInfo()}>
            <div>
              <h5>Name: {this.state.marker.place.name}</h5>
              <h5>Address: {this.state.marker.place.formatted_address}</h5>
              <h5>place_id: {this.state.marker.place.place_id}</h5>
              <button onClick={() => this.handleSelectLocationClick(this.state.marker.place.place_id)} >Set as {this.props.mapLocationType} location</button>
            </div>
          </InfoWindow>
        }

        {this.props.departureLocation.latitude && this.state.departureMarker &&
          <Marker position={{lat: this.props.departureLocation.latitude, lng: this.props.departureLocation.longitude}} onClick={() => this.toggleDepartureInfo()}>
            {this.state.departureInfo &&
              <InfoWindow onCloseClick={() => this.toggleDepartureInfo()}>
                <div>
                  <h5>Departure: {this.props.departureLocation.name}</h5>
                </div>
              </InfoWindow>
            }
          </Marker>
        }
        {this.props.arrivalLocation.latitude && this.state.arrivalMarker &&
          <Marker position={{lat: this.props.arrivalLocation.latitude, lng: this.props.arrivalLocation.longitude}} onClick={() => this.toggleArrivalInfo()}>
            {this.state.arrivalInfo &&
              <InfoWindow onCloseClick={() => this.toggleArrivalInfo()}>
                <div>
                  <h5>Arrival: {this.props.arrivalLocation.name}</h5>
                </div>
              </InfoWindow>
            }
          </Marker>
        }
      </GoogleMap>
    )
  }
}

const TransportMap = withScriptjs(withGoogleMap(Map))

class TransportMapHOC extends Component {
  render () {
    return (
      <TransportMap googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&v=3.31&libraries=geometry,drawing,places`} loadingElement={<div style={{ height: `100%` }} />} containerElement={<div style={{ height: `100%` }} />} mapElement={<div style={{ height: `100%` }} />} selectLocation={(obj) => this.props.selectLocation(obj)} toggleMap={() => this.props.toggleMap()} departureLocation={this.props.departureLocation} arrivalLocation={this.props.arrivalLocation} mapLocationType={this.props.mapLocationType} />
    )
  }
}

export default TransportMapHOC
