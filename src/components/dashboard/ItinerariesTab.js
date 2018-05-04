import React, { Component } from 'react'

import { ItinerariesTabStyles as styles } from '../../Styles/ItinerariesTabStyles'

class ItinerariesTab extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <div style={styles.itinerariesTabContainer}>
        Itineraries tab
      </div>
    )
  }
}

export default ItinerariesTab
