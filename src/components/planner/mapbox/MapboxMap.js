import React, { Component } from 'react'
import ReactMapboxGL, { ZoomControl, Marker, Popup } from 'react-mapbox-gl'
import mapboxgl from 'mapbox-gl'
import LocationCellDropdown from '../LocationCellDropdown'

import { connect } from 'react-redux'
import { clickDayCheckbox, ensureDayIsChecked, setPopupToShow } from '../../../actions/planner/mapboxActions'
import { updateActiveEvent } from '../../../actions/planner/activeEventActions'
import { setRightBarFocusedTab } from '../../../actions/planner/plannerViewActions'
import { updateEvent } from '../../../actions/planner/eventsActions'

import { graphql, compose } from 'react-apollo'
import { updateEventBackend, createEvent } from '../../../apollo/event'
import { queryItinerary } from '../../../apollo/itinerary'

import { createNewEventSequence } from '../../../helpers/plannerLoadSequence'

import _ from 'lodash'
import { Editor, EditorState, ContentState } from 'draft-js'

import { MapboxMapStyles as styles } from '../../../Styles/MapboxMapStyles'

// react wrapper factory
const Map = ReactMapboxGL({
  accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
  minZoom: 1,
  dragRotate: false,
  attributionControl: false,
  logoPosition: 'bottom-right'
})

const mapStyle = 'mapbox://styles/mapbox/streets-v10'

