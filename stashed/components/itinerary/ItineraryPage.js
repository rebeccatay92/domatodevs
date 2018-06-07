import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { itinerariesByUser } from '../../apollo/itinerary'

import CreateItineraryForm from './CreateItineraryForm'
import Itinerary from './Itinerary'

class ItineraryPage extends Component {
  render () {
    var isAuthenticated = this.props.lock.isAuthenticated()
    if (!isAuthenticated) return <p>not logged in</p>
    if (this.props.data.loading) return <p>loading</p>

    var itinerariesByUser = this.props.data.itinerariesByUser
    if (itinerariesByUser) {
      // console.log('itinerariesByUser', itinerariesByUser)
      var itineraryList = this.props.data.itinerariesByUser.map(itinerary => {
        return (
          <Itinerary itinerary={itinerary} key={itinerary.id} />
        )
      })
    }
    return (
      <div>
        <h1>ITINERARY PAGE</h1>
        <CreateItineraryForm />
        {itineraryList}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    // token: state.token
  }
}

export default connect(mapStateToProps)(graphql(itinerariesByUser)(ItineraryPage))
