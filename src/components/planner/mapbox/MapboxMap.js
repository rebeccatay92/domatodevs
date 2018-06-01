import React, { Component } from 'react'
import ReactMapboxGL, { ZoomControl, Marker, Popup } from 'react-mapbox-gl'
import LocationCellDropdown from '../LocationCellDropdown'

import { connect } from 'react-redux'
import { clickDayCheckbox, setPopupToShow } from '../../../actions/planner/mapboxActions'
import { updateActiveEvent } from '../../../actions/planner/activeEventActions'
import { setRightBarFocusedTab } from '../../../actions/planner/plannerViewActions'
import { updateEvent } from '../../../actions/planner/eventsActions'

import { graphql, compose } from 'react-apollo'
import { updateEventBackend } from '../../../apollo/event'
import { queryItinerary } from '../../../apollo/itinerary'

import _ from 'lodash'
import { Editor, EditorState, ContentState } from 'draft-js'

import { MapboxMapStyles as styles } from '../../../Styles/MapboxMapStyles'

// react wrapper factory
const Map = ReactMapboxGL({
  accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
  minZoom: 1,
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
          // this.props.updateEvent(this.props.id, 'locationName', nameContentState, false)
          // this.props.updateEvent(this.props.id, 'locationObj', locationObj, false)
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
    // extract visble markers and offset lat lng
    if (nextProps.events.events !== this.props.events.events || nextProps.mapbox.daysToShow !== this.props.mapbox.daysToShow) {
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

  onEventMarkerClick (id) {
    // toggle activeEventId
    if (this.props.activeEventId === id) {
      this.props.updateActiveEvent('')
      this.props.setRightBarFocusedTab('')
      this.props.setPopupToShow('')
    } else {
      this.props.updateActiveEvent(id)
      this.props.setRightBarFocusedTab('event')
      this.props.setPopupToShow('event')
    }
  }

  onSearchMarkerClick () {
    if (this.props.mapbox.popupToShow !== 'search') {
      this.props.setPopupToShow('search')
    } else if (this.props.mapbox.popupToShow === 'search') {
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
      // refetchQueries: [{
      //   query: queryItinerary,
      //   variables: {
      //     id: this.props.events.events.find(e => {
      //       return e.id === EventId
      //     }).ItineraryId
      //   }
      // }]
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
      // refetchQueries: [{
      //   query: queryItinerary,
      //   variables: {
      //     id: this.props.events.events.find(e => {
      //       return e.id === EventId
      //     }).ItineraryId
      //   }
      // }]
    })

    this.clearSearch()
    this.props.setPopupToShow('event')

    let nameContentState = ContentState.createFromText(currentLocationName)
    this.props.updateEvent(EventId, 'locationName', nameContentState, false)
    this.props.updateEvent(EventId, 'locationObj', this.state.searchMarker, false)
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
        plottingCustomMarker: false
      })
      mapCanvasContainer.style.cursor = ''
    }
  }

  onMapClick (map, evt) {
    if (this.state.plottingCustomMarker) {
      console.log('coordinates', evt.lngLat.lat, evt.lngLat.lng)
      this.setState({
        customMarker: {
          latitude: evt.lngLat.lat,
          longitude: evt.lngLat.lng
        }
      })
    }
  }

  render () {
    // activeEvent is the event that was clicked (might not hv marker)
    let activeEvent = this.props.events.events.find(e => {
      return e.id === this.props.activeEventId
    })
    let activeEventLocationObj
    if (activeEvent) {
      activeEventLocationObj = activeEvent.locationObj
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
            <span>Cancel</span>
          }
        </div>

        {this.state.customMarker &&
          <Marker coordinates={[this.state.customMarker.longitude, this.state.customMarker.latitude]} anchor='bottom' style={{display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: 4}}>
            <i className='material-icons' style={{color: 'green', fontSize: '35px'}}>place</i>
          </Marker>
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
            </div>
          </Popup>
        }

        {/* DAYS FILTER */}
        <div style={styles.daysFilterContainer}>
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
            <Marker key={i} coordinates={[event.longitudeDisplay, event.latitudeDisplay]} anchor='bottom' style={{display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: isActiveEvent ? 4 : 3}} onClick={() => this.onEventMarkerClick(event.id)}>
              <i className='material-icons' style={{color: isActiveEvent ? 'red' : 'rgb(67, 132, 150)', fontSize: '35px'}}>place</i>
            </Marker>
          )
        })}

        {activeEvent && activeEvent.longitudeDisplay && activeEvent.locationObj && this.props.mapbox.popupToShow === 'event' &&
          <Popup anchor='bottom' coordinates={[activeEvent.longitudeDisplay, activeEvent.latitudeDisplay]} offset={{'bottom': [0, -40]}} style={{zIndex: 5}}>
            <div style={{width: '300px'}}>
              <i className='material-icons' style={{position: 'absolute', top: '5px', right: '5px', fontSize: '18px', cursor: 'pointer'}} onClick={() => this.closePopup()}>clear</i>
              <div style={{width: '300px', border: '1px solid rgba(223, 56, 107, 1)', padding: '16px'}}>
                <h6 style={{margin: '0 0 5px 0', fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: 'rgb(60, 58, 68)'}}>Name</h6>
                <h6 style={{margin: '0 0 16px 0', fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', lineHeight: '24px', color: 'rgb(60, 58, 68)'}}>{activeEvent.locationObj.name}</h6>
                <h6 style={{margin: '0 0 5px 0', fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: 'rgb(60, 58, 68)'}}>Address</h6>
                <h6 style={{margin: 0, fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', lineHeight: '24px', color: 'rgb(60, 58, 68)'}}>{activeEvent.locationObj.address}</h6>
              </div>
              {/* <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '300px', height: '35px', border: '1px solid rgba(223, 56, 107, 1)'}}>
                <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '16px', color: 'rgb(60, 58, 68)'}}>Delete Location</span>
              </div> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(updateEventBackend, {name: 'updateEventBackend'})
)(MapboxMap))
