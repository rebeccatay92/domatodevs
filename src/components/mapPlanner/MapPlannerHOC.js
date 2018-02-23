import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import SearchBox from 'react-google-maps/lib/components/places/SearchBox'
import CustomControl from '../location/CustomControl'
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox'

import MapCreateEventPopup from './MapCreateEventPopup'

const _ = require('lodash')

class Map extends Component {
  constructor (props) {
    super(props)
    this.state = {
      zoom: 2,
      bounds: null,
      center: {lat: 0, lng: 0},
      mapOptions: {
        minZoom: 2,
        maxZoom: 16,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        gestureHandling: 'cooperative'
      },
      daysFilter: [], // arr of days to show eg [1,2,5]
      allEvents: [], // entire this.props.events arr
      eventsArr: [], // manipulated arr to extract location
      searchMarkers: [],
      plannerMarkers: [], // filtered planner markers. eg markers for days 1,2,5
      isSearchInfoBoxOpen: false,
      clickedSearchMarkerIndex: null,
      eventType: '' // activity, food, lodging, transport
    }
  }

  onBoundsChanged () {
    if (!this.map) return
    this.setState({
      bounds: this.map.getBounds(),
      center: {lat: this.map.getCenter().lat(), lng: this.map.getCenter().lng()}
    }, () => {
      // console.log('after on bounds changed', this.state)
      // console.log('zoom is', this.map.getZoom())
      // sync the zoom in state with map's actual zoom
      this.setState({zoom: this.map.getZoom()})
    })
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

    this.setState({
      center: nextCenter,
      searchMarkers: nextMarkers
    })
    this.map.fitBounds(bounds)
  }

  clearSearch () {
    this.searchInput.value = ''
    if (this.state.searchMarkers.length) {
      this.setState({
        searchMarkers: [],
        isSearchInfoBoxOpen: false,
        clickedSearchMarkerIndex: null
      })
    }

    // if search was cleared, but planner has markers, refitBounds
    if (this.state.plannerMarkers.length) {
      this.refitBounds(this.state.plannerMarkers, 'planner')
    }
  }

  onSearchMarkerClicked (index) {
    var marker = this.state.searchMarkers[index]
    // console.log('marker', marker)
    this.map.panTo(marker.position)
    this.setState({center: marker.position})

    if (this.state.searchMarkers.length && index !== this.state.clickedSearchMarkerIndex) {
      this.setState({
        eventType: 'activity',
        isSearchInfoBoxOpen: true,
        clickedSearchMarkerIndex: index
      })
    } else {
      this.setState({
        eventType: '',
        isSearchInfoBoxOpen: false,
        clickedSearchMarkerIndex: null
      })
    }
  }

  onInfoBoxDomReady () {
    function stopPropagation (event) {
      return event.stopPropagation()
    }
    var infobox = document.querySelector('#infobox')
    window.google.maps.event.addDomListener(infobox, 'dblclick', e => {
      stopPropagation(e)
    })
    window.google.maps.event.addDomListener(infobox, 'mouseenter', e => {
      this.setState({
        mapOptions: {
          minZoom: 2,
          maxZoom: 16,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          gestureHandling: 'none'
        }
      })
    })
    window.google.maps.event.addDomListener(infobox, 'mouseleave', e => {
      this.setState({
        mapOptions: {
          minZoom: 2,
          maxZoom: 16,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          gestureHandling: 'cooperative'
        }
      })
    })
  }

  // CLOSE BOX BUT SEARCH MARKERS STILL MOUNTED
  closeSearchPopup () {
    this.setState({
      isSearchInfoBoxOpen: false,
      eventType: '',
      mapOptions: {
        minZoom: 2,
        maxZoom: 16,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        gestureHandling: 'cooperative'
      }
    })
  }

  changeEventType (type) {
    this.setState({eventType: type})
  }

  // on first mount (props.events has already been passed)
  componentDidMount () {
    // console.log('on map mount', this.props)
    this.setState({allEvents: this.props.events})

    // extract locations to plot. eventsArrObj
    // modelId: int, eventType: str, day: int, start:bool, location: obj, row: event
    var eventsArr = this.props.events.map(e => {
      var temp = {
        modelId: e.modelId,
        eventType: e.type,
        day: e.day,
        start: e.start,
        event: e[`${e.type}`] // Activity/Flight etc
      }
      let location
      if (e.type === 'Activity' || e.type === 'Food' || e.type === 'Lodging') {
        location = e[`${e.type}`].location
      } else if (e.type === 'LandTransport' || e.type === 'SeaTransport' || e.type === 'Train') {
        if (e.start) {
          location = e[`${e.type}`].departureLocation
        } else {
          location = e[`${e.type}`].arrivalLocation
        }
      } else if (e.type === 'Flight') {
        if (e.start) {
          location = e.Flight.FlightInstance.departureLocation
        } else {
          location = e.Flight.FlightInstance.arrivalLocation
        }
      }

      temp.location = location
      return temp
    })
    console.log('manipulated events arr', eventsArr)
    this.setState({eventsArr: eventsArr})

    // default filter is all days
    // console.log('daysArr', this.props.daysArr)
    // this.setState({daysFilter: this.props.daysArr})

    // testing plannerMarkers with only some days
    this.setState({daysFilter: [1, 2]}, () => {
      this.applyDaysFilter()
    })
  }

