import React, { Component } from 'react'
import ReactMapboxGL, { ZoomControl, Marker, Popup } from 'react-mapbox-gl'
// import CustomPopup from './CustomPopup'

import { connect } from 'react-redux'
import { clickDayCheckbox } from '../../../actions/planner/mapboxActions'
import { updateActiveEvent } from '../../../actions/planner/activeEventActions'
import { setRightBarFocusedTab } from '../../../actions/planner/plannerViewActions'

import _ from 'lodash'

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
      geocodeInputField: '',
      showDropdown: false,
      geocodingResults: [],
      center: [0, 0], // lng/lat in that order to match GeoJSON
      zoom: [1], // needs to be wrapped in array
      containerStyle: {
        height: 'calc(100vh - 52px - 51px)',
        width: 'calc(100vw - 376px)' // has to start with larger version. if smaller, changing containerStyle does not fetch more tiles
      },
      eventMarkersToDisplay: []
    }
    this.queryMapboxGeocodingService = _.debounce(this.queryMapboxGeocodingService, 500)
  }

  onGeocodeInputChange (e) {
    let queryStr = e.target.value
    this.setState({
      geocodeInputField: queryStr,
      showDropdown: true
    })
    this.queryMapboxGeocodingService(queryStr)
    // this.queryHEREPlacesAutosuggest(queryStr)
    // this.queryHEREPlacesSearch(queryStr)
  }

  queryMapboxGeocodingService (queryStr) {
    console.log('debounced', queryStr)
    if (!queryStr) return
    let geocodingEndpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${queryStr}.json?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`

    fetch(geocodingEndpoint)
      .then(response => {
        return response.json()
      })
      .then(json => {
        console.log('json.features', json.features)
        this.setState({geocodingResults: json.features})
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
    if (nextProps.events.events !== this.props.events.events) {
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
    } else {
      this.props.updateActiveEvent(id)
      this.props.setRightBarFocusedTab('event')
    }
  }

  render () {
    // console.log('map', this.map)
    let activeEvent = this.state.eventMarkersToDisplay.find(e => {
      return e.id === this.props.activeEventId
    })

    return (
      <Map style={mapStyle} zoom={this.state.zoom} containerStyle={this.state.containerStyle} onStyleLoad={el => { this.map = el }} onMoveEnd={(map, evt) => this.onMapMoveEnd(map, evt)}>
        {/* ALL CONTROLS SHOULD BE ZINDEX 10 */}
        <ZoomControl position='top-left' />

        <div style={{display: 'flex', alignItems: 'center', position: 'absolute', top: '10px', left: '50px', width: '300px', height: '32px', zIndex: 10, boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.3)', border: '1px solid rgba(0, 0, 0, 0.1)', background: 'white'}}>
          <i className='material-icons' style={{marginLeft: '5px', color: 'rgba(60, 58, 68, 1)'}}>search</i>
          <input type='text' style={{width: '100%', height: '100%', fontFamily: 'Roboto, sans-serif', fontWeight: '300', color: 'rgba(60, 58, 68, 1)', fontSize: '16px', outline: 'none'}} placeholder='Search for a location' onChange={e => this.onGeocodeInputChange(e)} value={this.state.geocodeInputField} />
          <i className='material-icons' style={{cursor: 'pointer', color: 'rgba(60, 58, 68, 0.7)'}}>clear</i>

          {true &&
            <div style={{position: 'absolute', top: '32px', left: 0, width: '300px', background: 'white'}}>
              {this.state.geocodingResults.map((result, i) => {
                return <h6 key={i} style={{cursor: 'pointer', margin: 0, padding: '8px', minHeight: '35px'}}>
                  {/* MAPBOX GEOCODER */}
                  address={result.place_name} latlng={result.center[0]}, {result.center[1]}
                </h6>
              })}
            </div>
          }
        </div>
        {/* <Geocoder /> */}

        {/* DAYS FILTER */}
        <div style={{position: 'absolute', bottom: '10px', left: '10px', height: '200px', width: '150px', background: 'rgb(245, 245, 245)', zIndex: 10, padding: '10px', boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.3)', border: '1px solid rgba(0, 0, 0, 0.1)'}}>
          {this.props.daysArr.map((day, i) => {
            let isChecked = this.props.mapbox.daysToShow.includes(day)
            return (
              <label key={`day${day}`} style={{display: 'block'}}>
                <input type='checkbox' checked={isChecked} onChange={() => this.clickDayCheckbox(day)} />
                <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px'}}>Day {day}</span>
              </label>
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

        {/* HOW TO STYLE THIS!!! */}
        {activeEvent &&
          <Popup anchor='bottom' coordinates={[activeEvent.longitudeDisplay, activeEvent.latitudeDisplay]} offset={{'bottom': [0, -40]}}>
            <div style={{width: '400px', height: '200px'}}>
              <div style={{width: '400px', height: '150px', border: '1px solid rgba(223, 56, 107, 1)'}}>
                details
              </div>
              <div style={{display: 'inline-block', width: '200px', height: '35px', border: '1px solid rgba(223, 56, 107, 1)'}}>button</div>
              <div style={{display: 'inline-block', width: '200px', height: '35px', border: '1px solid rgba(223, 56, 107, 1)'}}>button</div>
            </div>
          </Popup>
        }
        {/* <CustomPopup /> */}
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
    updateActiveEvent: (id) => {
      dispatch(updateActiveEvent(id))
    },
    setRightBarFocusedTab: (tabName) => {
      dispatch(setRightBarFocusedTab(tabName))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapboxMap)
