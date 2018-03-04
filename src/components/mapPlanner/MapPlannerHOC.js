import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { toggleDaysFilter, setCurrentlyFocusedEvent, clearCurrentlyFocusedEvent } from '../../actions/mapPlannerActions'

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
        maxZoom: 17,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        clickableIcons: false
      },
      allEvents: [], // entire this.props.events arr
      eventsArr: [], // manipulated arr to extract location
      searchMarkers: [],
      plannerMarkers: [], // filtered planner markers. eg markers for days 1,2,5
      isSearchInfoBoxOpen: false,
      clickedSearchMarkerIndex: null,
      isPlannerInfoBoxOpen: false,
      clickedPlannerMarkerIndex: null
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
    this.map.fitBounds(bounds, 150)
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
    // clear planner focusEvent if any
    this.props.clearCurrentlyFocusedEvent()

    // force redraw infoBoxClearance for searchInfoBox
    this.setState({
      isSearchInfoBoxOpen: false
    })

    if (this.state.clickedSearchMarkerIndex !== index) {
      this.setState({
        isSearchInfoBoxOpen: true,
        clickedSearchMarkerIndex: index
      })
    } else {
      this.setState({
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
    // window.google.maps.event.addDomListener(infobox, 'mouseenter', e => {
    //   this.setState({
    //     mapOptions: {
    //       minZoom: 2,
    //       maxZoom: 17,
    //       fullscreenControl: false,
    //       mapTypeControl: false,
    //       streetViewControl: false,
    //       clickableIcons: false
    //     }
    //   })
    // })
    // window.google.maps.event.addDomListener(infobox, 'mouseleave', e => {
    //   this.setState({
    //     mapOptions: {
    //       minZoom: 2,
    //       maxZoom: 17,
    //       fullscreenControl: false,
    //       mapTypeControl: false,
    //       streetViewControl: false,
    //       clickableIcons: false
    //     }
    //   })
    // })
  }

  // CLOSE BOX BUT SEARCH MARKERS STILL MOUNTED
  closeSearchPopup () {
    this.setState({
      isSearchInfoBoxOpen: false,
      clickedSearchMarkerIndex: null
      // mapOptions: {
      //   minZoom: 2,
      //   maxZoom: 17,
      //   fullscreenControl: false,
      //   mapTypeControl: false,
      //   streetViewControl: false,
      //   clickableIcons: false
      // }
    })
  }

  // constructs obj structure. no marker position offseting
  constructEventsArrFromPropsEvents (propsEventsArr) {
    // extract locations to plot. eventsArrObj
    // modelId: id, eventType: str, flightInstanceId: id, day: int, start:bool, location: obj, row: eventType
    // modelId is FlightBookingId and eventType is Flight
    var eventsArr = propsEventsArr.map(e => {
      var temp = {
        modelId: e.modelId,
        eventType: e.type,
        // flightInstanceId is extra differentiator because modelId=FlightBookingId, eventType=Flight refers to multiple rows/markers.
        flightInstanceId: e.type === 'Flight' ? e.Flight.FlightInstance.id : null,
        day: e.day,
        loadSequence: e.loadSequence,
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
    return eventsArr
  }

  componentDidMount () {
    var eventsArr = this.constructEventsArrFromPropsEvents(this.props.events)
    // console.log('eventsArr before marker offset', eventsArr)

    var comparisonArr = []
    var finalEventsArr = eventsArr.map(event => {
      var position = {latitude: event.location.latitude, longitude: event.location.longitude}

      // use lodash check uniqueness of positions
      var positionMatch = _.find(comparisonArr, function (e) {
        return (e.latitude === position.latitude && e.longitude === position.longitude)
      })

      if (!positionMatch) {
        comparisonArr.push(position)
        event.displayPosition = position
      } else {
        var offsetPosition = {
          latitude: position.latitude + 0.0001 * Math.floor(Math.random() * (5 - (-5)) + (-5)),
          longitude: position.longitude + 0.0001 * Math.floor(Math.random() * (5 - (-5)) + (-5))
        }
        comparisonArr.push(offsetPosition)
        event.displayPosition = offsetPosition
      }
      return event
    })
    console.log('final events arr', finalEventsArr)

    this.setState({
      allEvents: this.props.events,
      eventsArr: finalEventsArr
    }, () => {
      this.applyDaysFilter(this.props.daysFilterArr)
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.daysFilterArr !== this.props.daysFilterArr) {
      this.applyDaysFilter(nextProps.daysFilterArr)
    }
    if (nextProps.currentlyFocusedEvent !== this.props.currentlyFocusedEvent) {
      // focus marker has changed. set isPlannerInfoBoxOpen and clickedPlannerMarkerIndex.
      var focus = nextProps.currentlyFocusedEvent
      // console.log('focus', focus)
      // force redraw on infoBoxClearance
      this.setState({isPlannerInfoBoxOpen: false})
      if (focus.modelId) {
        // find plannerMarkerIndex
        var foundIndex = this.state.plannerMarkers.findIndex(e => {
          return (e.modelId === focus.modelId && e.eventType === focus.eventType && e.flightInstanceId === focus.flightInstanceId && e.day === focus.day && e.start === focus.start && e.loadSequence === focus.loadSequence)
        })
        this.setState({
          isPlannerInfoBoxOpen: true,
          clickedPlannerMarkerIndex: foundIndex
        })
      } else {
        this.setState({
          isPlannerInfoBoxOpen: false,
          clickedPlannerMarkerIndex: null
        })
      }
    }
    if (nextProps.events !== this.props.events) {
      var stillDragging = _.find(nextProps.events, function (e) {
        return (e.fromReducer)
      })
      if (!stillDragging) {
        // console.log('nextProps', nextProps.events)
        var eventsArr = this.constructEventsArrFromPropsEvents(nextProps.events)

        var comparisonArr = []
        var finalEventsArr = eventsArr.map(event => {
          var position = {latitude: event.location.latitude, longitude: event.location.longitude}

          // use lodash check uniqueness of positions
          var positionMatch = _.find(comparisonArr, function (e) {
            return (e.latitude === position.latitude && e.longitude === position.longitude)
          })

          if (!positionMatch) {
            comparisonArr.push(position)
            event.displayPosition = position
          } else {
            var offsetPosition = {
              latitude: position.latitude + 0.0001 * Math.floor(Math.random() * (5 - (-5)) + (-5)),
              longitude: position.longitude + 0.0001 * Math.floor(Math.random() * (5 - (-5)) + (-5))
            }
            comparisonArr.push(offsetPosition)
            event.displayPosition = offsetPosition
          }
          return event
        })
        console.log('final events arr', finalEventsArr)

        this.setState({
          allEvents: nextProps.events,
          eventsArr: finalEventsArr
        }, () => {
          this.applyDaysFilter(nextProps.daysFilterArr)
        })
      }
    }
  }

  applyDaysFilter (daysFilterArr) {
    var plannerMarkers = this.state.eventsArr.filter(e => {
      return daysFilterArr.includes(e.day)
    })
    this.setState({
      plannerMarkers: plannerMarkers
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
    // if unchecking a day, and focusEvent is inside. clear the focusevent.
    if (this.props.currentlyFocusedEvent.day === clickedDay) {
      this.props.clearCurrentlyFocusedEvent()
    }
    this.props.toggleDaysFilter(clickedDay)
  }

  // refitBounds only takes 1 type
  refitBounds (markerArr, type) {
    if (!markerArr.length) return
    if (type === 'planner') {
      var newBounds = new window.google.maps.LatLngBounds()
      markerArr.forEach(marker => {
        newBounds.extend({lat: marker.location.latitude, lng: marker.location.longitude})
      })
      this.map.fitBounds(newBounds, 150)
    } else if (type === 'search') {
      newBounds = new window.google.maps.LatLngBounds()
      this.state.searchMarkers.forEach(marker => {
        newBounds.extend({lat: marker.position.lat(), lng: marker.position.lng()})
      })
      this.map.fitBounds(newBounds, 150)
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
    this.map.fitBounds(newBounds, 150)
  }

  onPlannerMarkerClicked (index) {
    // clear clicked state in search
    this.setState({
      isSearchInfoBoxOpen: false,
      clickedSearchMarkerIndex: null
    })
    var marker = this.state.plannerMarkers[index]

    if (this.state.clickedPlannerMarkerIndex !== index) {
      // construct currentEventObj and dispatch setCurrentlyFocusedEvent
      var currentEventObj = {
        modelId: marker.modelId,
        eventType: marker.eventType,
        flightInstanceId: marker.flightInstanceId,
        day: marker.day,
        start: marker.start,
        loadSequence: marker.loadSequence
      }
      this.props.setCurrentlyFocusedEvent(currentEventObj)
    } else {
      // clicking on a focused marker will toggle it to off state. dispatch clear focus event
      this.props.clearCurrentlyFocusedEvent()
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
                  <input type='checkbox' style={{width: '20px', height: '20px'}} checked={this.props.daysFilterArr.includes(day)} onChange={(e) => this.changeDayCheckbox(e)} value={day} />
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
              </div>
            </MarkerWithLabel>
          )
        })}

        {this.state.isSearchInfoBoxOpen &&
          <InfoBox ref={node => { this.infoBox = node }} position={this.state.searchMarkers[this.state.clickedSearchMarkerIndex].position} options={{ closeBoxURL: ``, enableEventPropagation: true, pixelOffset: new window.google.maps.Size(-192, 60), infoBoxClearance: new window.google.maps.Size(170, 170) }} onDomReady={() => this.onInfoBoxDomReady()}>
            <div id='infobox' style={{width: '384px', height: '243px', position: 'relative', background: 'white', padding: '10px', boxShadow: '0px 2px 5px 2px rgba(0, 0, 0, .2)'}}>
              <div style={{position: 'absolute', right: '0', top: '0', padding: '5px'}}>
                <i className='material-icons'>location_on</i>
                <i className='material-icons'>delete</i>
              </div>
              <MapCreateEventPopup ItineraryId={this.props.ItineraryId} placeId={this.state.searchMarkers[this.state.clickedSearchMarkerIndex].place.place_id} daysArr={this.props.daysArr} datesArr={this.props.datesArr} closeSearchPopup={() => this.closeSearchPopup()} />
            </div>
          </InfoBox>
        }

        {this.state.plannerMarkers.length && this.state.plannerMarkers.map((event, index) => {
          return (
            <MarkerWithLabel key={index} position={{lat: event.displayPosition.latitude, lng: event.displayPosition.longitude}} opacity={0} labelAnchor={this.state.clickedPlannerMarkerIndex === index ? new window.google.maps.Point(30, 30) : new window.google.maps.Point(20, 20)} labelStyle={this.state.clickedPlannerMarkerIndex === index ? clickedPlannerMarkerStyle : unclickedPlannerMarkerStyle} onClick={() => this.onPlannerMarkerClicked(index)} zIndex={this.state.clickedPlannerMarkerIndex === index ? 2 : 1}>
              <div>
                <div style={this.state.clickedPlannerMarkerIndex === index ? clickedMarkerSize : unclickedMarkerSize}>
                  {event.imageUrl &&
                    <img width='100%' height='100%' src={event.imageUrl} />
                  }
                  {!event.imageUrl &&
                    <div style={{width: '100%', height: '100%', background: 'white'}} />
                  }
                </div>
              </div>
            </MarkerWithLabel>
          )
        })}

        {this.state.isPlannerInfoBoxOpen &&
          <InfoBox ref={node => { this.infoBox = node }} position={new window.google.maps.LatLng(this.state.plannerMarkers[this.state.clickedPlannerMarkerIndex].displayPosition.latitude, this.state.plannerMarkers[this.state.clickedPlannerMarkerIndex].displayPosition.longitude)} options={{ closeBoxURL: ``, enableEventPropagation: true, boxStyle: {width: '384px', height: '243px', position: 'relative', background: 'white', padding: '10px'}, pixelOffset: new window.google.maps.Size(-192, 60), infoBoxClearance: new window.google.maps.Size(170, 170) }} onDomReady={() => this.onInfoBoxDomReady()}>
            <div id='infobox'>
              <div style={{position: 'absolute', right: '0', top: '0', padding: '5px'}}>
                <i className='material-icons'>location_on</i>
                <i className='material-icons'>delete</i>
              </div>
            </div>
          </InfoBox>
        }
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
      <MapPlanner ItineraryId={this.props.ItineraryId} daysArr={this.props.daysArr} datesArr={this.props.datesArr} events={this.props.events} daysFilterArr={this.props.mapPlannerDaysFilterArr} currentlyFocusedEvent={this.props.currentlyFocusedEvent} toggleDaysFilter={dayInt => this.props.toggleDaysFilter(dayInt)} setCurrentlyFocusedEvent={currentEventObj => this.props.setCurrentlyFocusedEvent(currentEventObj)} clearCurrentlyFocusedEvent={() => this.props.clearCurrentlyFocusedEvent()} returnToPlanner={() => this.returnToPlanner()} googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&v=3.31&libraries=geometry,drawing,places`} loadingElement={<div style={{ height: `100%` }} />} containerElement={<div style={{ height: `100%` }} />} mapElement={<div style={{ height: `100%` }} />} />
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleDaysFilter: (dayInt) => {
      dispatch(toggleDaysFilter(dayInt))
    },
    setCurrentlyFocusedEvent: (currentEventObj) => {
      dispatch(setCurrentlyFocusedEvent(currentEventObj))
    },
    clearCurrentlyFocusedEvent: () => {
      dispatch(clearCurrentlyFocusedEvent())
    }
  }
}
const mapStateToProps = (state) => {
  return {
    mapPlannerDaysFilterArr: state.mapPlannerDaysFilterArr,
    currentlyFocusedEvent: state.currentlyFocusedEvent
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MapPlannerHOC))