  applyDaysFilter () {
    var plannerMarkers = this.state.eventsArr.filter(e => {
      return this.state.daysFilter.includes(e.day)
    })
    this.setState({plannerMarkers: plannerMarkers}, () => {
      if (!plannerMarkers.length && this.state.searchMarkers.length) {
        // if planner no, search yes
        console.log('no planner markers, but search is open')
        this.refitBounds(this.state.searchMarkers, 'search')
      } else {
        // if planner yes
        this.refitBounds(this.state.plannerMarkers, 'planner')
      }
    })
  }

  // componentWillReceiveProps (nextProps) {
  //   console.log('on map receive next props', nextProps)
  //   if (this.props.events !== nextProps.events) {
  //     console.log('events arr', nextProps.events)
  //   }
  // }

  changeDayCheckbox (e) {
    var clickedDay = parseInt(e.target.value)

    var daysFilter = JSON.parse(JSON.stringify(this.state.daysFilter))

    if (daysFilter.includes(clickedDay)) {
      var newDaysArr = daysFilter.filter(e => {
        return e !== clickedDay
      })
    } else {
      newDaysArr = daysFilter.concat([clickedDay])
    }
    this.setState({daysFilter: newDaysArr}, () => {
      // after changing days filter, reapplying filter on markers
      this.applyDaysFilter()
    })
  }

  // refit bounds may be used to refit planner markers (days filter), or call to manually focus on planner, search, bucket?. (set bounds, center, zoom?)

  // by default all planner events are plotted

  // planner yes, search yes. focus whichever was clicked. add toggle buttons to focus either, or both
  // planner yes, search no (focus planner)
  // planner no, search yes (focus search)
  // planner no, search no (no change, just clear markers)

  // refitBounds only takes 1 type!
  refitBounds (markerArr, type) {
    console.log('refit bounds type', type)
    if (!markerArr.length) return
    if (type === 'planner') {
      var newBounds = new window.google.maps.LatLngBounds()
      // loops through markers n add to newBounds
      // console.log('marker arr', markerArr)
      markerArr.forEach(marker => {
        newBounds.extend({lat: marker.location.latitude, lng: marker.location.longitude})
      })
      // this.setState({bounds: newBounds})
      this.map.fitBounds(newBounds, 100)
    } else if (type === 'search') {
      // no planner markers, focus on search
      newBounds = new window.google.maps.LatLngBounds()
      console.log('searchMarker arr', this.state.searchMarkers)
      this.state.searchMarkers.forEach(marker => {
        newBounds.extend({lat: marker.position.lat(), lng: marker.position.lng()})
      })
      this.map.fitBounds(newBounds, 100)
    }
  }

  focusSearchMarkers () {
    this.refitBounds(this.state.searchMarkers, 'search')
  }

  focusPlannerMarkers () {
    this.refitBounds(this.state.plannerMarkers, 'planner')
  }

  fitBothSearchPlannerMarkers () {
    var newBounds = new window.google.maps.LatLngBounds()
    this.state.searchMarkers.forEach(marker => {
      newBounds.extend({lat: marker.position.lat(), lng: marker.position.lng()})
    })
    this.state.plannerMarkers.forEach(marker => {
      newBounds.extend({lat: marker.location.latitude, lng: marker.location.longitude})
    })
    this.map.fitBounds(newBounds, 100)
  }

