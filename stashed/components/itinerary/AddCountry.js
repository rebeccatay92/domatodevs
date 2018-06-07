import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { createCountriesItineraries, itinerariesByUser } from '../../apollo/itinerary'

class AddCountry extends Component {
  constructor (props) {
    super(props)
    this.state = {
      countryCode: ''
    }
  }

  handleChange (e) {
    this.setState({countryCode: e.target.value})
  }

  handleSubmit (e) {
    e.preventDefault()
    console.log('countryCode is', this.state.countryCode)
    this.props.createCountriesItineraries({
      variables: {
        ItineraryId: this.props.ItineraryId,
        countryCode: this.state.countryCode
      },
      refetchQueries: [{
        query: itinerariesByUser
      }]
    })
  }

  render () {
    return (
      <form>
        <input type='text' onChange={(e) => this.handleChange(e)} />
        <button type='submit' onClick={(e) => this.handleSubmit(e)}>Add country by countryCode</button>
      </form>
    )
  }
}

export default connect(null)(compose(graphql(createCountriesItineraries, {name: 'createCountriesItineraries'})(AddCountry)))
