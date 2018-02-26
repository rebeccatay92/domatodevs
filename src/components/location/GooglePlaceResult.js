import React, { Component } from 'react'
import Radium from 'radium'

const crossOriginUrl = `https://cors-anywhere.herokuapp.com/`
var key = `key=${process.env.REACT_APP_GOOGLE_API_KEY}`
var placeDetails = `https://maps.googleapis.com/maps/api/place/details/json?`

class GooglePlaceResult extends Component {
  // got rid of state since placeDetails api response is now passed directly to form, instead of used to construct googlePlaceData obj
  selectLocation () {
    var urlPlaceDetails = crossOriginUrl + placeDetails + key + `&placeid=${this.props.result.place_id}`
    fetch(urlPlaceDetails)
      .then(response => {
        return response.json()
      })
      .then(json => {
        console.log('details', json)
        this.props.selectLocation(json.result)
      })
      .catch(err => {
        console.log('err', err)
      })
  }

  render () {
    return (
      <span onClick={() => this.selectLocation()} style={{padding: '5px 5px 10px 5px', display: 'block', ':hover': {backgroundColor: 'rgb(210, 210, 210)'}}}>
        <i className='material-icons' style={{fontSize: '18px', color: '#3c3a44', verticalAlign: 'top'}}>place</i>
        <span style={{display: 'inline-block', width: '93%'}}>
          <span className='locationSearch' style={{fontSize: '1em', margin: '0', color: '#3C3A44', display: 'inline'}}>
            {this.props.result.name} <span className='locationSearch' style={{color: 'rgb(120, 120, 120)'}}>{this.props.result.formatted_address}</span>
          </span>
        </span>
      </span>
    )
  }
}

export default Radium(GooglePlaceResult)
