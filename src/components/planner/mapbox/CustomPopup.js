import { Component } from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'

class CustomPopup extends Component {
  componentDidMount () {
    const { map } = this.context

    let markerHeight = 35

    let popup = new mapboxgl.Popup({
      offset: {
        'bottom': [0, -markerHeight]
      }
    })
    .setLngLat([0, 0])
    .setHTML("<h1>Testing</h1>")
    .addTo(map)
  }

  render () {
    return null
  }

  static contextTypes = {
    map: PropTypes.object.isRequired
  }
}

export default CustomPopup
