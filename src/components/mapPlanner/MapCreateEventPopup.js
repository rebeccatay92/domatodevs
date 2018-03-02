import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import MapEventToggles from './MapEventToggles'
import { constructGooglePlaceDataObj } from '../../helpers/location'

class MapCreateEventPopup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      googlePlaceData: {}, // use helper to construct google place details from api response
      eventType: 'Activity', // Activity/Food etcx
      ItineraryId: this.props.ItineraryId,
      startDay: 0,
      endDay: 0,
      startTime: null,
      endTime: null
    }
    // keep event state here to send to backend. submit button submits the state held here. createeventhoc only passes props down to input fields
  }

  // POP UP CONTAINS CREATEEVENT COMPONENT + EVENT TYPE TOGGLES + BUTTONS

  createEvent () {
    console.log('create event', this.props.eventType)
  }

  toggleCreateEventForm () {
    console.log('open create event form', this.props.eventType)
  }

  componentDidMount () {
    var request = {placeId: this.props.placeId}
    var service = new window.google.maps.places.PlacesService(document.createElement('div'))
    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        // console.log('place details', place)
        if (place.photos && place.photos[0]) {
          place.imageUrl = place.photos[0].getUrl({maxWidth: 200})
        }
        var googlePlaceData = constructGooglePlaceDataObj(place)
        googlePlaceData
        .then(resolved => {
          this.setState({googlePlaceData: resolved}, () => console.log(this.state))
        })
      }
    })
  }

  changeEventType (type) {
    this.setState({eventType: type})
  }

  render () {
    if (!this.state.googlePlaceData.placeId) return <span>Loading</span>
    return (
      <div>
        <div style={{width: '100%', height: '160px'}}>
          <h5 onClick={() => console.log('clicked')}>{this.state.googlePlaceData.name}</h5>
          <div>
            <span>Opening hours: </span>
            <select>
              <option value='1'>test</option>
              <option value='2'>hello</option>
            </select>
          </div>
          <input type='text' />
          <div>description / arrival location</div>
          <div>start date, start day</div>
          <div>start time</div>
          <div>end date, end day</div>
          <div>end time</div>
        </div>

        <MapEventToggles eventType={this.state.eventType} changeEventType={(type) => this.changeEventType(type)} />

        <div style={{position: 'absolute', right: '0', bottom: '0'}}>
          <Button bsStyle='danger' style={{marginRight: '8px', marginBottom: '8px', backgroundColor: 'white', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', color: 'rgba(60, 58, 68, 0.7)', height: '31px', fontSize: '13px', padding: '8px'}} onClick={() => this.createEvent()}>Submit</Button>
          <Button bsStyle='default' style={{marginRight: '8px', marginBottom: '8px', backgroundColor: 'white', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', color: 'rgba(60, 58, 68, 0.7)', height: '31px', fontSize: '13px', padding: '8px'}} onClick={() => this.props.closeSearchPopup()}>Cancel</Button>
          <Button bsStyle='default' style={{marginRight: '8px', marginBottom: '8px', backgroundColor: 'white', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', color: 'rgba(60, 58, 68, 0.7)', height: '31px', fontSize: '13px', padding: '8px'}} onClick={() => this.toggleCreateEventForm()} >More</Button>
        </div>
      </div>
    )
  }
}

export default MapCreateEventPopup
