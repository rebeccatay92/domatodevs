import React, { Component } from 'react'

class LocationDetails extends Component {
  render () {
    return (
      <div style={{position: 'relative', display: 'inline-block', verticalAlign: 'bottom', marginLeft: '20px', width: '230px'}}>
        <h6 style={{fontWeight: 'bold'}}>Address: {this.props.locationDetails.address}</h6>
        <h6 style={{fontWeight: 'bold'}}>Tel: {this.props.locationDetails.telephone}</h6>
        <h6 style={{fontWeight: 'bold', marginBottom: 0}}>Opening: {this.props.locationDetails.openingHours}</h6>
      </div>
    )
  }
}

export default LocationDetails
