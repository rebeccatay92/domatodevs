import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import MapEventToggles from './MapEventToggles'
import MapDateTimePicker from './MapDateTimePicker'
import { constructGooglePlaceDataObj } from '../../helpers/location'
// import checkStartAndEndTime from '../../helpers/checkStartAndEndTime'
import newEventLoadSeqAssignment from '../../helpers/newEventLoadSeqAssignment'

import { graphql, compose } from 'react-apollo'
import { queryItinerary } from '../../apollo/itinerary'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { createActivity } from '../../apollo/activity'
import { createFood } from '../../apollo/food'
import { createLodging } from '../../apollo/lodging'
import { createLandTransport } from '../../apollo/landtransport'

const defaultBackgrounds = {
  Activity: `${process.env.REACT_APP_CLOUD_PUBLIC_URI}activityDefaultBackground.jpg`,
  Food: `${process.env.REACT_APP_CLOUD_PUBLIC_URI}foodDefaultBackground.jpg`,
  Lodging: `${process.env.REACT_APP_CLOUD_PUBLIC_URI}lodgingDefaultBackground.jpg`,
  LandTransport: `${process.env.REACT_APP_CLOUD_PUBLIC_URI}landTransportDefaultBackground.jpg`
}

const apolloCreateEventNaming = {
  'Activity': 'createActivity',
  'Food': 'createFood',
  'Lodging': 'createLodging',
  'LandTransport': 'createLandTransport'
}

const mapInfoBoxButtonStyle = {marginRight: '8px', marginBottom: '8px', backgroundColor: 'white', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', color: 'rgba(60, 58, 68, 0.7)', height: '30px', fontSize: '12px', padding: '6px'}

class MapCreateEventPopup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      googlePlaceData: {}, // use helper to construct google place details from api response. rename as departure for transport
      eventType: 'Activity', // Activity/Food etcx
      ItineraryId: this.props.ItineraryId,
      startDay: 1,
      endDay: 1,
      startTime: null, // unix secs
      endTime: null,
      description: '', // except transport
      arrivalGooglePlaceData: {} // only for transport
    }
  }

  handleSubmit () {
    // console.log('create event', this.state.eventType)
    // console.log('state', this.state)
    var newEvent = {
      ItineraryId: this.props.ItineraryId,
      startDay: this.state.startDay,
      endDay: this.state.endDay,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      bookingStatus: false,
      backgroundImage: defaultBackgrounds[this.state.eventType]
    }

    if (this.state.eventType === 'Activity' || this.state.eventTypes === 'Food' || this.state.eventTypes === 'Lodging') {
      newEvent.googlePlaceData = this.state.googlePlaceData
      newEvent.description = this.state.description
    }
    if (this.state.eventType === 'LandTransport') {
      newEvent.departureGooglePlaceData = this.state.googlePlaceData
      newEvent.arrivalGooglePlaceData = this.state.arrivalGooglePlaceData
    }

    // break if transport doesnt hv 2 locations
    if (this.state.eventType === 'LandTransport' && !newEvent.arrivalGooglePlaceData.placeId) {
      console.log('missing arrival location')
      return
    }

    // check lodging, transport has both timings
    if ((this.state.eventType === 'LandTransport' || this.state.eventTypes === 'Lodging') && (!newEvent.startTime || !newEvent.endTime)) {
      console.log('missing time fields')
      return
    }

    // CHECKSTARTANDENDTIME BROKEN. 10AM ON DAY 1. ENDTIME MISSING. DOES NOT ASSIGN IF EVENT ROW IS A FLIGHT
    // let startEndTimeOutput = newEvent
    // // assign utcOffset, start and end timings for activity, food
    // if (this.state.eventType === 'Activity' || this.state.eventType === 'Food') {
    //   newEvent.utcOffset = newEvent.googlePlaceData.utcOffset
    //   if (typeof (newEvent.startTime) !== 'number' && typeof (newEvent.endTime) !== 'number') {
    //     startEndTimeOutput = checkStartAndEndTime(this.props.events, newEvent, 'allDayEvent')
    //   } else if (typeof (newEvent.startTime) !== 'number') {
    //     startEndTimeOutput = checkStartAndEndTime(this.props.events, newEvent, 'startTimeMissing')
    //   } else if (typeof (newEvent.endTime) !== 'number') {
    //     startEndTimeOutput = checkStartAndEndTime(this.props.events, newEvent, 'endTimeMissing')
    //   }
    // }
    if (this.state.eventType === 'Activity' || this.state.eventType === 'Food') {
      newEvent.utcOffset = newEvent.googlePlaceData.utcOffset
      if (typeof (newEvent.startTime) !== 'number' && typeof (newEvent.endTime) !== 'number') {
        console.log('missing timings')
        return
      }
    }

    // console.log('newEvent after assigning all fields, and validation', newEvent)

    var helperOutput = newEventLoadSeqAssignment(this.props.events, this.state.eventType, newEvent)
    // console.log('helperOutput', helperOutput)

    this.props.changingLoadSequence({
      variables: {
        input: helperOutput.loadSequenceInput
      }
    })

    var apolloNamespace = apolloCreateEventNaming[this.state.eventType]
    // console.log('apolloNamespace', apolloNamespace)

    this.props[`${apolloNamespace}`]({
      variables: helperOutput.newEvent,
      refetchQueries: [{
        query: queryItinerary,
        variables: {id: this.props.ItineraryId}
      }]
    })
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
      })
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
          <Button bsStyle='danger' style={mapInfoBoxButtonStyle} onClick={() => this.handleSubmit()}>Submit</Button>
          <Button bsStyle='default' style={mapInfoBoxButtonStyle} onClick={() => this.props.closeSearchPopup()}>Cancel</Button>
          <Button bsStyle='default' style={mapInfoBoxButtonStyle} onClick={() => this.toggleCreateEventForm()} >More</Button>
        </div>
      </div>
    )
  }
}

export default compose(
  graphql(createActivity, {name: 'createActivity'}),
  graphql(createFood, {name: 'createFood'}),
  graphql(createLodging, {name: 'createLodging'}),
  graphql(createLandTransport, {name: 'createLandTransport'}),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'})
)(MapCreateEventPopup)
