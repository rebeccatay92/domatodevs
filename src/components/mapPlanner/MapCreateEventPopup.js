import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import MapEventToggles from './MapEventToggles'
import MapDateTimePicker from './MapDateTimePicker'
import { constructGooglePlaceDataObj } from '../../helpers/location'

class MapCreateEventPopup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      googlePlaceData: {}, // use helper to construct google place details from api response
      eventType: 'Activity', // Activity/Food etcx
      ItineraryId: this.props.ItineraryId,
      startDay: 1,
      endDay: 1,
      startTime: null, // unix secs
      endTime: null,
      description: ''
    }
    // keep event state here to send to backend. submit button submits the state held here. createeventhoc only passes props down to input fields
  }

  createEvent () {
    console.log('create event', this.state.eventType)
  }

  toggleCreateEventForm () {
    console.log('open create event form', this.state.eventType)
  }

  componentDidMount () {
    var request = {placeId: this.props.placeId}
    var service = new window.google.maps.places.PlacesService(document.createElement('div'))
    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        if (place.photos && place.photos[0]) {
          place.imageUrl = place.photos[0].getUrl({maxWidth: 200})
        }
        var googlePlaceData = constructGooglePlaceDataObj(place)
        googlePlaceData
        .then(resolved => {
          this.setState({googlePlaceData: resolved})
        })
      }
    })
  }

  changeEventType (type) {
    this.setState({eventType: type})
  }

  handleChange (e, field) {
    if (field === 'description') {
      this.setState({
        description: e.target.value
      })
    } else {
      this.setState({
        [field]: e
      }, () => console.log('state', this.state))
    }
  }

  render () {
    var place = this.state.googlePlaceData
    if (!place.placeId) return <span>Loading</span>
    return (
      <div>
        <div style={{width: '100%'}}>
          <h5 style={{fontSize: '16px'}}>{place.name}</h5>

          {/* OPENING HOURS */}
          <div>
            <h5 style={{display: 'inline-block', fontSize: '12px', marginRight: '10px'}}>Opening hours: </h5>
            {place.openingHoursText &&
              <select>
                {place.openingHoursText.length && place.openingHoursText.map((text, index) => {
                  return (
                    <option key={index}>{text}</option>
                  )
                })}
              </select>
            }
            {!place.openingHoursText &&
              <h5 style={{display: 'inline-block', fontSize: '12px'}}>Not Available</h5>
            }
          </div>

          {/* DESCRIPTION OR LOCATION INPUT */}
          <div style={{width: '100%'}}>
            {this.state.eventType !== 'LandTransport' &&
              <input type='text' placeholder='Description' onChange={(e) => this.handleChange(e, 'description')} style={{backgroundColor: 'white', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', color: 'rgba(60, 58, 68, 1)', height: '30px', fontSize: '12px', padding: '6px', width: '100%'}} />
            }
            {this.state.eventType === 'LandTransport' &&
              <div>arrival location</div>
            }
          </div>

          {/* START / END DATE/DAY/TIME */}
          <MapDateTimePicker daysArr={this.props.daysArr} datesArr={this.props.datesArr} startDay={this.state.startDay} endDay={this.state.endDay} handleChange={(e, field) => this.handleChange(e, field)} />
        </div>

        <MapEventToggles eventType={this.state.eventType} changeEventType={(type) => this.changeEventType(type)} />

        <div style={{position: 'absolute', right: '0', bottom: '0'}}>
          <Button bsStyle='danger' style={mapInfoBoxButtonStyle} onClick={() => this.createEvent()}>Submit</Button>
          <Button bsStyle='default' style={mapInfoBoxButtonStyle} onClick={() => this.props.closeSearchPopup()}>Cancel</Button>
          <Button bsStyle='default' style={mapInfoBoxButtonStyle} onClick={() => this.toggleCreateEventForm()} >More</Button>
        </div>
      </div>
    )
  }
}

const mapInfoBoxButtonStyle = {marginRight: '8px', marginBottom: '8px', backgroundColor: 'white', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', color: 'rgba(60, 58, 68, 0.7)', height: '30px', fontSize: '12px', padding: '6px'}

export default MapCreateEventPopup
