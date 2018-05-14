import React, { Component } from 'react'
// import ReactMapGL, { NavigationControl, Marker } from 'react-map-gl'
import ReactMapboxGL, { ZoomControl } from 'react-mapbox-gl'

import { graphql } from 'react-apollo'
import { queryItinerary } from '../../apollo/itinerary'

import _ from 'lodash'

// react wrapper factory
const Map = ReactMapboxGL({
  accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
})

const mapStyle = 'mapbox://styles/mapbox/streets-v10'

class MapboxPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      geocodeInputField: '',
      showDropdown: false,
      geocodingResults: [],
      center: [0, 0], // lng/lat in that order to match GeoJSON
      zoom: [1], // needs to be wrapped in array
      containerStyle: {
        height: '872px',
        width: '1585px' // has to start with larger version. if smaller, changing containerStyle does not fetch more tiles.
      }
    }
    this.queryMapboxGeocodingService = _.debounce(this.queryMapboxGeocodingService, 500)
  }
  // for 1920px width, map will toggle betwen 1585 and 1265
  // hook it up to state of event sidebar
  toggleMapSize () {
    this.setState({
      containerStyle: {
        ...this.state.containerStyle,
        width: this.state.containerStyle.width === '1585px' ? '1265px' : '1585px'
      }
    })
  }

  onGeocodeInputChange (e) {
    let queryStr = e.target.value
    this.setState({
      geocodeInputField: queryStr,
      showDropdown: true
    })
    this.queryMapboxGeocodingService(queryStr)
  }

  queryMapboxGeocodingService (str) {
    console.log('debounced', str)
  }

  // synx state with map's final zoom and center
  onMapMoveEnd (map, evt) {
    this.setState({
      zoom: [map.getZoom()],
      center: [map.getCenter().lng, map.getCenter().lat]
    }, () => console.log('updated state after move-end', this.state))
  }

  componentDidMount () {
    console.log('didmount data', this.props.data)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data.findItinerary !== this.props.data.findItinerary) {
      let itinerary = nextProps.data.findItinerary
      // console.log('itinerary from backend', itinerary)
    }
  }

  render () {
    if (this.props.data.loading) {
      return (<h1>Loading</h1>)
    }
    return (
      <div style={{display: 'flex'}}>
        {/* LEFT SIDEBAR -> EVENTS */}
        <div style={{width: '335px', height: '872px', border: '1px solid black'}}>
          <button onClick={() => this.toggleMapSize()}>Change map size</button>
        </div>
        <Map style={mapStyle} zoom={this.state.zoom} containerStyle={this.state.containerStyle} onStyleLoad={el => { this.map = el }} onMoveEnd={(map, evt) => this.onMapMoveEnd(map, evt)}>
          <ZoomControl position='top-left' />
          <div style={{position: 'absolute', top: '15px', left: '50px', width: '400px', height: '35px'}}>
            <input type='text' style={{width: '400px', height: '35px', fontFamily: 'Roboto, sans-serif', fontWeight: '300', color: 'rgba(60, 58, 68, 1)', fontSize: '16px', lineHeight: '19px', padding: '8px', outline: 'none'}} placeholder='Search for a location' onChange={e => this.onGeocodeInputChange(e)} value={this.state.geocodeInputField} />
          </div>
        </Map>
        {/* RIGHT SIDE EVENTS SIDEBAR (move from app.js -> to planner / map only) */}
      </div>
    )
  }
}

const options = {
  options: props => ({
    variables: {
      id: props.match.params.ItineraryId
    }
  })
}

export default graphql(queryItinerary, options)(MapboxPage)

/* <ReactMapGL {...this.state.viewport} mapStyle={'mapbox://styles/mapbox/streets-v10'} mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN} onViewportChange={(viewport) => this.setState({viewport})}>
<div style={{position: 'absolute', left: 0}}>
<NavigationControl onViewportChange={(viewport) => this.setState({viewport})} showCompass={false} />
</div>
<Marker latitude={0} longitude={0}>
<div style={{borderRadius: '50%', width: '50px', height: '50px', background: 'red'}}>Testing</div>
</Marker>
</ReactMapGL> */

// this.state = {
//   viewport: {
//     width: 1265, // 1920px - 335 left bar.
//     height: 872,
//     latitude: 1.3521,
//     longitude: 103.8198,
//     zoom: 8
//   }
// }
