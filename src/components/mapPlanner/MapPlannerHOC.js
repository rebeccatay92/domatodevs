import React, { Component } from 'react'
import { compose, withProps, lifecycle } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import SearchBox from 'react-google-maps/lib/components/places/SearchBox'
import CustomControl from '../location/CustomControl'
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox'

import { Button } from 'react-bootstrap'

const _ = require('lodash')

// const MapPlanner = compose(
//   // withProps({
//   //   googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&v=3.31&libraries=geometry,drawing,places`,
//   //   loadingElement: <div style={{ height: `100%` }} />,
//   //   containerElement: <div style={{ height: '100%' }} />,
//   //   mapElement: <div style={{ height: `100%` }} />
//   // }),
//   lifecycle({
//     componentWillMount () {
//       const refs = {}
//       this.setState({
//         bounds: null,
//         center: {lat: 0, lng: 0},
//         zoom: 2,
//         mapOptions: {
//           fullscreenControl: false,
//           mapTypeControl: false,
//           streetViewControl: false,
//           draggable: true,
//           scrollwheel: true
//         },
//         eventMarkers: [],
//         searchMarkers: [],
//         bucketMarkers: [],
//         daysArr: [], // arr of days 1 to end. for filtering
//         isInfoBoxOpen: false,
//         createOrEdit: '', // switch between create or edit popup
//         infoBoxModel: '', // activity, food, lodging, transport
//         clickedMarker: null,
//         // markerIndex: null,
//         // currentLocationWindow: false,
//         // googlePlaceData: {
//         //   placeId: null,
//         //   name: null,
//         //   address: null,
//         //   latitude: null,
//         //   longitude: null,
//         //   openingHours: null,
//         //   countryCode: null
//         // },
//         onMapMounted: ref => {
//           refs.map = ref
//         },
//         onBoundsChanged: () => {
//           this.setState({
//             bounds: refs.map.getBounds(),
//             center: refs.map.getCenter()
//           })
//         },
//         onSearchBoxMounted: ref => {
//           refs.searchBox = ref
//         },
//         onSearchInputMounted: ref => {
//           refs.searchInput = ref
//         },
//         clearSearch: () => {
//           // console.log('input field', refs.searchInput)
//           refs.searchInput.value = ''
//           // this.setState({markerIndex: null, infoOpen: false, markers: []})
//           this.setState({searchMarkers: []})
//           // if current location exists, open the window again, recenter
//           // console.log('ref', refs)
//           // console.log('props', this.props)
//           // if (refs.currentLocationMarker) {
//           //   this.setState({currentLocationWindow: true})
//           //   this.setState({center: {lat: this.props.currentLocation.latitude, lng: this.props.currentLocation.longitude}})
//           // }
//         },
//         onSearchMarkerMounted: ref => {
//           refs.searchMarker = ref
//         },
//         onInfoBoxMounted: ref => {
//           refs.infoBox = ref
//           console.log('mounted')
//         },
//         onPlacesChanged: () => {
//           // called only by search box
//           const places = refs.searchBox.getPlaces()
//           const bounds = new window.google.maps.LatLngBounds()
//
//           places.forEach(place => {
//             if (place.geometry.viewport) {
//               bounds.union(place.geometry.viewport)
//             } else {
//               bounds.extend(place.geometry.location)
//             }
//           })
//           const nextMarkers = places.map(place => ({
//             position: place.geometry.location,
//             place: place
//           }))
//           const nextCenter = _.get(nextMarkers, '0.position', this.state.center)
//
//           this.setState({
//             center: nextCenter,
//             searchMarkers: nextMarkers
//           })
//           refs.map.fitBounds(bounds)
//         },
//         onInfoBoxDomReady: () => {
//           console.log('dom ready')
//           function stopPropagation (event) {
//             event.stopPropagation()
//           }
//           var infobox = document.querySelector('#infobox')
//           window.google.maps.event.addDomListener(infobox, 'dblclick', (e) => {
//             // stop infobox events from bubbling up to map
//             stopPropagation(e)
//           })
//           window.google.maps.event.addDomListener(infobox, 'mouseenter', (e) => {
//             // console.log('mouse enter')
//             // console.log('map ref', refs.map)
//             this.setState({mapOptions: {draggable: false, scrollwheel: false}})
//           })
//           window.google.maps.event.addDomListener(infobox, 'mouseleave', (e) => {
//             this.setState({mapOptions: {draggable: true, scrollwheel: true}})
//           })
//         },
//         closeInfoBox: () => {
//           console.log('cancel button. close infobox')
//           this.setState({isInfoBoxOpen: false})
//         },
//         searchMarkerClicked: () => {
//           console.log('search marker clicked. open createEvent infobox')
//           this.setState({isInfoBoxOpen: true})
//         }
//         // toggleCreateEventForm: () => {
//         //   console.log('toggle createEventForm')
//         // },
//         // createEvent: () => {
//         //   console.log('submit clicked')
//         // }
//       })
//       console.log(this)
//     }
//   }),
//   withScriptjs,
//   withGoogleMap
// )((props) =>
//   <GoogleMap ref={props.onMapMounted} defaultZoom={2} zoom={props.zoom} center={props.center} onBoundsChanged={props.onBoundsChanged} style={{position: 'relative'}} options={props.mapOptions}>
//
//     {/* CLOSE MAP */}
//     <CustomControl controlPosition={window.google.maps.ControlPosition.RIGHT_TOP}>
//       <button onClick={() => props.returnToPlanner()} style={{boxSizing: 'border-box', border: '1px solid transparent', borderRadius: '3px', boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: 'none', height: '30px', marginTop: '10px', marginRight: '10px'}}>X</button>
//     </CustomControl>
//
//     {/* SEARCH BOX AND CLEAR SEARCH */}
//     <SearchBox ref={props.onSearchBoxMounted} bounds={props.bounds} controlPosition={window.google.maps.ControlPosition.TOP_LEFT} onPlacesChanged={props.onPlacesChanged} >
//       <div>
//         <input ref={props.onSearchInputMounted} type='text' placeholder='Search for location' style={{boxSizing: `border-box`, border: `1px solid transparent`, width: `300px`, height: `30px`, marginTop: `10px`, marginLeft: '10px', padding: `0 12px`, borderRadius: `3px`, boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: `none`, textOverflow: `ellipses`}} />
//         <button onClick={() => props.clearSearch()} style={{boxSizing: 'border-box', border: '1px solid transparent', borderRadius: '3px', boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: 'none', height: '30px', marginLeft: '10px'}}>Clear</button>
//         <button onClick={() => props.testing()}>testing</button>
//       </div>
//     </SearchBox>
//
//     {/* SEARCH MARKERS */}
//     {/* {props.searchMarkers.map((marker, index) =>
//       <Marker ref={props.onSearchMarkerMounted} key={index} position={marker.position} onClick={() => props.searchMarkerClicked()} />
//     )} */}
//
//     {/* FILTERED EVENT MARKERS */}
//
//     {/* CUSTOM INFOBOX. ONLY 1 CAN OPEN AT ANY TIME. OPEN EDIT/CREATE FORM DEPENDING ON TYPE */}
//     {/* {props.isInfoBoxOpen &&
//       <InfoBox ref={props.onInfoBoxMounted} defaultPosition={{lat: 0, lng: 0}} position={new window.google.maps.LatLng(props.center.lat, props.center.lng)} options={{closeBoxURL: ``, enableEventPropagation: true}} onDomReady={() => props.onInfoBoxDomReady()} >
//         <div style={{position: 'relative', background: 'white', width: '384px', height: '243px', padding: '10px'}} id='infobox'>
//           <div style={{position: 'absolute', right: '0', top: '0', padding: '5px'}}>
//             <i className='material-icons' style={{background: 'transparent', color: 'black'}}>location_on</i>
//             <i className='material-icons'>delete</i>
//           </div>
//           <div>
//             <div>Location name</div>
//             <div>Opening hours dropdown</div>
//             <div>
//               <div>Notes input field</div>
//               <div>description / arrival location</div>
//               <div>start date, start day</div>
//               <div>start time</div>
//               <div>end date, end day</div>
//               <div>end time</div>
//             </div>
//             <div>buttons for event type. activity, food, lodging, transport</div>
//           </div>
//           <div style={{position: 'absolute', right: '0', bottom: '0'}}>
//             <Button bsStyle='danger' style={{backgroundColor: '#ed685a'}} onClick={() => props.createEvent()}>Submit</Button>
//             <Button bsStyle='default' style={{}} onClick={() => props.closeInfoBox()}>Cancel</Button>
//             <Button bsStyle='default' style={{}} onClick={() => props.toggleCreateEventForm()} >More</Button>
//           </div>
//         </div>
//       </InfoBox>
//     } */}
//
//   </GoogleMap>
// )

