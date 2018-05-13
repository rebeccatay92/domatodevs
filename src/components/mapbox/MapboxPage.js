import React, { Component } from 'react'

// import ReactMapGL, { NavigationControl, Marker } from 'react-map-gl'
import ReactMapboxGL, { ZoomControl } from 'react-mapbox-gl'

// factory
const Map = ReactMapboxGL({
  accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
})

const mapStyle = 'mapbox://styles/mapbox/streets-v10'

class MapboxPage extends Component {
  constructor (props) {
    super(props)
    // this.state = {
    //   viewport: {
    //     width: 1265, // 1920px - 335 left bar.
    //     height: 872,
    //     latitude: 1.3521,
    //     longitude: 103.8198,
    //     zoom: 8
    //   }
    // }
    this.state = {
      center: [0, 0], // long/lat in that order to match GeoJSON
      zoom: [0], // needs to be wrapped in array
      containerStyle: {
        height: '872px',
        width: '1585px' // has to start with larger version. if smaller, changing containerStyle does not fetch more tiles.
      }
    }
  }
  // for 1920px width, map will toggle betwen 1585 and 1265
  // hook it up for state of event sidebar
  toggleMapSize () {
    this.setState({
      containerStyle: {
        ...this.state.containerStyle,
        width: this.state.containerStyle.width === '1585px' ? '1265px' : '1585px'
      }
    })
  }

  // synx state with map's final zoom and center
  // this only handles zoom. what about drag/pan?
  // onMapZoomEnd (map, evt) {
  //   console.log('zoom end center', map.getCenter())
  //   this.setState({
  //     zoom: [map.getZoom()],
  //     center: [map.getCenter().lng, map.getCenter().lat]
  //   }, () => console.log('updated state', this.state))
  // }

  // more generic. fires for dragging, zooming, anything as long as bounds change
  onMapMoveEnd (map, evt) {
    this.setState({
      zoom: [map.getZoom()],
      center: [map.getCenter().lng, map.getCenter().lat]
    }, () => console.log('updated state after move-end', this.state))
  }

  render () {
    return (
      <div style={{display: 'flex'}}>
        <div style={{width: '335px', height: '872px', border: '1px solid black'}}>
          <button onClick={() => this.toggleMapSize()}>Change map size</button>
        </div>
        <Map style={mapStyle} zoom={this.state.zoom} containerStyle={this.state.containerStyle} onStyleLoad={el => { this.map = el }} onMoveEnd={(map, evt) => this.onMapMoveEnd(map, evt)}>
          <ZoomControl position='top-left' />
        </Map>
      </div>
    )
  }
}

export default MapboxPage

{/* <ReactMapGL {...this.state.viewport} mapStyle={'mapbox://styles/mapbox/streets-v10'} mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN} onViewportChange={(viewport) => this.setState({viewport})}>
<div style={{position: 'absolute', left: 0}}>
<NavigationControl onViewportChange={(viewport) => this.setState({viewport})} showCompass={false} />
</div>
<Marker latitude={0} longitude={0}>
<div style={{borderRadius: '50%', width: '50px', height: '50px', background: 'red'}}>Testing</div>
</Marker>
</ReactMapGL> */}
