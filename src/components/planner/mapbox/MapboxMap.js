import React, { Component } from 'react'
import ReactMapboxGL, { ZoomControl } from 'react-mapbox-gl'
// import Geocoder from './Geocoder'

import { connect } from 'react-redux'
import { clickDayCheckbox } from '../../../actions/planner/mapboxActions'

import _ from 'lodash'

// react wrapper factory
const Map = ReactMapboxGL({
  accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
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
      }
    }
    this.queryMapboxGeocodingService = _.debounce(this.queryMapboxGeocodingService, 500)
    // this.queryHEREPlacesAutosuggest = _.debounce(this.queryHEREPlacesAutosuggest, 500)
    // this.queryHEREPlacesSearch = _.debounce(this.queryHEREPlacesSearch, 500)
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
        console.log('json', json)
        this.setState({geocodingResults: json.features})
      })
      .catch(err => {
        console.log('err', err)
      })
  }

  // queryHEREPlacesAutosuggest (queryStr) {
  //   console.log('debounced', queryStr)
  //   if (!queryStr) return
  //   let endpoint = `https://places.cit.api.here.com/places/v1/autosuggest?app_id=${hereAppId}&app_code=${hereAppCode}&q=${queryStr}&at=${this.state.center[1]},${this.state.center[0]}`
  //   fetch(endpoint)
  //     .then(response => {
  //       return response.json()
  //     })
  //     .then(json => {
  //       console.log('json', json)
  //       this.setState({
  //         geocodingResults: json.results
  //       })
  //     })
  //     .catch(err => {
  //       console.log('err', err)
  //     })
  // }
  //
  // queryHEREPlacesSearch (queryStr) {
  //   console.log('debounced', queryStr)
  //   if (!queryStr) return
  //   let endpoint = `https://places.cit.api.here.com/places/v1/discover/search?app_id=${hereAppId}&app_code=${hereAppCode}&q=${queryStr}&at=${this.state.center[1]},${this.state.center[0]}`
  //   fetch(endpoint)
  //     .then(response => {
  //       return response.json()
  //     })
  //     .then(json => {
  //       console.log('json', json)
  //       this.setState({
  //         geocodingResults: json.results.items
  //       })
  //     })
  //     .catch(err => {
  //       console.log('err', err)
  //     })
  // }

  // synx state with map's final zoom and center
  onMapMoveEnd (map, evt) {
    this.setState({
      zoom: [map.getZoom()],
      center: [map.getCenter().lng, map.getCenter().lat]
    }, () => console.log('updated state after move-end', this.state))
  }

  componentDidMount () {
    // check if rightBar is displayed
    if (this.props.plannerView.rightBar) {
      console.log('active event. right bar is open, map needs to shrink')
      this.setState({
        containerStyle: {
          ...this.state.containerStyle,
          width: 'calc(100vw - 376px - 344px)'
        }
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
  }
  render () {
    return (
      <Map style={mapStyle} zoom={this.state.zoom} containerStyle={this.state.containerStyle} onStyleLoad={el => { this.map = el }} onMoveEnd={(map, evt) => this.onMapMoveEnd(map, evt)}>
        <ZoomControl position='top-left' />

        <div style={{position: 'absolute', top: '15px', left: '50px', width: '400px', height: '35px'}}>
          <input type='text' style={{width: '400px', height: '35px', fontFamily: 'Roboto, sans-serif', fontWeight: '300', color: 'rgba(60, 58, 68, 1)', fontSize: '16px', lineHeight: '19px', padding: '8px', outline: 'none'}} placeholder='Search for a location' onChange={e => this.onGeocodeInputChange(e)} value={this.state.geocodeInputField} />
          {true &&
            <div style={{width: '400px', background: 'white'}}>
              {this.state.geocodingResults.map((result, i) => {
                return <h6 key={i} style={{cursor: 'pointer', margin: 0, padding: '8px', minHeight: '35px'}}>
                  {/* MAPBOX GEOCODER */}
                  {/* {result.place_name} latlng={result.center[0]}, {result.center[1]} */}
                  {/* HERE AUTOSUGGEST */}
                  {/* Title: {result.title} Vicinity: {result.vicinity} */}
                  {/* HERE PLACES */}
                  {/* Title: {result.title} Address: {result.vicinity} */}
                </h6>
              })}
            </div>
          }
        </div>

        <div style={{position: 'absolute', bottom: '20px', left: '15px', height: '200px', width: '150px', background: 'rgb(245, 245, 245)'}}>
          {this.props.daysArr.map((day, i) => {
            let isChecked = this.props.mapbox.daysToShow.includes(day)
            return (
              <label key={`day${day}`} style={{display: 'block'}}>
                <input type='checkbox' checked={isChecked} onChange={() => this.props.clickDayCheckbox(day)} />
                <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px'}}>Day {day}</span>
              </label>
            )
          })}
        </div>
        {/* <Geocoder /> */}
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapboxMap)