class MapboxMap extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchInputField: '',
      showDropdown: false,
      showSpinner: false,
      predictions: [],
      center: [0, 0], // lng/lat in that order to match GeoJSON
      zoom: [1],
      containerStyle: {
        height: 'calc(100vh - 52px - 51px)',
        width: 'calc(100vw - 376px)' // has to start with larger version. if smaller, changing containerStyle does not fetch more tiles
      },
      eventMarkersToDisplay: [],
      searchMarker: null, // obj holding locationData
      plottingCustomMarker: false,
      customMarker: null
    }
    this.queryGooglePlacesAutoSuggest = _.debounce(this.queryGooglePlacesAutoSuggest, 500)
  }

  onSearchInputChange (e) {
    let queryStr = e.target.value
    this.setState({
      searchInputField: queryStr,
      showDropdown: true,
      showSpinner: true,
      predictions: []
    })
    this.queryGooglePlacesAutoSuggest(queryStr)
  }

  clearSearch () {
    this.setState({
      searchInputField: '',
      showDropdown: false,
      showSpinner: false,
      predictions: [],
      searchMarker: null
    })
  }

  queryGooglePlacesAutoSuggest (queryStr) {
    if (queryStr.length <= 2) {
      this.setState({
        showDropdown: false,
        showSpinner: false,
        predictions: []
      })
      return
    }
    console.log('query google with', queryStr)

    let crossOriginUrl = `https://cors-anywhere.herokuapp.com/`
    let googlePlacesEndpoint = `${crossOriginUrl}https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${process.env.REACT_APP_GOOGLE_API_KEY}&language=en&input=${queryStr}`

    fetch(googlePlacesEndpoint)
      .then(response => {
        return response.json()
      })
      .then(json => {
        console.log('places response', json.predictions)
        this.setState({
          predictions: json.predictions,
          showSpinner: false
        })
      })
      .catch(err => {
        console.log('err', err)
      })
  }

  // handles search dropdown click outside
  handleClickOutside () {
    this.setState({
      showDropdown: false,
      showSpinner: false,
      predictions: []
    })
  }

  selectLocation (prediction) {
    // fetch place details (name, address, latlng).
    let placeId = prediction.place_id
    let crossOriginUrl = `https://cors-anywhere.herokuapp.com/`
    let placeDetailsEndpoint = `${crossOriginUrl}https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.REACT_APP_GOOGLE_API_KEY}&language=en&&placeid=${placeId}`

    fetch(placeDetailsEndpoint)
      .then(response => {
        return response.json()
      })
      .then(json => {
        console.log('place result', json.result)
        let result = json.result
        let latitude = result.geometry.location.lat
        let longitude = result.geometry.location.lng
        let address = result.formatted_address
        let name = result.name
        let countryCode
        let addressComponent = json.result.address_components.find(e => {
          return e.types.includes('country')
        })
        if (addressComponent) {
          countryCode = addressComponent.short_name
        }

        // let nameContentState = ContentState.createFromText(name)
        let locationObj = {
          verified: true,
          name: name,
          address: address,
          latitude: latitude,
          longitude: longitude,
          countryCode: countryCode
        }

        this.setState({
          searchInputField: name,
          showDropdown: false,
          showSpinner: false,
          predictions: [],
          searchMarker: locationObj,
          center: [locationObj.longitude, locationObj.latitude]
        }, () => {
          this.props.setPopupToShow('search')
        })
      })
      .catch(err => {
        console.log('err', err)
      })
  }

  // synx state with map's final zoom and center
  onMapMoveEnd (map, evt) {
    this.setState({
      zoom: [map.getZoom()],
      center: [map.getCenter().lng, map.getCenter().lat]
    }, () => {
      // console.log('updated state after move-end', this.state)
    })
  }

  componentDidMount () {
    // check if rightBar is displayed
    if (this.props.plannerView.rightBar) {
      // console.log('active event. right bar is open, map needs to shrink')
      this.setState({
        containerStyle: {
          ...this.state.containerStyle,
          width: 'calc(100vw - 376px - 344px)'
        }
      })
    }

    // extract markers in days filter, and hv location. offset markers with identical latlong. put latitudeDisplay and longitudeDisplay inside event obj. (but outside of locationObj)
    let daysToShow = this.props.mapbox.daysToShow
    let eventsInVisibleDays = this.props.events.events.filter(e => {
      return daysToShow.includes(e.startDay)
    })
    let eventsToShow = eventsInVisibleDays.filter(e => {
      if (e.locationObj) {
        return e.locationObj.latitude
      } else {
        return false
      }
    })
    let comparisonArr = []
    let eventsWithOffsetGeometry = eventsToShow.map(event => {
      let position = {
        latitude: event.locationObj.latitude,
        longitude: event.locationObj.longitude
      }
      let positionMatched = _.find(comparisonArr, e => {
        return (e.latitude === position.latitude && e.longitude === position.longitude)
      })
      if (!positionMatched) {
        comparisonArr.push(position)
        event.latitudeDisplay = position.latitude
        event.longitudeDisplay = position.longitude
      } else {
        let offsetPosition = {
          latitude: position.latitude + 0.0001 * Math.floor(Math.random() * (3 - (-3)) + (-3)),
          longitude: position.longitude + 0.0001 * Math.floor(Math.random() * (3 - (-3)) + (-3))
        }
        comparisonArr.push(offsetPosition)
        event.latitudeDisplay = offsetPosition.latitude
        event.longitudeDisplay = offsetPosition.longitude
      }
      return event
    })
    this.setState({
      eventMarkersToDisplay: eventsWithOffsetGeometry
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.plannerView.rightBar !== this.props.plannerView.rightBar) {
      if (nextProps.plannerView.rightBar) {
        this.setState({
          containerStyle: {
            ...this.state.containerStyle,
            width: 'calc(100vw - 376px - 344px)'
          }
        })
      } else {
        // if rightBar is ''
        this.setState({
          containerStyle: {
            ...this.state.containerStyle,
            width: 'calc(100vw - 376px)'
          }
        })
      }
    }

    // if activeEventId changed (left bar clicked, or event marker clicked)
    if (nextProps.activeEventId !== this.props.activeEventId) {
      if (nextProps.activeEventId) {
        // console.log('next active event', nextProps.activeEventId)
        let thisEvent = nextProps.events.events.find(e => {
          return e.id === nextProps.activeEventId
        })
        if (thisEvent.longitudeDisplay && thisEvent.latitudeDisplay) {
          console.log('longitude', thisEvent.longitudeDisplay)
          // check if marker is already within the bounds
          let currentBounds = this.map.getBounds()
          console.log('currentBounds', currentBounds)

          let eventMarkerIsWithinBounds = (thisEvent.longitudeDisplay >= currentBounds._sw.lng && thisEvent.longitudeDisplay <= currentBounds._ne.lng) && (thisEvent.latitudeDisplay >= currentBounds._sw.lat && thisEvent.latitudeDisplay <= currentBounds._ne.lat)

          if (this.state.searchMarker && !this.state.customMarker) {
            // search marker exists
            let searchMarkerIsWithinBounds = (this.state.searchMarker.longitude >= currentBounds._sw.lng && this.state.searchMarker.longitude <= currentBounds._ne.lng) && (this.state.searchMarker.latitude >= currentBounds._sw.lat && this.state.searchMarker.latitude <= currentBounds._ne.lat)
            if (eventMarkerIsWithinBounds && searchMarkerIsWithinBounds) {
              let newCenter = this.calculateNewCenterToFitPopup(thisEvent.latitudeDisplay, thisEvent.longitudeDisplay)
              this.setState({center: newCenter})
            } else {
              // if either is out of bounds, setbounds to include both markers
              // console.log('mapboxgl', mapboxgl)
              let bounds = new mapboxgl.LngLatBounds()
              bounds.extend([this.state.searchMarker.longitude, this.state.searchMarker.latitude])
              bounds.extend([thisEvent.longitudeDisplay, thisEvent.latitudeDisplay])
              console.log('bounds', bounds)
              this.map.fitBounds(bounds, {padding: 200})
            }
          } else if (!this.state.searchMarker && this.state.customMarker) {
            let customMarkerIsWithinBounds = (this.state.customMarker.longitude >= currentBounds._sw.lng && this.state.customMarker.longitude <= currentBounds._ne.lng) && (this.state.customMarker.latitude >= currentBounds._sw.lat && this.state.customMarker.latitude <= currentBounds._ne.lat)
            if (eventMarkerIsWithinBounds && customMarkerIsWithinBounds) {
              let newCenter = this.calculateNewCenterToFitPopup(thisEvent.latitudeDisplay, thisEvent.longitudeDisplay)
              this.setState({center: newCenter})
            } else {
              // if either is out of bounds, setbounds to include both markers
              // console.log('mapboxgl', mapboxgl)
              let bounds = new mapboxgl.LngLatBounds()
              bounds.extend([this.state.customMarker.longitude, this.state.customMarker.latitude])
              bounds.extend([thisEvent.longitudeDisplay, thisEvent.latitudeDisplay])
              console.log('bounds', bounds)
              this.map.fitBounds(bounds, {padding: 200})
            }
          } else if (this.state.searchMarker && this.state.customMarker) {
            let searchMarkerIsWithinBounds = (this.state.searchMarker.longitude >= currentBounds._sw.lng && this.state.searchMarker.longitude <= currentBounds._ne.lng) && (this.state.searchMarker.latitude >= currentBounds._sw.lat && this.state.searchMarker.latitude <= currentBounds._ne.lat)
            let customMarkerIsWithinBounds = (this.state.customMarker.longitude >= currentBounds._sw.lng && this.state.customMarker.longitude <= currentBounds._ne.lng) && (this.state.customMarker.latitude >= currentBounds._sw.lat && this.state.customMarker.latitude <= currentBounds._ne.lat)
            if (eventMarkerIsWithinBounds && searchMarkerIsWithinBounds && customMarkerIsWithinBounds) {
              let newCenter = this.calculateNewCenterToFitPopup(thisEvent.latitudeDisplay, thisEvent.longitudeDisplay)
              this.setState({center: newCenter})
            } else {
              // fit all 3 markers
              let bounds = new mapboxgl.LngLatBounds()
              bounds.extend([this.state.customMarker.longitude, this.state.customMarker.latitude])
              bounds.extend([this.state.searchMarker.longitude, this.state.searchMarker.latitude])
              bounds.extend([thisEvent.longitudeDisplay, thisEvent.latitudeDisplay])
              console.log('bounds', bounds)
              this.map.fitBounds(bounds, {padding: 200})
            }
          } else {
            if (eventMarkerIsWithinBounds) {
              console.log('within bounds')
              let newCenter = this.calculateNewCenterToFitPopup(thisEvent.latitudeDisplay, thisEvent.longitudeDisplay)
              this.setState({center: newCenter})
            } else {
              this.setState({center: [thisEvent.longitudeDisplay, thisEvent.latitudeDisplay]})
            }
          }
        }
      }
    }

    // extract visble markers and offset lat lng
    if (nextProps.events.events !== this.props.events.events || nextProps.mapbox.daysToShow !== this.props.mapbox.daysToShow) {
      console.log('recalc latDisplay lngDisplay')
      let daysToShow = nextProps.mapbox.daysToShow
      let eventsInVisibleDays = nextProps.events.events.filter(e => {
        return daysToShow.includes(e.startDay)
      })
      let eventsToShow = eventsInVisibleDays.filter(e => {
        if (e.locationObj) {
          return e.locationObj.latitude
        } else {
          return false
        }
      })
      let comparisonArr = []
      let eventsWithOffsetGeometry = eventsToShow.map(event => {
        let position = {
          latitude: event.locationObj.latitude,
          longitude: event.locationObj.longitude
        }
        let positionMatched = _.find(comparisonArr, e => {
          return (e.latitude === position.latitude && e.longitude === position.longitude)
        })
        if (!positionMatched) {
          comparisonArr.push(position)
          event.latitudeDisplay = position.latitude
          event.longitudeDisplay = position.longitude
        } else {
          let offsetPosition = {
            latitude: position.latitude + 0.0001 * Math.floor(Math.random() * (3 - (-3)) + (-3)),
            longitude: position.longitude + 0.0001 * Math.floor(Math.random() * (3 - (-3)) + (-3))
          }
          comparisonArr.push(offsetPosition)
          event.latitudeDisplay = offsetPosition.latitude
          event.longitudeDisplay = offsetPosition.longitude
        }
        return event
      })
      this.setState({
        eventMarkersToDisplay: eventsWithOffsetGeometry
      }, () => {
        console.log('eventMarkersToDisplay with latDisplay, lngDisplay done', this.state.eventMarkersToDisplay)
      })
    }
  }

  clickDayCheckbox (day) {
    // check if active event is inside day to be collapsed
    let aboutToCollapse = this.props.mapbox.daysToShow.includes(day)
    let isActiveEventInThisDay = this.props.events.events.find(e => {
      return (e.startDay === day && e.id === this.props.activeEventId)
    })
    // console.log('aboutToCollapse', aboutToCollapse, 'isActiveEventInThisDay', isActiveEventInThisDay)
    if (aboutToCollapse && isActiveEventInThisDay) {
      this.props.updateActiveEvent('')
      this.props.setRightBarFocusedTab('')
    }
    this.props.clickDayCheckbox(day)
  }

  calculateNewCenterToFitPopup (markerLatitude, markerLongitude) {
    // given the lat/lng of the marker, shift the center of the map such that the popup is fully visible
    let shiftDownwards = 0 // check if popup will clear the top edge of days filter
    let shiftLeftwards = 0 // check if clash with days filter.
    let shiftRightwards = 0 // exceeds right bar. need to shift right
    let shiftUpwards = 0 // check if too close to top

    // convert marker's latlng into x,y pixels from top-left corner
    let projectionX = this.map.project([markerLongitude, markerLatitude]).x
    let projectionY = this.map.project([markerLongitude, markerLatitude]).y
    // console.log('x,y', projectionX, projectionY)

    // if y value is less than height of popup + marker offset + top custom controls (too near the top). center needs shift upwards (minus by the difference).
    // 200px popup + 40px offset + 42px top controls = 282
    if (282 - projectionY > 0) {
      shiftUpwards = 282 - projectionY
    }

    let mapboxDiv = document.querySelector('.mapboxgl-map')
    let mapboxHeight = mapboxDiv.clientHeight
    let mapboxWidth = mapboxDiv.clientWidth

    // since right bar does not open unless user explicitly clicks, marker just has to clear the tabs width (35px) + half its own width
    // but if user clicks right bar, map needs to shift accordingly? *ignore first
    if (projectionX - (mapboxWidth - 150 - 35) > 0) {
      // means marker x value is beyond right edge of map
      shiftRightwards = projectionX - (mapboxWidth - 150 - 35)
    }

    // check y value of marker if under or over top edge of days filter
    let daysFilterDiv = document.querySelector('.mapboxDaysFilter')
    let daysFilterHeight = daysFilterDiv.clientHeight

    if (projectionY <= mapboxHeight - daysFilterHeight - 10) {
      // above filter. check if it clear left edge
      if (150 - projectionX > 0) {
        // doesnt clear left edge. shift map leftwards (-ve)
        shiftLeftwards = 150 - projectionX
      }
    } else {
      // marker falls in the region below the top edge of days filter
      // if ((150 + 160) - projectionX > 0) {
      //   //
      // }
      let exceedLeftEdge = 150 + 160 - projectionX
      let distanceFromTopOfDaysFilter = projectionY - (mapboxHeight - daysFilterHeight - 10)

      if (exceedLeftEdge > 0) {
        // if (exceedLeftEdge < distanceFromTopOfDaysFilter) {
        //   shiftLeftwards = exceedLeftEdge
        // } else {
        //   shiftDownwards = distanceFromTopOfDaysFilter
        // }

        // if clicking in left bar, marker might be under days filter itself. shift 2 directions.
        shiftLeftwards = exceedLeftEdge
        shiftDownwards = distanceFromTopOfDaysFilter
      }
    }

    // convert center of map to x,y projection too
    let centerProjectionX = this.map.project(this.state.center).x
    let centerProjectionY = this.map.project(this.state.center).y

    let finalCenterProjectionY = centerProjectionY + shiftDownwards - shiftUpwards
    let finalCenterProjectionX = centerProjectionX + shiftRightwards - shiftLeftwards

    let newCenterLatLng = this.map.unproject([finalCenterProjectionX, finalCenterProjectionY])

    // return new coordinates for setState(center)
    return [newCenterLatLng.lng, newCenterLatLng.lat]
  }

  onEventMarkerClick (id) {
    // toggle activeEventId
    if (this.props.activeEventId === id) {
      this.props.updateActiveEvent('')
      this.props.setRightBarFocusedTab('')
      this.props.setPopupToShow('')
    } else {
      // let thisEvent = this.props.events.events.find(e => {
      //   return e.id === id
      // })
      // if (thisEvent.locationObj && thisEvent.locationObj.latitude) {
      //   let newCenter = this.calculateNewCenterToFitPopup(thisEvent.latitudeDisplay, thisEvent.longitudeDisplay)
      //   this.setState({center: newCenter})
      // }

      this.props.updateActiveEvent(id)
      this.props.setPopupToShow('event')
      // this.props.setRightBarFocusedTab('event')

      // if (thisEvent.locationObj && thisEvent.locationObj.latitude) {
      //   let latitude = thisEvent.latitudeDisplay
      //   let longitude = thisEvent.longitudeDisplay
      //
      //   let shiftDownwards = 0
      //   let shiftLeftwards = 0
      //   let shiftRightwards = 0
      //   let shiftUpwards = 0
      //
      //   // project
      //   let projectionX = this.map.project([longitude, latitude]).x
      //   let projectionY = this.map.project([longitude, latitude]).y
      //   console.log('x,y', projectionX, projectionY)
      //
      //   let exceedTopEdge = 282 - projectionY // if positive (means insufficient space)
      //   if (exceedTopEdge > 0) {
      //     console.log('exceed by', exceedTopEdge)
      //     shiftDownwards = exceedTopEdge
      //   }
      //
      //   let mapboxDiv = document.querySelector('.mapboxgl-map')
      //   let mapboxHeight = mapboxDiv.clientHeight
      //   let mapboxWidth = mapboxDiv.clientWidth
      //   // check right edge (depends on whether right bar is open)
      //   if (!this.props.plannerView.rightBar) {
      //     // if right bar is not open. account for right bar width too
      //     console.log('mapboxWidth', mapboxWidth) // 1185 if right bar is hidden
      //     let exceedRightEdge = projectionX - (mapboxWidth - 530) // if positive means too far right
      //     if (exceedRightEdge > 0) {
      //       console.log('exceed right by', exceedRightEdge)
      //       shiftLeftwards = exceedRightEdge
      //     }
      //   } else {
      //     // if right bar is already open, clientWidth is smaller
      //     let exceedRightEdge = projectionX - (mapboxWidth - 185)
      //     if (exceedRightEdge > 0) {
      //       console.log('exceed right by', exceedRightEdge)
      //       shiftLeftwards = exceedRightEdge
      //     }
      //   }
      //   let daysFilterDiv = document.querySelector('.mapboxDaysFilter')
      //   let daysFilterHeight = daysFilterDiv.clientHeight
      //
      //   // check distance from bottom, then check left edge
      //
      //   if (projectionY <= mapboxHeight - daysFilterHeight - 10) {
      //     // if marker is above daysFilter, check left edge only
      //     console.log('lies above daysFilter')
      //     let exceedLeftEdge = 150 - projectionX
      //     if (exceedLeftEdge > 0) {
      //       console.log('exceed left edge by', exceedLeftEdge)
      //       shiftRightwards = exceedLeftEdge
      //     }
      //   } else {
      //     console.log('lies below daysFilter')
      //     // if marker lies lower than daysFilter, check if exceedLeftEdge vs distance to top of daysFilter. shift either up or right (whichever is smaller).
      //     let exceedLeftEdge = 160 + 150 - projectionX
      //     let distanceFromTopOfDaysFilter = projectionY - (mapboxHeight - daysFilterHeight - 10)
      //     if (exceedLeftEdge > 0) {
      //       console.log('exceed left by', exceedLeftEdge)
      //       console.log('distance from top is', distanceFromTopOfDaysFilter)
      //       if (exceedLeftEdge < distanceFromTopOfDaysFilter) {
      //         shiftRightwards = exceedLeftEdge
      //       } else {
      //         shiftUpwards = distanceFromTopOfDaysFilter
      //       }
      //     }
      //   }
      //
      //   // console.log('shifts', shiftDownwards, shiftRightwards, shiftLeftwards, shiftUpwards)
      //
      //   // console.log('center', this.map.project(this.state.center))
      //   let centerProjectionX = this.map.project(this.state.center).x
      //   let centerProjectionY = this.map.project(this.state.center).y
      //   // console.log('center points', centerProjectionX, centerProjectionY)
      //
      //   let finalCenterProjectionY = centerProjectionY - shiftDownwards + shiftUpwards
      //   let finalCenterProjectionX = centerProjectionX - shiftRightwards + shiftLeftwards
      //
      //   // console.log('points', finalCenterProjectionX, finalCenterProjectionY)
      //   let newCenterLatLng = this.map.unproject([finalCenterProjectionX, finalCenterProjectionY])
      //   this.setState({center: [newCenterLatLng.lng, newCenterLatLng.lat]})
      // }
    }
  }

  onSearchMarkerClick () {
    if (this.props.mapbox.popupToShow !== 'search') {
      this.props.setPopupToShow('search')
      let newCenter = this.calculateNewCenterToFitPopup(this.state.searchMarker.latitude, this.state.searchMarker.longitude)
      this.setState({center: newCenter})
      // this.setState({
      //   center: [this.state.searchMarker.longitude, this.state.searchMarker.latitude]
      // })
    } else if (this.props.mapbox.popupToShow === 'search') {
      this.props.setPopupToShow('')
    }
  }

  onCustomMarkerClick () {
    if (this.props.mapbox.popupToShow !== 'custom') {
      this.props.setPopupToShow('custom')
      // this.setState({
      //   center: [this.state.customMarker.longitude, this.state.customMarker.latitude]
      // })
      let newCenter = this.calculateNewCenterToFitPopup(this.state.customMarker.latitude, this.state.customMarker.longitude)
      this.setState({center: newCenter})
    } else if (this.props.mapbox.popupToShow === 'custom') {
      this.props.setPopupToShow('')
    }
  }

  closePopup () {
    this.props.setPopupToShow('')
  }

  saveSearchLocation () {
    // console.log('save location', this.state.searchMarker)
    let EventId = this.props.activeEventId
    this.props.updateEventBackend({
      variables: {
        id: EventId,
        locationData: this.state.searchMarker
      }
    })

    this.clearSearch()
    this.props.setPopupToShow('event')

    let nameContentState = ContentState.createFromText(this.state.searchMarker.name)
    this.props.updateEvent(EventId, 'locationName', nameContentState, false)
    this.props.updateEvent(EventId, 'locationObj', this.state.searchMarker, false)
  }

  saveSearchAddress () {
    // console.log('save address', this.state.searchMarker)
    let EventId = this.props.activeEventId

    let currentEvent = this.props.events.events.find(e => {
      return e.id === EventId
    })
    let currentLocationName = currentEvent.locationObj.name
    // console.log('current event', currentEvent)

    this.props.updateEventBackend({
      variables: {
        id: EventId,
        locationData: {
          ...this.state.searchMarker,
          verified: false,
          name: currentLocationName
        }
      }
    })

    this.clearSearch()
    this.props.setPopupToShow('event')

    let nameContentState = ContentState.createFromText(currentLocationName)
    this.props.updateEvent(EventId, 'locationName', nameContentState, false)
    this.props.updateEvent(EventId, 'locationObj', {...this.state.searchMarker, name: currentLocationName, verified: false}, false)
  }

  saveCustomLocation () {
    console.log('custom marker', this.state.customMarker)
    let EventId = this.props.activeEventId
    this.props.updateEventBackend({
      variables: {
        id: EventId,
        locationData: this.state.customMarker
      }
    })

    this.togglePlotCustom()

    let nameContentState = ContentState.createFromText(this.state.customMarker.name)
    this.props.updateEvent(EventId, 'locationName', nameContentState, false)
    this.props.updateEvent(EventId, 'locationObj', this.state.customMarker, false)
  }

  saveCustomAddress () {
    console.log('custom marker', this.state.customMarker)

    let EventId = this.props.activeEventId
    let currentEvent = this.props.events.events.find(e => {
      return e.id === EventId
    })
    let currentLocationName = currentEvent.locationObj.name

    this.props.updateEventBackend({
      variables: {
        id: EventId,
        locationData: {
          ...this.state.customMarker,
          verified: false,
          name: currentLocationName
        }
      }
    })

    this.togglePlotCustom()

    let nameContentState = ContentState.createFromText(currentLocationName)
    this.props.updateEvent(EventId, 'locationName', nameContentState, false)
    this.props.updateEvent(EventId, 'locationObj', {...this.state.customMarker, name: currentLocationName, verified: false}, false)
  }

  togglePlotCustom () {
    let mapCanvasContainer = this.map.getCanvasContainer()
    // console.log('canvascontainer', mapCanvasContainer)

    if (!this.state.plottingCustomMarker) {
      this.setState({
        plottingCustomMarker: true
      })
      mapCanvasContainer.style.cursor = 'crosshair'
    } else {
      this.setState({
        plottingCustomMarker: false,
        customMarker: null
      })
      mapCanvasContainer.style.cursor = ''
      this.props.setPopupToShow('')
    }
  }

  onMapClick (map, evt) {
    console.log('evt', evt)
    if (this.state.plottingCustomMarker) {
      this.queryMapboxReverseGeocoder(evt.lngLat.lat, evt.lngLat.lng)
    }
  }

  queryMapboxReverseGeocoder (lat, lng) {
    let endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}&language=en`
    fetch(endpoint)
      .then(response => {
        return response.json()
      })
      .then(json => {
        if (!json.features.length) {
          // console.log('no results')
          this.setState({
            customMarker: {
              latitude: lat,
              longitude: lng,
              countryCode: '',
              name: null,
              address: null,
              verified: false
            }
          })
          this.props.setPopupToShow('custom')
        } else {
          let result = json.features[0]
          console.log('result', result)
          let name = result.text
          let address = result.place_name
          let countryCode
          // find country code
          let contextArr = result.context
          if (contextArr) {
            let countryCodeObj = contextArr.find(e => {
              return e.id.includes('country')
            })
            if (countryCodeObj) {
              countryCode = countryCodeObj.short_code.toUpperCase()
            }
          }
          let customMarker = {
            verified: false,
            latitude: lat,
            longitude: lng,
            countryCode,
            name,
            address
          }
          let newCenter = this.calculateNewCenterToFitPopup(customMarker.latitude, customMarker.longitude)
          this.setState({
            customMarker: customMarker,
            center: newCenter
          }, () => {
            this.props.setPopupToShow('custom')
          })
        }
      })
      .catch(err => {
        console.log('err', err)
      })
  }

  customMarkerAddEvent () {
    // get value of day dropdown (numeric string convert to number)
    let customMarkerDayDropdown = document.querySelector('.customMarkerDayDropdown')
    let startDay = parseInt(customMarkerDayDropdown.value)

    let locationObj = {
      verified: false,
      latitude: this.state.customMarker.latitude,
      longitude: this.state.customMarker.longitude,
      name: this.state.customMarker.name,
      address: this.state.customMarker.address,
      countryCode: this.state.customMarker.countryCode
    }

    let loadSequence = createNewEventSequence(this.props.events.events, startDay)

    this.props.createEvent({
      variables: {
        ItineraryId: this.props.itineraryId,
        locationData: locationObj,
        startDay,
        loadSequence
      }
    })
      .then(response => {
        let newEventId = response.data.createEvent.id
        return Promise.all([this.props.data.refetch(), newEventId])
      })
      .then(promiseArr => {
        let newEventId = promiseArr[1]

        // ensure day is check in days filter first
        // close custom marker, popup, change cursor back to normal
        // set activeEvent to newEventId
        // set popup to 'event'
        this.props.ensureDayIsChecked(startDay)
        this.togglePlotCustom()
        this.props.updateActiveEvent(newEventId)
        this.props.setPopupToShow('event')
      })
  }

  searchMarkerAddEvent () {
    let searchMarkerDayDropdown = document.querySelector('.searchMarkerDayDropdown')
    let startDay = parseInt(searchMarkerDayDropdown.value)
    let locationObj = this.state.searchMarker
    let loadSequence = createNewEventSequence(this.props.events.events, startDay)

    this.props.createEvent({
      variables: {
        ItineraryId: this.props.itineraryId,
        locationData: locationObj,
        startDay,
        loadSequence
      }
    })
      .then(response => {
        let newEventId = response.data.createEvent.id
        return Promise.all([this.props.data.refetch(), newEventId])
      })
      .then(promiseArr => {
        let newEventId = promiseArr[1]

        this.props.ensureDayIsChecked(startDay)
        this.clearSearch()
        this.props.updateActiveEvent(newEventId)
        this.props.setPopupToShow('event')
      })
  }

  render () {
    // activeEvent is the event that was clicked (might not hv marker)
    let activeEvent = this.props.events.events.find(e => {
      return e.id === this.props.activeEventId
    })
    let activeEventLocationObj
    let activeEventHasCoordinates
    if (activeEvent) {
      activeEventLocationObj = activeEvent.locationObj
      if (activeEventLocationObj) {
        activeEventHasCoordinates = activeEventLocationObj.longitude && activeEventLocationObj.latitude
      }
    }
    // console.log('activeEvent', activeEvent)
    // console.log('activeEventLocationObj', activeEventLocationObj)
    return (
      <Map style={mapStyle} zoom={this.state.zoom} center={this.state.center} containerStyle={this.state.containerStyle} onStyleLoad={el => { this.map = el }} onMoveEnd={(map, evt) => this.onMapMoveEnd(map, evt)} onClick={(map, evt) => this.onMapClick(map, evt)}>
        <ZoomControl position='top-left' />

        {/* CUSTOM MARKER */}
        <div style={styles.customMarkerButtonContainer} onClick={() => this.togglePlotCustom()}>
          {!this.state.plottingCustomMarker &&
            <React.Fragment>
              <i className='material-icons'>place</i>
              <span>Custom Marker</span>
            </React.Fragment>
          }
          {this.state.plottingCustomMarker &&
            <React.Fragment>
              <i className='material-icons'>place</i>
              <span>Cancel</span>
            </React.Fragment>
          }
        </div>

        {this.state.customMarker &&
          <Marker coordinates={[this.state.customMarker.longitude, this.state.customMarker.latitude]} anchor='bottom' style={{display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: 4}} onClick={() => this.onCustomMarkerClick()}>
            <i className='material-icons' style={{color: 'green', fontSize: '35px'}}>place</i>
          </Marker>
        }

        {this.state.customMarker && this.props.mapbox.popupToShow === 'custom' &&
          <Popup anchor='bottom' coordinates={[this.state.customMarker.longitude, this.state.customMarker.latitude]} offset={{'bottom': [0, -40]}} style={{zIndex: 5}}>
            <div style={{width: '300px'}}>
              <i className='material-icons' style={{position: 'absolute', top: '5px', right: '5px', fontSize: '18px', cursor: 'pointer'}} onClick={() => this.closePopup()}>clear</i>
              <div style={{width: '300px', border: '1px solid rgba(223, 56, 107, 1)', padding: '16px'}}>
                {this.state.customMarker.address &&
                  <React.Fragment>
                    <h6 style={{margin: '0 0 5px 0', fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: 'rgb(60, 58, 68)'}}>Name</h6>
                    <h6 style={{margin: '0 0 16px 0', fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', lineHeight: '24px', color: 'rgb(60, 58, 68)'}}>{this.state.customMarker.name}</h6>
                    <h6 style={{margin: '0 0 5px 0', fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: 'rgb(60, 58, 68)'}}>Address</h6>
                    <h6 style={{margin: 0, fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', lineHeight: '24px', color: 'rgb(60, 58, 68)'}}>{this.state.customMarker.address}</h6>
                  </React.Fragment>
                }
                {!this.state.customMarker.address &&
                  <h6>No result found. Please try again.</h6>
                }
              </div>
              {this.props.activeEventId && this.state.customMarker.address &&
                <div style={{display: 'inline-flex'}}>
                  {activeEventLocationObj &&
                    <React.Fragment>
                      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '150px', height: '35px', border: '1px solid rgba(223, 56, 107, 1)', cursor: 'pointer'}} onClick={() => this.saveCustomLocation()}>
                        <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: 'rgb(60, 58, 68)'}}>Save Location</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '150px', height: '35px', border: '1px solid rgba(223, 56, 107, 1)', cursor: 'pointer'}} onClick={() => this.saveCustomAddress()}>
                        <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: 'rgb(60, 58, 68)'}}>Save Address only</span>
                      </div>
                    </React.Fragment>
                  }
                  {!activeEventLocationObj &&
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '300px', height: '35px', border: '1px solid rgba(223, 56, 107, 1)', cursor: 'pointer'}} onClick={() => this.saveCustomLocation()}>
                      <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: 'rgb(60, 58, 68)'}}>Save Location</span>
                    </div>
                  }
                </div>
              }
              {!this.props.activeEventId &&
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '300px', height: '35px', border: '1px solid rgba(223, 56, 107, 1)', cursor: 'pointer'}} onClick={() => this.customMarkerAddEvent()}>
                  <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: 'rgb(60, 58, 68)'}}>Add to</span>
                  <select className={'customMarkerDayDropdown'} onClick={e => e.stopPropagation()}>
                    {this.props.daysArr.map((day, i) => {
                      return (
                        <option key={i} value={day}>Day {day}</option>
                      )
                    })}
                  </select>
                </div>
              }
            </div>
          </Popup>
        }

        {/* PLACE SEARCH BAR */}
        <div style={styles.searchBarContainer} className={'ignoreMapSearchInputField'}>
          <i className='material-icons' style={styles.searchBarSearchIcon}>search</i>
          <input type='text' style={styles.searchBarInputField} placeholder='Search for a location' onChange={e => this.onSearchInputChange(e)} value={this.state.searchInputField} />
          <i className='material-icons' style={styles.searchBarClearIcon} onClick={() => this.clearSearch()}>clear</i>

          {this.state.showDropdown &&
            <LocationCellDropdown openedIn={'map'} showSpinner={this.state.showSpinner} predictions={this.state.predictions} selectLocation={prediction => this.selectLocation(prediction)} handleClickOutside={() => this.handleClickOutside()} outsideClickIgnoreClass={`ignoreMapSearchInputField`} />
          }
        </div>

        {this.state.searchMarker &&
          <Marker coordinates={[this.state.searchMarker.longitude, this.state.searchMarker.latitude]} anchor='bottom' style={{display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: 4}} onClick={() => this.onSearchMarkerClick()}>
            <i className='material-icons' style={{color: 'black', fontSize: '35px'}}>place</i>
          </Marker>
        }

        {/* SEARCH MARKER POPUP */}
        {this.state.searchMarker && this.props.mapbox.popupToShow === 'search' &&
          <Popup anchor='bottom' coordinates={[this.state.searchMarker.longitude, this.state.searchMarker.latitude]} offset={{'bottom': [0, -40]}} style={{zIndex: 5}}>
            <div style={{width: '300px'}}>
              <i className='material-icons' style={{position: 'absolute', top: '5px', right: '5px', fontSize: '18px', cursor: 'pointer'}} onClick={() => this.closePopup()}>clear</i>
              <div style={{width: '300px', border: '1px solid rgba(223, 56, 107, 1)', padding: '16px'}}>
                <h6 style={{margin: '0 0 5px 0', fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: 'rgb(60, 58, 68)'}}>Name</h6>
                <h6 style={{margin: '0 0 16px 0', fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', lineHeight: '24px', color: 'rgb(60, 58, 68)'}}>{this.state.searchMarker.name}</h6>
                <h6 style={{margin: '0 0 5px 0', fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: 'rgb(60, 58, 68)'}}>Address</h6>
                <h6 style={{margin: 0, fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', lineHeight: '24px', color: 'rgb(60, 58, 68)'}}>{this.state.searchMarker.address}</h6>
              </div>
              {this.props.activeEventId &&
                <div style={{display: 'inline-flex'}}>
                  {activeEventLocationObj &&
                    <React.Fragment>
                      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '150px', height: '35px', border: '1px solid rgba(223, 56, 107, 1)', cursor: 'pointer'}} onClick={() => this.saveSearchLocation()}>
                        <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: 'rgb(60, 58, 68)'}}>Save Location</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '150px', height: '35px', border: '1px solid rgba(223, 56, 107, 1)', cursor: 'pointer'}} onClick={() => this.saveSearchAddress()}>
                        <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: 'rgb(60, 58, 68)'}}>Save Address only</span>
                      </div>
                    </React.Fragment>
                  }
                  {!activeEventLocationObj &&
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '300px', height: '35px', border: '1px solid rgba(223, 56, 107, 1)', cursor: 'pointer'}}>
                      <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: 'rgb(60, 58, 68)'}}>Save Location</span>
                    </div>
                  }
                </div>
              }
              {!this.props.activeEventId &&
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '300px', height: '35px', border: '1px solid rgba(223, 56, 107, 1)', cursor: 'pointer'}} onClick={() => this.searchMarkerAddEvent()}>
                  <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: 'rgb(60, 58, 68)'}}>Add to</span>
                  <select className={'searchMarkerDayDropdown'} onClick={e => e.stopPropagation()}>
                    {this.props.daysArr.map((day, i) => {
                      return (
                        <option key={i} value={day}>Day {day}</option>
                      )
                    })}
                  </select>
                </div>
              }
            </div>
          </Popup>
        }

        {/* DAYS FILTER */}
        <div style={styles.daysFilterContainer} className={'mapboxDaysFilter'}>
          {this.props.daysArr.map((day, i) => {
            let isChecked = this.props.mapbox.daysToShow.includes(day)
            return (
              <div key={`day${day}`} style={{display: 'flex', alignItems: 'center', margin: '8px 0'}}>
                {isChecked &&
                  <i className='material-icons' onClick={() => this.clickDayCheckbox(day)} style={{color: 'rgb(67, 132, 150)', cursor: 'pointer'}}>check_box</i>
                }
                {!isChecked &&
                  <i className='material-icons' onClick={() => this.clickDayCheckbox(day)} style={{color: 'rgb(67, 132, 150)', cursor: 'pointer'}}>check_box_outline_blank</i>
                }
                <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', color: 'rgb(67, 132, 150)', marginLeft: '8px'}}>Day {day}</span>
              </div>
            )
          })}
        </div>

        {this.state.eventMarkersToDisplay.map((event, i) => {
          let isActiveEvent = this.props.activeEventId === event.id
          return (
            <Marker key={i} coordinates={[event.longitudeDisplay, event.latitudeDisplay]} anchor='bottom' style={{display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: isActiveEvent ? 4 : 3}} onClick={(evt) => this.onEventMarkerClick(event.id, evt)}>
              <i className='material-icons' style={{color: isActiveEvent ? 'red' : 'rgb(67, 132, 150)', fontSize: '35px'}}>place</i>
            </Marker>
          )
        })}

        {activeEvent && activeEventHasCoordinates && this.props.mapbox.popupToShow === 'event' &&
          <Popup anchor='bottom' coordinates={[activeEvent.longitudeDisplay, activeEvent.latitudeDisplay]} offset={{'bottom': [0, -40]}} style={{zIndex: 5}}>
            <div style={{width: '300px'}}>
              <i className='material-icons' style={{position: 'absolute', top: '5px', right: '5px', fontSize: '18px', cursor: 'pointer'}} onClick={() => this.closePopup()}>clear</i>
              <div style={{width: '300px', border: '1px solid rgba(223, 56, 107, 1)', padding: '16px'}}>
                <h6 style={{margin: '0 0 5px 0', fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: 'rgb(60, 58, 68)'}}>Name</h6>
                <h6 style={{margin: '0 0 16px 0', fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', lineHeight: '24px', color: 'rgb(60, 58, 68)'}}>{activeEvent.locationObj.name}</h6>
                <h6 style={{margin: '0 0 5px 0', fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: 'rgb(60, 58, 68)'}}>Address</h6>
                <h6 style={{margin: 0, fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', lineHeight: '24px', color: 'rgb(60, 58, 68)'}}>{activeEvent.locationObj.address}</h6>
              </div>
            </div>
          </Popup>
        }
      </Map>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.events,
    activeEventId: state.activeEventId,
    plannerView: state.plannerView,
    mapbox: state.mapbox
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clickDayCheckbox: (day) => {
      dispatch(clickDayCheckbox(day))
    },
    ensureDayIsChecked: (day) => {
      dispatch(ensureDayIsChecked(day))
    },
    setPopupToShow: (name) => {
      dispatch(setPopupToShow(name))
    },
    updateActiveEvent: (id) => {
      dispatch(updateActiveEvent(id))
    },
    setRightBarFocusedTab: (tabName) => {
      dispatch(setRightBarFocusedTab(tabName))
    },
    updateEvent: (id, property, value, fromSidebar) => {
      dispatch(updateEvent(id, property, value, fromSidebar))
    }
  }
}

const options = {
  options: props => ({
    variables: {
      id: props.itineraryId
    }
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(updateEventBackend, {name: 'updateEventBackend'}),
  graphql(createEvent, {name: 'createEvent'}),
  graphql(queryItinerary, options)
)(MapboxMap))
