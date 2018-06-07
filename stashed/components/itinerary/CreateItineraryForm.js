import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'

import { createItinerary, itinerariesByUser } from '../../apollo/itinerary'
// import { allCountries } from '../../apollo/country'

class CreateItineraryForm extends Component {
  constructor () {
    super()
    this.state = {
      name: 'My Itinerary',
      description: 'Description of itinerary',
      // CountryId: null,
      days: 1,
      startDate: null
    }
  }

  handleChange (e, field) {
    this.setState({
      [field]: e.target.value
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    var newItinerary = {}
    newItinerary.UserId = 1 // default user 1
    Object.keys(this.state).forEach(key => {
      if (key !== 'startDate') {
        newItinerary[key] = this.state[key]
      }
    })

    if (this.state.startDate) {
      var startDate = new Date(this.state.startDate)
      var startUnix = startDate.getTime() / 1000
      newItinerary.startDate = startUnix
    }

    this.props.createItinerary({
      variables: newItinerary,
      refetchQueries: [{
        query: itinerariesByUser
      }]
    })
    this.resetState()
  }

  resetState () {
    this.setState({
      name: 'My Itinerary',
      description: 'Description of itinerary',
      days: 1,
      startDate: null
    })
  }

  render () {
    // if (this.props.data.allCountries) {
    //   console.log('allCountries', this.props.data.allCountries)
    // }
    return (
      <div style={{border: '1px solid black'}}>
        <h3>Create Itinerary Form</h3>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          {/* <label>
            Country
            <select name='CountryId' value={this.state.countryCode} onChange={(e) => this.handleChange(e, 'CountryId')}>
              <option value=''>Select a country</option>
              {this.props.data.allCountries && this.props.data.allCountries.map((country, i) => {
                return <option value={country.id} key={`country${i}`}>{country.name}</option>
              })}
            </select>
          </label> */}
          <label>
            Name of this itinerary
            <input type='text' name='name' placeholder={'Name of itinerary'} value={this.state.name} onChange={(e) => this.handleChange(e, 'name')} />
          </label>
          <label>
            Description
            <input type='text' name='name' placeholder={'Description of itinerary'} value={this.state.description} onChange={(e) => this.handleChange(e, 'description')} />
          </label>
          <label>
            Number of days
            <input type='number' name='days' placeholder={1} min={1} max={30} step={1} onChange={(e) => this.handleChange(e, 'days')} />
          </label>
          <label>
            Start Date
            <input type='date' name='startDate' onChange={(e) => this.handleChange(e, 'startDate')} />
          </label>
          <button type='submit'>Add itinerary with apollo</button>
        </form>
      </div>
    )
  }
}

export default compose(
  // graphql(allCountries),
  graphql(createItinerary, {name: 'createItinerary'})
)(CreateItineraryForm)
