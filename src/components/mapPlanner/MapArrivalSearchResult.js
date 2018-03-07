import React, { Component } from 'react'
import Radium from 'radium'

class MapArrivalSearchResult extends Component {
  selectArrivalLocation () {
    // console.log('clicked result', this.props.result)
    var request = {placeId: this.props.result.place_id}
    var service = new window.google.maps.places.PlacesService(document.createElement('div'))
    service.getDetails(request, (place, status) => {
      if (status === 'OK') {
        if (place.photos && place.photos[0]) {
          place.imageUrl = place.photos[0].getUrl({maxWidth: 200})
        }
        // console.log('place with imageUrl', place)
        this.props.selectArrivalLocation(place)
      }
    })
  }

  render () {
    return (
      <span onClick={() => this.selectArrivalLocation()} style={{width: '100%', padding: '8px', display: 'block', fontSize: '12px', ':hover': {backgroundColor: 'rgb(210, 210, 210)'}}}>
        <span style={{display: 'inline-block'}}>
          <span style={{color: '#3C3A44', display: 'inline', padding: '5px'}}>
            {this.props.result.name}
            <span style={{color: 'rgba(60, 58, 68, 0.7)'}}>
              {this.props.result.formatted_address}
            </span>
          </span>
        </span>
      </span>
    )
  }
}

export default Radium(MapArrivalSearchResult)