class Map extends Component {
  constructor (props) {
    super(props)
    this.state = {
      zoom: 2,
      bounds: null,
      center: {lat: 0, lng: 0},
      mapOptions: {
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        draggable: true,
        scrollwheel: true
      },
      searchMarkers: [],
      isInfoBoxOpen: false,
      searchPlannerBucket: '', // search, planner or bucket
      formModel: '', // activity, food, lodging, transport

    }
  }

  onBoundsChanged () {
    if (!this.map) return
    this.setState({
      bounds: this.map.getBounds(),
      center: {lat: this.map.getCenter().lat(), lng: this.map.getCenter().lng()}
    })
    // use latlng literal for center
  }

  onPlacesChanged () {
    // called only by search box
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
      center: {lat: nextCenter.lat(), lng: nextCenter.lng()},
      searchMarkers: nextMarkers
    })
    this.map.fitBounds(bounds)
  }

  clearSearch () {
    // console.log('clear search', this.searchInput)
    this.searchInput.value = ''
  }

  onSearchMarkerClicked (index) {
    var marker = this.state.searchMarkers[index]
    console.log('marker', marker)
    this.setState({
      isInfoBoxOpen: true,
      searchPlannerBucket: 'search'
    })
  }

  render () {
    return (
      <GoogleMap ref={node => { this.map = node }}
        defaultZoom={2}
        defaultCenter={{ lat: 0, lng: 0 }}
        center={{lat: this.state.center.lat, lng: this.state.center.lng}}
        zoom={this.state.zoom} onBoundsChanged={() => this.onBoundsChanged()}
        options={this.state.mapOptions}
      >
        {/* CLOSE MAP */}
        <CustomControl controlPosition={window.google.maps.ControlPosition.RIGHT_TOP}>
          <button onClick={() => this.props.returnToPlanner()} style={{boxSizing: 'border-box', border: '1px solid transparent', borderRadius: '3px', boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: 'none', height: '30px', marginTop: '10px', marginRight: '10px'}}>X</button>
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
      </GoogleMap>
    )
  }
}

const MapPlanner = withScriptjs(withGoogleMap(Map))

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
      <MapPlanner returnToPlanner={() => this.returnToPlanner()} googleMapURL='https://maps.googleapis.com/maps/api/js?v=3.31&libraries=geometry,drawing,places' loadingElement={<div style={{ height: `100%` }} />} containerElement={<div style={{ height: `100%` }} />} mapElement={<div style={{ height: `100%` }} />} />
    )
  }
}

export default MapPlannerHOC
