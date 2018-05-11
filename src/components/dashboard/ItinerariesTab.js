import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { itinerariesByUser } from '../../apollo/itinerary'

import { ItinerariesTabStyles as styles } from '../../Styles/ItinerariesTabStyles'

class ItinerariesTab extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    if (this.props.data.loading) return (<h1>Loading</h1>)
    console.log('itineraries', this.props.data.itinerariesByUser)
    let itineraries = this.props.data.itinerariesByUser
    return (
      <div style={styles.itinerariesTabContainer}>
        {itineraries.map((itinerary, i) => {
          return (
            <div key={i}>
              {itinerary.name}
            </div>
          )
        })}
      </div>
    )
  }
}

export default graphql(itinerariesByUser)(ItinerariesTab)
