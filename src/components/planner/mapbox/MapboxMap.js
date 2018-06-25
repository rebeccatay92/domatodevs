import React, { Component } from 'react'
import ReactMapboxGL, { ZoomControl, Marker, Popup } from 'react-mapbox-gl'
import mapboxgl from 'mapbox-gl'
import LocationCellDropdown from '../LocationCellDropdown'
import PopupTemplate from './PopupTemplate'

import { connect } from 'react-redux'
import { clickDayCheckbox, ensureDayIsChecked, setPopupToShow, clickBucketCheckbox } from '../../../actions/planner/mapboxActions'
import { updateActiveEvent } from '../../../actions/planner/activeEventActions'
import { setRightBarFocusedTab } from '../../../actions/planner/plannerViewActions'
import { updateEvent } from '../../../actions/planner/eventsActions'
import { setFocusedBucketId } from '../../../actions/planner/bucketListActions'

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
      customMarker: null,
      bucketMarkersToDisplay: []
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
    let longitude = map.getCenter().lng
    let latitude = map.getCenter().lat

    // if (longitude < -180) {
    //   longitude += 180
    // } else if (longitude > 180) {
    //   longitude -= 180
    // }

    this.setState({
      zoom: [map.getZoom()],
      center: [longitude, latitude]
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

    // filter out which buckets to display
    if (this.props.bucketList) {
      let filteredByCountry
      let finalFilteredArr

      if (this.props.bucketList.selectedCountryId) {
        filteredByCountry = this.props.bucketList.buckets.filter(e => {
          return e.location.CountryId === this.props.bucketList.selectedCountryId
        })
      } else {
        filteredByCountry = this.props.bucketList.buckets
      }

      if (this.props.bucketList.selectedBucketCategory) {
        finalFilteredArr = filteredByCountry.filter(e => {
          return e.bucketCategory === this.props.bucketList.selectedBucketCategory
        })
      } else {
        finalFilteredArr = filteredByCountry
      }

      // bucketMarkers are the bucket obj with a nested location obj.
      this.setState({
        bucketMarkersToDisplay: finalFilteredArr
      })
    }
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
    // NEED TO REFACTOR AND INCLUDE BUCKET INTERACTIONS
    if (nextProps.activeEventId !== this.props.activeEventId) {
      if (nextProps.activeEventId) {
        // console.log('next active event', nextProps.activeEventId)
        let thisEvent = nextProps.events.events.find(e => {
          return e.id === nextProps.activeEventId
        })
        if (thisEvent.longitudeDisplay && thisEvent.latitudeDisplay) {
          // console.log('longitude', thisEvent.longitudeDisplay)
          // check if marker is already within the bounds
          let currentBounds = this.map.getBounds()
          // console.log('currentBounds', currentBounds)

          let eventMarkerIsWithinBounds = this.checkIfWithinBounds(currentBounds, thisEvent.latitudeDisplay, thisEvent.longitudeDisplay)

          if (this.state.searchMarker && !this.state.customMarker) {
            // search marker exists
            let searchMarkerIsWithinBounds = this.checkIfWithinBounds(currentBounds, this.state.searchMarker.latitude, this.state.searchMarker.longitude)

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
            let customMarkerIsWithinBounds = this.checkIfWithinBounds(currentBounds, this.state.customMarker.latitude, this.state.customMarker.longitude)

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
            let searchMarkerIsWithinBounds = this.checkIfWithinBounds(currentBounds, this.state.searchMarker.latitude, this.state.searchMarker.longitude)
            let customMarkerIsWithinBounds = this.checkIfWithinBounds(currentBounds, this.state.customMarker.latitude, this.state.customMarker.longitude)

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
              console.log('only event marker, within bounds')
              let newCenter = this.calculateNewCenterToFitPopup(thisEvent.latitudeDisplay, thisEvent.longitudeDisplay)
              this.setState({center: newCenter})
            } else {
              console.log('only event marker. not within bounds')
              this.setState({center: [thisEvent.longitudeDisplay, thisEvent.latitudeDisplay]})
            }
          }
        }
      }
    }

    // if clicking on bucket marker or bucket right bar
    if (nextProps.bucketList.focusedBucketId !== this.props.bucketList.focusedBucketId) {
      if (nextProps.bucketList.focusedBucketId) {
        // check if within bounds
        // if yes fitPopup, if no center?
        let activeBucketMarker = nextProps.bucketList.buckets.find(e => {
          return e.id === nextProps.bucketList.focusedBucketId
        })
        let currentBounds = this.map.getBounds()
        let bucketMarkerIsWithinBounds = (activeBucketMarker.location.longitude >= currentBounds._sw.lng && activeBucketMarker.location.longitude <= currentBounds._ne.lng) && (activeBucketMarker.location.latitude >= currentBounds._sw.lat && activeBucketMarker.location.latitude <= currentBounds._ne.lat)

        if (bucketMarkerIsWithinBounds) {
          // calculate fitPopup
          let newCenter = this.calculateNewCenterToFitPopup(activeBucketMarker.location.latitude, activeBucketMarker.location.longitude)
          this.setState({center: newCenter})
        } else {
          this.setState({
            center: [activeBucketMarker.location.longitude, activeBucketMarker.location.latitude]
          })
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

    // change bucket markers arr
    if (nextProps.bucketList.selectedBucketCategory !== this.props.bucketList.selectedBucketCategory || nextProps.bucketList.selectedCountryId !== this.props.bucketList.selectedCountryId) {
      let filteredByCountry
      let finalFilteredArr

      if (nextProps.bucketList.selectedCountryId) {
        filteredByCountry = nextProps.bucketList.buckets.filter(e => {
          return e.location.CountryId === nextProps.bucketList.selectedCountryId
        })
      } else {
        filteredByCountry = nextProps.bucketList.buckets
      }

      if (nextProps.bucketList.selectedBucketCategory) {
        finalFilteredArr = filteredByCountry.filter(e => {
          return e.bucketCategory === this.props.bucketList.selectedBucketCategory
        })
      } else {
        finalFilteredArr = filteredByCountry
      }

      // bucketMarkers are the bucket obj with a nested location obj.
      this.setState({
        bucketMarkersToDisplay: finalFilteredArr
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

  checkIfWithinBounds (mapBounds, latitude, longitude) {
    return (longitude >= mapBounds._sw.lng && longitude <= mapBounds._ne.lng) && (latitude >= mapBounds._sw.lat && latitude <= mapBounds._ne.lat)
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
    let daysFilterDiv = document.querySelector('.mapboxFiltersContainer')
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
      this.props.setPopupToShow('')
      // if no focused event marker, but right bar is open, revert to bucket. if right bar is close, just close.
      if (this.props.plannerView.rightBar === '') {
        this.props.setRightBarFocusedTab('')
      } else if (this.props.plannerView.rightBar === 'event') {
        this.props.setRightBarFocusedTab('bucket')
      }
    } else {
      this.props.updateActiveEvent(id)
      this.props.setPopupToShow('event')
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

  onBucketMarkerClick (id) {
    if (this.props.bucketList.focusedBucketId === id) {
      this.props.setFocusedBucketId('')
      this.props.setPopupToShow('')
    } else {
      this.props.setFocusedBucketId(id)
      this.props.setPopupToShow('bucket')
    }
  }

  onSingleBucketMarkerClick () {
    // only can toggle popup. will not unfocus
    if (this.props.mapbox.popupToShow === 'bucket') {
      this.props.setPopupToShow('')
    } else {
      this.props.setPopupToShow('bucket')
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

  saveBucketLocation () {
    let EventId = this.props.activeEventId

    let bucketMarker = this.props.bucketList.buckets.find(e => {
      return e.id === this.props.bucketList.focusedBucketId
    })
    let { verified, name, address, latitude, longitude, country } = bucketMarker.location

    // console.log('destructure', verified, name, address, country)
    this.props.updateEventBackend({
      variables: {
        id: EventId,
        locationData: {
          verified,
          name,
          address,
          latitude,
          longitude,
          countryCode: country.code
        }
      }
    })

    // unfocus bucket so the marker wont cover the event marker.
    this.props.setFocusedBucketId('')
    this.props.setPopupToShow('event')
    let nameContentState = ContentState.createFromText(bucketMarker.location.name)
    this.props.updateEvent(EventId, 'locationName', nameContentState, false)
    this.props.updateEvent(EventId, 'locationObj', bucketMarker.location, false)

    this.props.setRightBarFocusedTab('event')
  }

  saveBucketAddress () {
    let EventId = this.props.activeEventId

    let currentEvent = this.props.events.events.find(e => {
      return e.id === EventId
    })
    let currentLocationName = currentEvent.locationObj.name

    let bucketMarker = this.props.bucketList.buckets.find(e => {
      return e.id === this.props.bucketList.focusedBucketId
    })
    let { address, latitude, longitude, country } = bucketMarker.location

    this.props.updateEventBackend({
      variables: {
        id: EventId,
        locationData: {
          verified: false,
          name: currentLocationName,
          address,
          latitude,
          longitude,
          countryCode: country.code
        }
      }
    })

    this.props.setFocusedBucketId('')
    this.props.setPopupToShow('event')

    let nameContentState = ContentState.createFromText(currentLocationName)
    this.props.updateEvent(EventId, 'locationName', nameContentState, false)
    this.props.updateEvent(EventId, 'locationObj', {verified: false, name: currentLocationName, address, latitude, longitude, countryCode: country.code}, false)

    this.props.setRightBarFocusedTab('event')
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

  bucketMarkerAddEvent () {
    let bucketMarkerDayDropdown = document.querySelector('.bucketMarkerDayDropdown')
    let startDay = parseInt(bucketMarkerDayDropdown.value)

    let bucketMarker = this.props.bucketList.buckets.find(e => {
      return e.id === this.props.bucketList.focusedBucketId
    })
    let { verified, name, address, latitude, longitude, country } = bucketMarker.location

    let loadSequence = createNewEventSequence(this.props.events.events, startDay)

    this.props.createEvent({
      variables: {
        ItineraryId: this.props.itineraryId,
        locationData: {
          verified,
          name,
          address,
          latitude,
          longitude,
          countryCode: country.code
        },
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
        this.props.setFocusedBucketId('')
        this.props.updateActiveEvent(newEventId)
        this.props.setPopupToShow('event')
        this.props.setRightBarFocusedTab('event')
      })
  }

  clickBucketCheckbox () {
    if (!this.props.mapbox.bucketCheckbox) {
      this.props.setRightBarFocusedTab('bucket')
    }
    this.props.clickBucketCheckbox()
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
    let activeBucketMarker = this.props.bucketList.buckets.find(e => {
      return e.id === this.props.bucketList.focusedBucketId
    })

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
          <Marker coordinates={[this.state.customMarker.longitude, this.state.customMarker.latitude]} anchor='bottom' style={styles.markerContainer} onClick={() => this.onCustomMarkerClick()}>
            <i className='material-icons' style={{color: 'green', fontSize: '35px'}}>place</i>
          </Marker>
        }

        {this.state.customMarker && this.props.mapbox.popupToShow === 'custom' &&
          <PopupTemplate longitude={this.state.customMarker.longitude} latitude={this.state.customMarker.latitude} markerType='custom' locationObj={this.state.customMarker} activeEventId={this.props.activeEventId} activeEventLocationObj={activeEventLocationObj} daysArr={this.props.daysArr} closePopup={() => this.closePopup()} saveCustomLocation={() => this.saveCustomLocation()} saveCustomAddress={() => this.saveCustomAddress()} customMarkerAddEvent={() => this.customMarkerAddEvent()} saveSearchLocation={() => this.saveSearchLocation()} saveSearchAddress={() => this.saveSearchAddress()} searchMarkerAddEvent={() => this.searchMarkerAddEvent()} saveBucketLocation={() => this.saveBucketLocation()} saveBucketAddress={() => this.saveBucketAddress()} bucketMarkerAddEvent={() => this.bucketMarkerAddEvent()} />
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
          <Marker coordinates={[this.state.searchMarker.longitude, this.state.searchMarker.latitude]} anchor='bottom' style={styles.markerContainer} onClick={() => this.onSearchMarkerClick()}>
            <i className='material-icons' style={{color: 'black', fontSize: '35px'}}>place</i>
          </Marker>
        }

        {/* SEARCH MARKER POPUP */}
        {this.state.searchMarker && this.props.mapbox.popupToShow === 'search' &&
          <PopupTemplate longitude={this.state.searchMarker.longitude} latitude={this.state.searchMarker.latitude} markerType='search' locationObj={this.state.searchMarker} activeEventId={this.props.activeEventId} activeEventLocationObj={activeEventLocationObj} daysArr={this.props.daysArr} closePopup={() => this.closePopup()} saveCustomLocation={() => this.saveCustomLocation()} saveCustomAddress={() => this.saveCustomAddress()} customMarkerAddEvent={() => this.customMarkerAddEvent()} saveSearchLocation={() => this.saveSearchLocation()} saveSearchAddress={() => this.saveSearchAddress()} searchMarkerAddEvent={() => this.searchMarkerAddEvent()} saveBucketLocation={() => this.saveBucketLocation()} saveBucketAddress={() => this.saveBucketAddress()} bucketMarkerAddEvent={() => this.bucketMarkerAddEvent()} />
        }

        {/* DAYS FILTER */}
        <div style={styles.filtersContainer} className={'mapboxFiltersContainer'}>
          {this.props.daysArr.map((day, i) => {
            let isChecked = this.props.mapbox.daysToShow.includes(day)
            return (
              <div key={`day${day}`} style={styles.filtersRow} onClick={() => this.clickDayCheckbox(day)}>
                {isChecked &&
                  <i className='material-icons'>check_box</i>
                }
                {!isChecked &&
                  <i className='material-icons'>check_box_outline_blank</i>
                }
                <span style={styles.filtersText}>Day {day}</span>
              </div>
            )
          })}
          <div key={`bucketCheckbox`} style={{...styles.filtersRow, color: 'rgb(237, 106, 90)'}} onClick={() => this.clickBucketCheckbox()}>
            {this.props.mapbox.bucketCheckbox &&
              <i className='material-icons'>check_box</i>
            }
            {!this.props.mapbox.bucketCheckbox &&
              <i className='material-icons'>check_box_outline_blank</i>
            }
            <span style={styles.filtersText}>Bucket</span>
          </div>
        </div>

        {this.state.eventMarkersToDisplay.map((event, i) => {
          let isActiveEvent = this.props.activeEventId === event.id
          return (
            <Marker key={i} coordinates={[event.longitudeDisplay, event.latitudeDisplay]} anchor='bottom' style={{...styles.markerContainer, zIndex: isActiveEvent ? 4 : 3}} onClick={(evt) => this.onEventMarkerClick(event.id, evt)}>
              <i className='material-icons' style={{color: isActiveEvent ? 'red' : 'rgb(67, 132, 150)', fontSize: '35px'}}>place</i>
            </Marker>
          )
        })}

        {activeEvent && activeEventHasCoordinates && this.props.mapbox.popupToShow === 'event' &&
          <PopupTemplate longitude={activeEvent.longitudeDisplay} latitude={activeEvent.latitudeDisplay} markerType='event' locationObj={activeEventLocationObj} activeEventId={this.props.activeEventId} activeEventLocationObj={activeEventLocationObj} daysArr={this.props.daysArr} closePopup={() => this.closePopup()} saveCustomLocation={() => this.saveCustomLocation()} saveCustomAddress={() => this.saveCustomAddress()} customMarkerAddEvent={() => this.customMarkerAddEvent()} saveSearchLocation={() => this.saveSearchLocation()} saveSearchAddress={() => this.saveSearchAddress()} searchMarkerAddEvent={() => this.searchMarkerAddEvent()} saveBucketLocation={() => this.saveBucketLocation()} saveBucketAddress={() => this.saveBucketAddress()} bucketMarkerAddEvent={() => this.bucketMarkerAddEvent()} />
        }

        //BUCKET MARKERS + BUCKET FOCUSED MARKER
        {this.props.mapbox.bucketCheckbox && this.state.bucketMarkersToDisplay.map((bucket, i) => {
          let isActiveBucket = this.props.bucketList.focusedBucketId === bucket.id
          return (
            <Marker key={i} coordinates={[bucket.location.longitude, bucket.location.latitude]} anchor='bottom' style={{...styles.markerContainer, zIndex: isActiveBucket ? 4 : 3}} onClick={() => this.onBucketMarkerClick(bucket.id)}>
              <i className='material-icons' style={{color: isActiveBucket ? 'purple' : 'purple', fontSize: '35px'}}>place</i>
            </Marker>
          )
        })
        }

        {!this.props.mapbox.bucketCheckbox && this.props.bucketList.focusedBucketId &&
          <Marker coordinates={[activeBucketMarker.location.longitude, activeBucketMarker.location.latitude]} anchor='bottom' style={styles.markerContainer} onClick={() => this.onSingleBucketMarkerClick()}>
            <i className='material-icons' style={{color: 'purple', fontSize: '35px'}}>place</i>
          </Marker>
        }

        {activeBucketMarker && this.props.mapbox.popupToShow === 'bucket' &&
          <PopupTemplate longitude={activeBucketMarker.location.longitude} latitude={activeBucketMarker.location.latitude} markerType='bucket' locationObj={activeBucketMarker.location} activeEventId={this.props.activeEventId} activeEventLocationObj={activeEventLocationObj} daysArr={this.props.daysArr} closePopup={() => this.closePopup()} saveCustomLocation={() => this.saveCustomLocation()} saveCustomAddress={() => this.saveCustomAddress()} customMarkerAddEvent={() => this.customMarkerAddEvent()} saveSearchLocation={() => this.saveSearchLocation()} saveSearchAddress={() => this.saveSearchAddress()} searchMarkerAddEvent={() => this.searchMarkerAddEvent()} saveBucketLocation={() => this.saveBucketLocation()} saveBucketAddress={() => this.saveBucketAddress()} bucketMarkerAddEvent={() => this.bucketMarkerAddEvent()} />
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
    mapbox: state.mapbox,
    bucketList: state.bucketList
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
    clickBucketCheckbox: () => {
      dispatch(clickBucketCheckbox())
    },
    updateActiveEvent: (id) => {
      dispatch(updateActiveEvent(id))
    },
    setRightBarFocusedTab: (tabName) => {
      dispatch(setRightBarFocusedTab(tabName))
    },
    updateEvent: (id, property, value, fromSidebar) => {
      dispatch(updateEvent(id, property, value, fromSidebar))
    },
    setFocusedBucketId: (id) => {
      dispatch(setFocusedBucketId(id))
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
