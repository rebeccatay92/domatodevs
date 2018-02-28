import React, { Component } from 'react'

class LocationDetails extends Component {
  render () {
    return (
      <div style={{position: 'absolute', bottom: '0px', display: 'inline-block', verticalAlign: 'bottom', marginLeft: '34px', width: '282px'}}>
        <span style={{display: 'block', fontSize: '16px', fontWeight: '300', marginBottom: '8px'}}>{this.props.locationDetails.address}</span>
        <span style={{display: 'block', fontSize: '16px', fontWeight: '300', marginBottom: '8px'}}>Tel: {this.props.locationDetails.telephone}</span>
        <span style={{display: 'block', fontSize: '16px', fontWeight: '300', marginBottom: 0}}>Opening: {this.props.locationDetails.openingHours}</span>
      </div>
    )
  }
}

export default LocationDetails