  render () {
    return (
      <GoogleMap ref={node => { this.map = node }}
        center={this.state.center}
        zoom={this.state.zoom} onBoundsChanged={() => this.onBoundsChanged()}
        options={this.state.mapOptions}
      >
        {/* CLOSE MAP */}
        <CustomControl controlPosition={window.google.maps.ControlPosition.RIGHT_TOP}>
          <button onClick={() => this.props.returnToPlanner()} style={{boxSizing: 'border-box', border: '1px solid transparent', borderRadius: '3px', boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: 'none', height: '30px', marginTop: '10px', marginRight: '10px'}}>X</button>
        </CustomControl>

        {/* FILTERS */}
        <CustomControl controlPosition={window.google.maps.ControlPosition.LEFT_TOP}>
          <div style={{boxSizing: 'border-box', border: '1px solid transparent', borderRadius: '3px', boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: 'none', width: '150px', marginTop: '10px', marginLeft: '10px', padding: `12px`, background: 'white'}} >
            {this.props.daysArr.map((day, i) => {
              return (
                <label style={{display: 'block', fontSize: '18px'}} key={`day${i}`}>
                  <input type='checkbox' style={{width: '20px', height: '20px'}} checked={this.state.daysFilter.includes(day)} onChange={(e) => this.changeDayCheckbox(e)} value={day} />
                  Day {day}
                </label>
              )
            })}
            <hr style={{margin: '5px'}} />
            <label style={{display: 'block', fontSize: '18px'}}>
              <input type='checkbox' style={{width: '20px', height: '20px'}} />
              Bucket
            </label>
          </div>
        </CustomControl>

        {/* REFITBOUNDS TOGGLE BWTN SEARCH/PLANNER/ALL. HOW TO DEAL WITH BUCKET!!! */}
        {this.state.plannerMarkers.length && this.state.searchMarkers.length &&
          <CustomControl controlPosition={window.google.maps.ControlPosition.RIGHT_BOTTOM}>
            <div style={{boxSizing: 'border-box', border: '1px solid transparent', borderRadius: '3px', boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: 'none', width: '100px', marginTop: '10px', marginRight: '10px', background: 'white'}}>
              <button style={{display: 'block', width: '100%'}} onClick={() => this.focusSearchMarkers()}>Focus search</button>
              <button style={{display: 'block', width: '100%'}} onClick={() => this.focusPlannerMarkers()}>Focus planner</button>
              <button style={{display: 'block', width: '100%'}} onClick={() => this.fitBothSearchPlannerMarkers()}>Fit all</button>
            </div>
          </CustomControl>
        }

        <SearchBox ref={node => { this.searchBox = node }} bounds={this.state.bounds} controlPosition={window.google.maps.ControlPosition.TOP_LEFT} onPlacesChanged={() => this.onPlacesChanged()} >
          <div>
            <input ref={node => { this.searchInput = node }} type='text' placeholder='Search for location' style={{boxSizing: `border-box`, border: `1px solid transparent`, width: `300px`, height: `30px`, marginTop: `10px`, marginLeft: '10px', padding: `0 12px`, borderRadius: `3px`, boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: `none`, textOverflow: `ellipses`}} />
            <button onClick={() => this.clearSearch()} style={{boxSizing: 'border-box', border: '1px solid transparent', borderRadius: '3px', boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, fontSize: `14px`, outline: 'none', height: '30px', marginLeft: '10px'}}>Clear</button>
          </div>
        </SearchBox>

        {/* SEARCH MARKERS WITH CREATEEVENT POPUP */}
        {this.state.searchMarkers.map((marker, index) => {
          return (
            <Marker key={index} position={marker.position} onClick={() => this.onSearchMarkerClicked(index)}>
              {this.state.isSearchInfoBoxOpen && this.state.clickedSearchMarkerIndex === index &&
                <InfoBox ref={node => { this.infoBox = node }} options={{closeBoxURL: ``, enableEventPropagation: true}} onDomReady={() => this.onInfoBoxDomReady()} >
                  <div style={{position: 'relative', background: 'white', width: '384px', height: '243px', padding: '10px'}} id='infobox'>
                    <div style={{position: 'absolute', right: '0', top: '0', padding: '5px'}}>
                      <i className='material-icons'>location_on</i>
                      <i className='material-icons'>delete</i>
                    </div>
                    <div>
                      <MapCreateEventPopup eventType={this.state.eventType} ItineraryId={this.props.ItineraryId} closeSearchPopup={() => this.closeSearchPopup()} changeEventType={type => this.changeEventType(type)} />
                    </div>
                  </div>
                </InfoBox>
              }
            </Marker>
          )
        })}

        {this.state.plannerMarkers.map((event, index) => {
          return (
            <Marker key={index} position={{lat: event.location.latitude, lng: event.location.longitude}} />
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
    var itineraryId = this.props.match.params.itineraryId
    this.props.history.push(`/planner/${itineraryId}`)
  }

  render () {
    return (
      <MapPlanner daysArr={this.props.daysArr} events={this.props.events} returnToPlanner={() => this.returnToPlanner()} googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&v=3.31&libraries=geometry,drawing,places`} loadingElement={<div style={{ height: `100%` }} />} containerElement={<div style={{ height: `100%` }} />} mapElement={<div style={{ height: `100%` }} />} />
    )
  }
}

export default withRouter(MapPlannerHOC)
