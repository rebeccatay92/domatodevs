import React, { Component } from 'react'

import ReactMapGL, { NavigationControl, Marker } from 'react-map-gl'

class MapboxPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      viewport: {
        width: 1260, // 1920px - 340px left bar. 375px too wide. - 320px right bar.
        height: 872,
        latitude: 1.3521,
        longitude: 103.8198,
        zoom: 8
      }
    }
  }
  // for 1920px width, map will toggle betwen 1580 and 1260
  toggleMapSize () {
    this.setState({viewport: {
      ...this.state.viewport,
      width: this.state.viewport.width === 1580 ? 1260 : 1580
    }})
  }
  render () {
    return (
      <div style={{display: 'flex'}}>
        <div style={{width: '340px', height: '872px', border: '1px solid black'}}>
          <button onClick={() => this.toggleMapSize()}>Change map size</button>
        </div>
        <ReactMapGL {...this.state.viewport} mapStyle={'mapbox://styles/mapbox/streets-v10'} mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN} onViewportChange={(viewport) => this.setState({viewport})}>
          <div style={{position: 'absolute', left: 0}}>
            <NavigationControl onViewportChange={(viewport) => this.setState({viewport})} showCompass={false} />
          </div>
          <Marker latitude={0} longitude={0}>
            <div style={{borderRadius: '50%', width: '50px', height: '50px', background: 'red'}}>Testing</div>
          </Marker>
        </ReactMapGL>
      </div>
    )
  }
}

export default MapboxPage
