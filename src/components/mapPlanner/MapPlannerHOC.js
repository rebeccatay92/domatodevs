import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps'
import SearchBox from 'react-google-maps/lib/components/places/SearchBox'
import CustomControl from '../location/CustomControl'
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox'
import MarkerWithLabel from 'react-google-maps/lib/components/addons/MarkerWithLabel'

import MapCreateEventPopup from './MapCreateEventPopup'

const _ = require('lodash')

const unclickedMarkerSize = {width: '40px', height: '40px'}
const clickedMarkerSize = {width: '60px', height: '60px'}

const clickedSearchMarkerStyle = {borderRadius: '50%', border: '3px solid red', boxShadow: '0 0 0 3px white', backgroundColor: 'red', cursor: 'pointer'}
const unclickedSearchMarkerStyle = {borderRadius: '50%', border: '3px solid red', backgroundColor: 'red', cursor: 'pointer'}
const clickedPlannerMarkerStyle = {borderRadius: '50%', border: '3px solid orange', boxShadow: '0 0 0 3px white', backgroundColor: 'orange'}
const unclickedPlannerMarkerStyle = {borderRadius: '50%', border: '3px solid orange', backgroundColor: 'orange'}

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
        gestureHandling: 'cooperative',
        clickableIcons: false
      },
      daysFilter: [], // arr of days to show eg [1,2,5]
      allEvents: [], // entire this.props.events arr
      eventsArr: [], // manipulated arr to extract location
      searchMarkers: [],
      plannerMarkers: [], // filtered planner markers. eg markers for days 1,2,5
      isSearchInfoBoxOpen: false,
      clickedSearchMarkerIndex: null,
      isPlannerInfoBoxOpen: false,
      clickedPlannerMarkerIndex: null,
      eventType: '' // activity, food, lodging, transport
    }
  }

  onBoundsChanged () {
    if (!this.map) return
    // if bounds dont change, zoom and center also wont change. dont rerender extra
    if (this.state.bounds === this.map.getBounds()) return
    // console.log('bounds changed (not same)')
    this.setState({
      bounds: this.map.getBounds(),
      center: {lat: this.map.getCenter().lat(), lng: this.map.getCenter().lng()},
      zoom: this.map.getZoom()
      // sync the zoom in state with map's actual zoom
    })
  }

  onPlacesChanged () {
    if (!this.searchBox) return
    //  clear out old clicked state
    this.setState({
      eventType: '',
      isSearchInfoBoxOpen: false,
      clickedSearchMarkerIndex: null
    })

    const places = this.searchBox.getPlaces()
    const bounds = new window.google.maps.LatLngBounds()
    // console.log('places', places)
    if (places.length === 0) {
      console.log('no results')
      return
    }

    places.forEach(place => {
      if (place.photos) {
        var imageUrl = place.photos[0].getUrl({maxWidth: 200})
        place.imageUrl = imageUrl
      }
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
    } else {
      // if there were no search markers, clearing search should not rezoom on planner markers
      return
    }

    // if search was cleared, but planner has markers, refitBounds
    if (this.state.plannerMarkers.length) {
      this.refitBounds(this.state.plannerMarkers, 'planner')
    }
  }

  onSearchMarkerClicked (index) {
    var marker = this.state.searchMarkers[index]

    // this.map.panTo(marker.position)
    // this.setState({center: marker.position, zoom: 15})
    // this.setState({zoom: 15})

    // conditional zoom and center?
    if (this.state.zoom < 15) {
      this.map.panTo(marker.position)
      this.setState({center: marker.position, zoom: 15})
    } else if (this.state.zoom >= 15) {
      console.log('already zoomed in. just open')
    }

    // clear any clicked state for planner
    this.setState({
      eventType: '',
      isPlannerInfoBoxOpen: false,
      clickedPlannerMarkerIndex: null
    })

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
          gestureHandling: 'none',
          clickableIcons: false
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
          gestureHandling: 'cooperative',
          clickableIcons: false
        }
      })
    })
  }

  // CLOSE BOX BUT SEARCH MARKERS STILL MOUNTED
  closeSearchPopup () {
    this.setState({
      isSearchInfoBoxOpen: false,
      clickedSearchMarkerIndex: null,
      eventType: '',
      mapOptions: {
        minZoom: 2,
        maxZoom: 16,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        gestureHandling: 'cooperative',
        clickableIcons: false
      }
    })
  }

  changeEventType (type) {
    this.setState({eventType: type})
  }

  // on first mount (props.events has already been passed)
  componentDidMount () {
    // console.log('on map mount', this.props)
    // this.setState({allEvents: this.props.events})

    // extract locations to plot. eventsArrObj
    // modelId: int, eventType: str, day: int, start:bool, location: obj, row: eventType
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
      temp.imageUrl = location.imageUrl
      return temp
    })

    this.setState({
      allEvents: this.props.events,
      eventsArr: eventsArr,
      daysFilter: []
    }, () => {
      this.applyDaysFilter()
    })
  }

  applyDaysFilter () {
    var plannerMarkers = this.state.eventsArr.filter(e => {
      return this.state.daysFilter.includes(e.day)
    })
    this.setState({
      plannerMarkers: plannerMarkers,
      eventType: '',
      isPlannerInfoBoxOpen: false,
      clickedPlannerMarkerIndex: null
    }, () => {
      if (!plannerMarkers.length && this.state.searchMarkers.length) {
        this.refitBounds(this.state.searchMarkers, 'search')
      } else {
        this.refitBounds(this.state.plannerMarkers, 'planner')
      }
    })
  }

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

  // refitBounds only takes 1 type
  refitBounds (markerArr, type) {
    if (!markerArr.length) return
    // console.log('refit bounds')
    if (type === 'planner') {
      var newBounds = new window.google.maps.LatLngBounds()
      markerArr.forEach(marker => {
        newBounds.extend({lat: marker.location.latitude, lng: marker.location.longitude})
      })
      this.map.fitBounds(newBounds, 100)
    } else if (type === 'search') {
      newBounds = new window.google.maps.LatLngBounds()
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

  onPlannerMarkerClicked (index) {
    // clear clicked state in search
    this.setState({
      eventType: '',
      isSearchInfoBoxOpen: false,
      clickedSearchMarkerIndex: null
    })

    var marker = this.state.plannerMarkers[index]
    this.map.panTo({lat: marker.location.latitude, lng: marker.location.longitude})
    this.setState({center: {lat: marker.location.latitude, lng: marker.location.longitude}})
    this.setState({zoom: 15})
    // zoom but dont center the clicked marker?
    if (this.state.clickedPlannerMarkerIndex !== index) {
      this.setState({
        eventType: marker.eventType,
        isPlannerInfoBoxOpen: true,
        clickedPlannerMarkerIndex: index
      })
    } else {
      this.setState({
        eventType: '',
        isPlannerInfoBoxOpen: false,
        clickedPlannerMarkerIndex: null
      })
    }
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

        {this.state.searchMarkers.length && this.state.searchMarkers.map((marker, index) => {
          return (
            <MarkerWithLabel ref={node => { this.searchMarker = node }} key={index} position={marker.position} opacity={0} labelAnchor={this.state.clickedSearchMarkerIndex === index ? new window.google.maps.Point(30, 30) : new window.google.maps.Point(20, 20)} labelStyle={this.state.clickedSearchMarkerIndex === index ? clickedSearchMarkerStyle : unclickedSearchMarkerStyle} onClick={() => this.onSearchMarkerClicked(index)} zIndex={this.state.clickedSearchMarkerIndex === index ? 2 : 1}>
              <div>
                <div style={this.state.clickedSearchMarkerIndex === index ? clickedMarkerSize : unclickedMarkerSize}>
                  {marker.place.imageUrl &&
                    <img width='100%' height='100%' src={marker.place.imageUrl} />
                  }
                  {!marker.place.imageUrl &&
                    <div style={{width: '100%', height: '100%', background: 'white'}} />
                  }
                </div>
                {this.state.isSearchInfoBoxOpen && this.state.clickedSearchMarkerIndex === index &&
                <InfoBox ref={node => { this.infoBox = node }} position={marker.position} options={{ closeBoxURL: ``, enableEventPropagation: true, boxStyle: {width: '384px', height: '243px', position: 'relative', background: 'white', padding: '10px'}, pixelOffset: new window.google.maps.Size(-192, 60), infoBoxClearance: new window.google.maps.Size(170, 170) }} onDomReady={() => this.onInfoBoxDomReady()}>
                  <div id='infobox'>
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
              </div>
            </MarkerWithLabel>
          )
        })}

        {this.state.plannerMarkers.length && this.state.plannerMarkers.map((event, index) => {
          return (
            <MarkerWithLabel key={index} position={{lat: event.location.latitude, lng: event.location.longitude}} opacity={0} labelAnchor={this.state.clickedPlannerMarkerIndex === index ? new window.google.maps.Point(30, 30) : new window.google.maps.Point(20, 20)} labelStyle={this.state.clickedPlannerMarkerIndex === index ? clickedPlannerMarkerStyle : unclickedPlannerMarkerStyle} onClick={() => this.onPlannerMarkerClicked(index)} zIndex={this.state.clickedPlannerMarkerIndex === index ? 2 : 1}>
              <div style={this.state.clickedPlannerMarkerIndex === index ? clickedMarkerSize : unclickedMarkerSize}>
                {event.imageUrl &&
                  <img width='100%' height='100%' src={event.imageUrl} />
                }
                {!event.imageUrl &&
                  <div style={{width: '100%', height: '100%', background: 'white'}} />
                }
              </div>
            </MarkerWithLabel>
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
