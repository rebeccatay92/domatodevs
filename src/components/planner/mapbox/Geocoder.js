import { Component } from 'react'
import PropTypes from 'prop-types'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'

class Geocoder extends Component {
  componentDidMount () {
    const { map } = this.context
    map.addControl(
      new MapboxGeocoder({
        accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
      })
    )
  }

  render () {
    return null
  }

  static contextTypes = {
    map: PropTypes.object.isRequired
  }
}

export default Geocoder
