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
      isCurrentLocationOpen: false
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
    this.setState({isInfoOpen: false, markerIndex: null, marker: null})
    this.setState({isCurrentLocationOpen: false})

    if (nextMarkers.length === 1) {
      this.setState({isInfoOpen: true, markerIndex: 0, marker: nextMarkers[0]})
    }
  }

  clearSearch () {
    this.searchInput.value = ''

    // clear search markers n info window
    this.setState({isInfoOpen: false, markerIndex: null, searchMarkers: []})

    // if current location exist, reopen, recenter
    if (this.props.currentLocation.latitude) {
      this.setState({
        isCurrentLocationOpen: true,
        center: {
          lat: this.props.currentLocation.latitude,
          lng: this.props.currentLocation.longitude
        },
        zoom: 16
      })
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

  handleCurrentLocationClick () {
    this.setState({isCurrentLocationOpen: true})
  }

  closeCurrentLocationWindow () {
    this.setState({isCurrentLocationOpen: false})
  }

  componentDidMount () {
    if (this.props.currentLocation.latitude) {
      this.setState({
        center: {
          lat: this.props.currentLocation.latitude,
          lng: this.props.currentLocation.longitude
        },
        zoom: 16,
        isCurrentLocationOpen: true
      })
    }
  }

  render () {
    return (
      <GoogleMap ref={node => { this.map = node }} center={this.state.center} zoom={this.state.zoom} onBoundsChanged={() => this.onBoundsChanged()} options={{fullscreenControl: false, mapTypeControl: false, streetViewControl: false}}>
        {/* CLOSE MAP */}
        <CustomControl controlPosition={window.google.maps.ControlPosition.RIGHT_TOP}>
          <button onClick={() => this.props.toggleMap()} style={{boxSizing: 'border-box', border: '1px solid transparent', borderRadius: '3px', boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: 'none', height: '30px', marginTop: '10px', marginRight: '10px'}}>BACK</button>
        </CustomControl>

        <SearchBox ref={node => { this.searchBox = node }} bounds={this.state.bounds} controlPosition={window.google.maps.ControlPosition.TOP_LEFT} onPlacesChanged={() => this.onPlacesChanged()} >
          <div>
            <input ref={node => { this.searchInput = node }} type='text' placeholder='Search for location' style={{boxSizing: `border-box`, border: `1px solid transparent`, width: `300px`, height: `30px`, marginTop: `10px`, marginLeft: '10px', padding: `0 12px`, borderRadius: `3px`, boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: `none`, textOverflow: `ellipses`}} />
            <button onClick={() => this.clearSearch()} style={{boxSizing: 'border-box', border: '1px solid transparent', borderRadius: '3px', boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: 'none', height: '30px', marginLeft: '10px'}}>Clear</button>
          </div>
        </SearchBox>

        {this.state.searchMarkers.map((marker, index) => {
          return (
            <Marker key={index} position={marker.position} onClick={() => this.onSearchMarkerClicked(index)} />
          )
        })}

        // INFO WINDOW NEEDS STYLING, AND POSITION ABOVE MARKER (OVERLAPPING NOW). SWITCH TO INFOBOX?

        {this.state.isInfoOpen &&
          <InfoWindow position={this.state.searchMarkers[this.state.markerIndex].position} onCloseClick={() => this.onCloseInfo()}>
            <div>
              <h5>Name: {this.state.marker.place.name}</h5>
              <h5>Address: {this.state.marker.place.formatted_address}</h5>
              <h5>place_id: {this.state.marker.place.place_id}</h5>
              <button onClick={() => this.handleSelectLocationClick(this.state.marker.place.place_id)} >Select this location</button>
            </div>
          </InfoWindow>
        }
        {this.props.currentLocation.latitude &&
          <Marker position={{lat: this.props.currentLocation.latitude, lng: this.props.currentLocation.longitude}} onClick={() => this.props.handleCurrentLocationClick()}>
            {this.state.isCurrentLocationOpen &&
              <InfoWindow onCloseClick={this.props.closeCurrentLocationWindow}>
                <div>
                  <h5>Currently selected location</h5>
                  <h5>Name: {this.props.currentLocation.name}</h5>
                  <h5>Address: {this.props.currentLocation.address}</h5>
                </div>
              </InfoWindow>
            }
          </Marker>
        }
      </GoogleMap>
    )
  }
}

const LocationMap = withScriptjs(withGoogleMap(Map))

class LocationMapHOC extends Component {
  render () {
    return (
      <LocationMap googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&v=3.31&libraries=geometry,drawing,places`} loadingElement={<div style={{ height: `100%` }} />} containerElement={<div style={{ height: `100%` }} />} mapElement={<div style={{ height: `100%` }} />} toggleMap={() => this.props.toggleMap()} selectLocation={(obj) => this.props.selectLocation(obj)} currentLocation={this.props.currentLocation} />
    )
  }
}

export default LocationMapHOC
