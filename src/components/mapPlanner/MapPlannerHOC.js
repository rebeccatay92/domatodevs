import React, { Component } from 'react'
import { compose, withProps, lifecycle } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import SearchBox from 'react-google-maps/lib/components/places/SearchBox'
import CustomControl from '../location/CustomControl'
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox'

import { Button } from 'react-bootstrap'

const _ = require('lodash')

const MapPlanner = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
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
        mapOptions: {
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          draggable: true,
          scrollwheel: true
        },
        eventMarkers: [],
        searchMarkers: [],
        isInfoBoxOpen: true,
        createOrEdit: '', // switch between create or edit popup
        infoBoxModel: '', // activity, food, lodging, transport
        // markerIndex: null,
        // currentLocationWindow: false,
        // googlePlaceData: {
        //   placeId: null,
        //   name: null,
        //   address: null,
        //   latitude: null,
        //   longitude: null,
        //   openingHours: null,
        //   countryCode: null
        // },
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
          // this.setState({markerIndex: null, infoOpen: false, markers: []})
          this.setState({searchMarkers: []})
          // if current location exists, open the window again, recenter
          // console.log('ref', refs)
          // console.log('props', this.props)
          // if (refs.currentLocationMarker) {
          //   this.setState({currentLocationWindow: true})
          //   this.setState({center: {lat: this.props.currentLocation.latitude, lng: this.props.currentLocation.longitude}})
          // }
        },
        onSearchMarkerMounted: ref => {
          refs.searchMarker = ref
        },
        // onInfoWindowMounted: ref => {
        //   refs.infoWindow = ref
        // },
        onInfoBoxMounted: ref => {
          refs.infoBox = ref
          console.log('mounted')
          // var infobox = document.querySelector('#infobox')
          // console.log('infobox', infobox)
          // infobox.addEventListener('mouseenter', () => {
          //   console.log('mouse enter')
          // })
        },
        onPlacesChanged: () => {
          // called only by search box
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
            searchMarkers: nextMarkers
          })
          refs.map.fitBounds(bounds)
        },
        onDomReady: () => {
          function stopPropagation (event) {
            event.stopPropagation()
          }

          var testing = document.querySelector('#testing')
          window.google.maps.event.addDomListener(testing, 'dblclick', (e) => {
            // stop infobox events from bubbling up to map
            stopPropagation(e)
            console.log('prevent zoom')
          })
          window.google.maps.event.addDomListener(testing, 'mouseenter', (e) => {
            console.log('mouse enter')
            console.log('map ref', refs.map)
            this.setState({mapOptions: {draggable: false, scrollwheel: false}})
          })
        }
      })
    }
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap ref={props.onMapMounted} defaultZoom={2} zoom={props.zoom} center={props.center} onBoundsChanged={props.onBoundsChanged} style={{position: 'relative'}} options={props.mapOptions}>
    {/* CLOSE MAP */}
    <CustomControl controlPosition={window.google.maps.ControlPosition.RIGHT_TOP}>
      <button onClick={() => props.returnToPlanner()} style={{boxSizing: 'border-box', border: '1px solid transparent', borderRadius: '3px', boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: 'none', height: '30px', marginTop: '10px', marginRight: '10px'}}>X</button>
    </CustomControl>

    {/* SEARCH BOX AND CLEAR SEARCH */}
    <SearchBox ref={props.onSearchBoxMounted} bounds={props.bounds} controlPosition={window.google.maps.ControlPosition.TOP_LEFT} onPlacesChanged={props.onPlacesChanged} >
      <div>
        <input ref={props.onSearchInputMounted} type='text' placeholder='Search for location' style={{boxSizing: `border-box`, border: `1px solid transparent`, width: `300px`, height: `30px`, marginTop: `10px`, marginLeft: '10px', padding: `0 12px`, borderRadius: `3px`, boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: `none`, textOverflow: `ellipses`}} />
        <button onClick={() => props.clearSearch()} style={{boxSizing: 'border-box', border: '1px solid transparent', borderRadius: '3px', boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: 'none', height: '30px', marginLeft: '10px'}}>Clear</button>
      </div>
    </SearchBox>

    {/* SEARCH MARKERS */}
    {props.searchMarkers.map((marker, index) =>
      <Marker ref={props.onSearchMarkerMounted} key={index} position={marker.position} />
    )}

    {/* FILTERED EVENT MARKERS */}

    {/* CUSTOM INFOBOX. ONLY 1 CAN OPEN AT ANY TIME. OPEN EDIT/CREATE FORM DEPENDING ON TYPE */}
    {props.isInfoBoxOpen &&
      <InfoBox ref={props.onInfoBoxMounted} position={new window.google.maps.LatLng(props.center.lat, props.center.lng)} options={{closeBoxURL: ``, enableEventPropagation: true}} onDomReady={() => props.onDomReady()} id='infobox'>
        <div style={{position: 'relative', background: 'white', width: '384px', height: '243px', padding: '10px'}} id={'testing'}>
          <div style={{position: 'absolute', right: '0', top: '0', padding: '5px'}}>
            <i className='material-icons' style={{background: 'transparent', color: 'black'}}>location_on</i>
            <i className='material-icons'>delete</i>
          </div>
          <div>main component (location details, opening hours, notes, forms)</div>
          <div style={{position: 'absolute', right: '0', bottom: '0'}}>
            <Button bsStyle='danger' style={{backgroundColor: '#ed685a'}}>Submit</Button>
            <Button bsStyle='default' style={{}}>Cancel</Button>
            <Button bsStyle='default' style={{}}>More</Button>
          </div>
        </div>
      </InfoBox>
    }
  </GoogleMap>
)

class MapPlannerHOC extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  returnToPlanner () {
    console.log('return to planner')
  }

  render () {
    return (
      <MapPlanner returnToPlanner={() => this.returnToPlanner()} />
    )
  }
}

export default MapPlannerHOC
