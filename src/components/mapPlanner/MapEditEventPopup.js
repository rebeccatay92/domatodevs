import React, { Component } from 'react'
import { connect } from 'react-redux'
import { includeDayInDaysFilter, setCurrentlyFocusedEvent, clearCurrentlyFocusedEvent, setOpenEditFormParams } from '../../actions/mapPlannerActions'

import MapDateTimePicker from './MapDateTimePicker'
import MapLocationSearchDropdown from './MapLocationSearchDropdown'
import MapEventToggles from './MapEventToggles'
import MapPopupOpeningHours from './MapPopupOpeningHours'

import { constructGooglePlaceDataObj } from '../../helpers/location'
import updateEventLoadSeqAssignment from '../../helpers/updateEventLoadSeqAssignment'

import { Button } from 'react-bootstrap'

import { graphql, compose } from 'react-apollo'
import { queryItinerary } from '../../apollo/itinerary'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { updateActivity } from '../../apollo/activity'
import { updateFood } from '../../apollo/food'
import { updateLodging } from '../../apollo/lodging'
import { updateLandTransport } from '../../apollo/landtransport'

import moment from 'moment'
const _ = require('lodash')

const apolloUpdateEventNaming = {
  'Activity': 'updateActivity',
  'Food': 'updateFood',
  'Lodging': 'updateLodging',
  'LandTransport': 'updateLandTransport'
}

const mapInfoBoxButtonStyle = {marginRight: '8px', marginBottom: '8px', backgroundColor: 'white', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', color: 'rgba(60, 58, 68, 0.7)', height: '30px', fontSize: '12px', padding: '6px'}

class MapEditEventPopup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      eventType: 'Activity', // fixed event type
      googlePlaceData: null, // obj holding current marker location. might be location, or arrival or departure location. ie this is departureLocation for a transport start:true row.
      departureGooglePlaceData: null, // transport/flight
      arrivalGooglePlaceData: null,
      start: null, // is clickedMarker a startingRow?
      startDay: 1,
      endDay: 1,
      startTime: null,
      endTime: null,
      description: '', // activity, food, lodging
      locationSearchIsFor: '',
      isLocationSearching: false,
      searchStr: '',
      searchResults: [],
      eventObj: null, // currentlyFocusedEvent params. not the row in db.
      eventRowInDb: null // store the FlightInstance, Activity etc row
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.marker !== nextProps.marker) {
      var marker = nextProps.marker
      var eventType = marker.eventType

      if (eventType !== 'Flight') {
        var event = marker.event
      } else {
        event = marker.event.FlightInstance
      }
      // console.log('marker', marker)
      // console.log('event row', event)

      var startDay = event.startDay
      var endDay = event.endDay
      var startTime = event.startTime
      var endTime = event.endTime
      if (eventType === 'Activity' || eventType === 'Food' || eventType === 'Lodging') {
        var description = event.description
        var googlePlaceData = marker.location
      }
      if (eventType === 'LandTransport' || eventType === 'Flight') {
        // check marker start is true or false to assign either departure or arrival to location.
        if (marker.start) {
          googlePlaceData = event.departureLocation
          var start = true
          var searchStr = event.arrivalLocation.name
          var locationSearchIsFor = 'arrival'
        } else {
          googlePlaceData = event.arrivalLocation
          start = false
          searchStr = event.departureLocation.name
          locationSearchIsFor = 'departure'
        }
        var arrivalGooglePlaceData = event.arrivalLocation
        var departureGooglePlaceData = event.departureLocation
      }

      this.setState({
        eventType,
        startDay,
        endDay,
        startTime,
        endTime,
        description,
        googlePlaceData,
        arrivalGooglePlaceData,
        departureGooglePlaceData,
        start,
        locationSearchIsFor: locationSearchIsFor || '',
        searchStr: searchStr || '',
        eventRowInDb: event
      })
    }
  }

  componentDidMount () {
    var marker = this.props.marker
    var eventType = marker.eventType

    if (eventType !== 'Flight') {
      var event = marker.event
    } else {
      event = marker.event.FlightInstance
    }
    // console.log('marker', marker)
    console.log('event row', event)

    var startDay = event.startDay
    var endDay = event.endDay
    var startTime = event.startTime
    var endTime = event.endTime
    if (eventType === 'Activity' || eventType === 'Food' || eventType === 'Lodging') {
      var description = event.description
      var googlePlaceData = marker.location
    }
    if (eventType === 'LandTransport' || eventType === 'Flight') {
      // check marker start is true or false to assign either departure or arrival to location.
      if (marker.start) {
        googlePlaceData = event.departureLocation
        var start = true
        var searchStr = event.arrivalLocation.name
        var locationSearchIsFor = 'arrival'
      } else {
        googlePlaceData = event.arrivalLocation
        start = false
        searchStr = event.departureLocation.name
        locationSearchIsFor = 'departure'
      }
      var arrivalGooglePlaceData = event.arrivalLocation
      var departureGooglePlaceData = event.departureLocation
    }

    this.setState({
      eventType,
      startDay,
      endDay,
      startTime,
      endTime,
      description,
      googlePlaceData,
      arrivalGooglePlaceData,
      departureGooglePlaceData,
      start,
      locationSearchIsFor: locationSearchIsFor || '',
      searchStr: searchStr || '',
      eventRowInDb: event
    })
  }

  closePlannerPopup () {
    console.log('close planner popup. ie remove focus')
    this.props.clearCurrentlyFocusedEvent()
  }

  openEditEventForm () {
    console.log('open edit event form', this.state.eventType)
    // construct openEditFormParams, dispatch redux
    // copy edited fields over into form.
    // with the exception of flight.
    if (this.state.eventType !== 'Flight') {
      var params = {
        toOpen: true,
        eventType: this.state.eventType,
        eventRow: this.state.eventRowInDb,
        defaultStartDay: this.state.startDay,
        defaultEndDay: this.state.endDay,
        defaultStartTime: this.state.startTime,
        defaultEndTime: this.state.endTime,
        defaultDescription: this.state.description,
        defaultGooglePlaceData: this.state.googlePlaceData,
        defaultDepartureGooglePlaceData: this.state.departureGooglePlaceData,
        defaultArrivalGooglePlaceData: this.state.arrivalGooglePlaceData
      }
      // console.log('params', params)
      this.props.setOpenEditFormParams(params)
    } else {
      // if flight, just open the edit form. nothing to copy over
      params = {
        toOpen: true,
        eventType: 'Flight',
        eventRow: this.state.eventRowInDb // flightInstanceRow
      }
      // console.log('params', params)
      this.props.setOpenEditFormParams(params)
    }
  }

  handleSubmit () {
    // console.log('state', this.state)
    // im not gonna bother comparing fields against props to see if it has changed
    var temp = {
      id: this.props.marker.modelId,
      startDay: this.state.startDay,
      endDay: this.state.endDay,
      startTime: this.state.startTime,
      endTime: this.state.endTime
    }
    if (this.state.eventType === 'Activity' || this.state.eventType === 'Food' || this.state.eventType === 'Lodging') {
      temp.description = this.state.description
    }
    if (this.state.eventType === 'LandTransport') {
      if (this.state.locationSearchIsFor === 'arrival') {
        // attach googlePlaceData only if the id is missing (ie new selection)
        if (!this.state.arrivalGooglePlaceData.id) {
          temp.arrivalGooglePlaceData = this.state.arrivalGooglePlaceData
        }
      } else {
        if (!this.state.departureGooglePlaceData.id) {
          temp.departureGooglePlaceData = this.state.departureGooglePlaceData
        }
      }
    }
    // console.log('temp', temp)

    // CONSTRUCT OBJ TO SEND TO LOAD SEQ HELPER
    var helperObj = {
      startDay: this.state.startDay,
      endDay: this.state.endDay,
      startTime: this.state.startTime,
      endTime: this.state.endTime
    }
    if (this.state.eventType === 'Activity' || this.state.eventType === 'Food' || this.state.eventType === 'Lodging') {
      helperObj.utcOffset = this.state.googlePlaceData.utcOffset
    }
    if (this.state.eventType === 'LandTransport') {
      helperObj.departureUtcOffset = this.state.departureGooglePlaceData.utcOffset
      helperObj.arrivalUtcOffset = this.state.arrivalGooglePlaceData.utcOffset
    }
    // console.log('helperObj', helperObj)
    var helperOutput = updateEventLoadSeqAssignment(this.props.events, this.state.eventType, temp.id, helperObj)
    // console.log('helperOutput', helperOutput)

    if (this.state.eventType === 'LandTransport' || this.state.eventType === 'Lodging') {
      temp.startLoadSequence = helperOutput.updateEvent.startLoadSequence
      temp.endLoadSequence = helperOutput.updateEvent.endLoadSequence
    } if (this.state.eventType === 'Activity' || this.state.eventType === 'Food') {
      temp.loadSequence = helperOutput.updateEvent.loadSequence
    }

    // console.log('update temp obj to send backend', temp)

    var loadSequenceChanges = helperOutput.loadSequenceInput
    if (loadSequenceChanges.length) {
      this.props.changingLoadSequence({
        variables: {
          input: loadSequenceChanges
        }
      })
    }

    var apolloNamespace = apolloUpdateEventNaming[this.state.eventType]
    // console.log('namespace', apolloNamespace)

    this.props[`${apolloNamespace}`]({
      variables: temp,
      refetchQueries: [{
        query: queryItinerary,
        variables: {id: this.props.ItineraryId}
      }]
    }).then(resolved => {
      // console.log('resolved', resolved)
      var eventType = this.state.eventType
      var eventObj = {
        modelId: resolved.data[`${apolloNamespace}`].id,
        eventType: eventType,
        flightInstanceId: null
      }
      if (this.state.eventType === 'Activity' || this.state.eventType === 'Food') {
        eventObj.start = null
        eventObj.day = temp.startDay
        eventObj.loadSequence = temp.loadSequence
      }
      // day depends on whether this is start or end row
      // load seq also depends on start or end row
      if (this.state.eventType === 'Lodging' || this.state.eventType === 'LandTransport') {
        eventObj.start = this.state.start
        eventObj.day = this.state.start ? temp.startDay : temp.endDay
        eventObj.loadSequence = this.state.start ? temp.startLoadSequence : temp.endLoadSequence
      }

      this.setState({eventObj: eventObj}, () => {
        console.log('set state eventObj', this.state.eventObj)
      })

      // SET UP DAYS FILTER TO MATCH UPDATE EVENT DAY
      this.props.includeDayInDaysFilter(eventObj.day)

      // I DONT KNOW WHICH WILL COMPLETE FIRST, SETDAYSFILTERARR, SETSTATEPLANNER MARKERS IN PARENT COMPONENT.
      setTimeout(this.props.setCurrentlyFocusedEvent(eventObj), 1000)
    }).catch(err => {
      console.log('err', err)
    })
  }

  // HOW TO CHECK PLANNER MARKERS PROPS HAVE UPDATED CORRECTLY WITH EDITED EVENT?
  // componentDidUpdate (prevProps, prevState) {
  //   console.log('prevProps.plannerMarkers', prevProps.plannerMarkers, 'this.props', this.props.plannerMarkers)
  //   // var plannerMarkersArrEqual = _.isEqual(this.props.plannerMarkers, prevProps.plannerMarkers)
  //   if (prevState.eventObj) {
  //     console.log('eventobj', prevState.eventObj)
  //     var isUpdatedEventInPlannerMarkers = _.find(prevProps.plannerMarkers, function (e) {
  //       return (
  //         e.modelId === prevState.eventObj.modelId &&
  //         e.eventType === prevState.eventObj.eventType &&
  //         e.day === prevState.eventObj.day &&
  //         e.loadSequence === prevState.eventObj.loadSequence &&
  //         e.start === prevState.eventObj.start &&
  //         e.flightInstanceId === prevState.eventObj.flightInstanceId
  //       )
  //     })
  //     console.log('isUpdatedEventInPlannerMarkers', isUpdatedEventInPlannerMarkers)
  //   }
  // }

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
    if (field === 'searchStr') {
      this.setState({
        searchStr: e.target.value,
        isLocationSearching: true
      })
    }
  }

  clearSearch () {
    this.setState({
      isLocationSearching: false,
      searchResults: [],
      searchStr: '',
      // which data to clear depends on start:true/false
      [`${this.state.locationSearchIsFor}GooglePlaceData`]: {}
    })
  }

  closeSearchDropdown () {
    this.setState({
      isLocationSearching: false
    })
  }

  onSearchFocus () {
    this.setState({
      isLocationSearching: true
    })
  }

  customDebounce () {
    var queryStr = this.state.searchStr
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.searchLocation(queryStr)
    }, 500)
  }

  searchLocation (queryStr) {
    // clear old results first
    this.setState({searchResults: []})

    // trim whitespace. dont send req if there are no chars. also close dropdown
    queryStr = _.trim(queryStr)
    if (!queryStr.length) {
      this.setState({
        isLocationSearching: false
      })
      return
    }

    var request = {
      query: queryStr,
      location: {
        lat: this.state.googlePlaceData.latitude,
        lng: this.state.googlePlaceData.longitude
      }
    }
    var service = new window.google.maps.places.PlacesService(document.createElement('div'))
    service.textSearch(request, (resultsArr, status, pagination) => {
      // console.log('status', status)
      if (status === 'OK') {
        // console.log('results', resultsArr)
        this.setState({searchResults: resultsArr})
      }
    })
  }

  selectLocation (place) {
    // console.log('arrival or departure', this.state.locationSearchIsFor)
    var googlePlaceData = constructGooglePlaceDataObj(place)
    googlePlaceData
      .then(resolved => {
        this.setState({
          [`${this.state.locationSearchIsFor}GooglePlaceData`]: resolved,
          isLocationSearching: false,
          searchStr: resolved.name
        }, () => console.log('state', this.state))
      })
  }

  render () {
    if (!this.state.googlePlaceData) return <span>Loading</span>
    var place = this.state.googlePlaceData
    var eventType = this.state.eventType
    if (this.props.datesArr) {
      var startTime = moment.unix(this.state.eventRowInDb.startTime).utc().format('hh:mm A')
      // console.log('startTime', startTime)
      var endTime = moment.unix(this.state.eventRowInDb.endTime).utc().format('hh:mm A')
      // console.log('endTime', endTime)
      var startDate = moment.unix(this.props.datesArr[this.state.startDay - 1]).format('ddd DD/MM/YYYY')
      // console.log('startDate', startDate)
      var endDate = moment.unix(this.props.datesArr[this.state.endDay - 1]).format('ddd DD/MM/YYYY')
      // console.log('endDate', endDate)
    }
    return (
      <div>
        {/* LOCATION NAME LABEL */}
        {typeof (this.state.start) === 'boolean' && this.state.start &&
          <span style={{fontSize: '16px'}}>{place.name} (Departure)</span>
        }
        {typeof (this.state.start) === 'boolean' && !this.state.start &&
          <span style={{fontSize: '16px'}}>{place.name} (Arrival)</span>
        }
        {typeof (this.state.start) !== 'boolean' &&
          <span style={{fontSize: '16px'}}>{place.name}</span>
        }

        <MapPopupOpeningHours datesArr={this.props.datesArr} dayInt={this.state.startDay} googlePlaceData={this.state.googlePlaceData} />

        {/* DESCRIPTION / LOCATION SEARCH */}

        {(eventType === 'Activity' || eventType === 'Food' || eventType === 'Lodging') &&
          <div>
            <h5 style={{fontSize: '12px'}}>Description</h5>
            <input type='text' placeholder='Optional description' value={this.state.description} onChange={(e) => this.handleChange(e, 'description')} style={{backgroundColor: 'white', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', color: 'rgba(60, 58, 68, 1)', height: '30px', fontSize: '12px', padding: '6px', width: '100%'}} />
          </div>
        }

        {eventType === 'LandTransport' &&
          <div>

            {/* LABEL FOR LOCATION SEARCH */}
            {this.state.locationSearchIsFor === 'arrival' &&
              <h5 style={{fontSize: '12px'}}>Arrival Location</h5>
            }
            {!this.state.locationSearchIsFor === 'departure' &&
              <h5 style={{fontSize: '12px'}}>Departure Location</h5>
            }

            <input type='text' placeholder={`Search for location`} value={this.state.searchStr} onFocus={() => this.onSearchFocus()} onChange={(e) => this.handleChange(e, 'searchStr')} onKeyUp={() => this.customDebounce()} style={{backgroundColor: 'white', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', color: 'rgba(60, 58, 68, 1)', height: '30px', fontSize: '12px', padding: '6px', width: '90%'}} className={'ignoreLocationSearchInput'} />
            <i className='material-icons' style={{display: 'inline-block', fontSize: '20px', verticalAlign: 'middle', cursor: 'pointer'}} onClick={() => this.clearSearch()}>clear</i>

            {this.state.isLocationSearching && this.state.searchResults.length > 0 &&
              <div style={{width: '100%', padding: '6px', maxHeight: '120px', overflowY: 'scroll', background: 'white', position: 'absolute', zIndex: '2', border: '1px solid grey'}}>

                <MapLocationSearchDropdown outsideClickIgnoreClass={'ignoreLocationSearchInput'} searchResults={this.state.searchResults} closeSearchDropdown={() => this.closeSearchDropdown()} selectLocation={(place) => this.selectLocation(place)} />
              </div>
            }
          </div>
        }

        {eventType !== 'Flight' &&
          <MapDateTimePicker daysArr={this.props.daysArr} datesArr={this.props.datesArr} startDay={this.state.startDay} endDay={this.state.endDay} handleChange={(e, field) => this.handleChange(e, field)} startTimeUnix={this.state.startTime} endTimeUnix={this.state.endTime} formType={'edit'} />
        }
        {eventType !== 'Flight' &&
          <MapEventToggles formType={'edit'} eventType={this.state.eventType} />
        }

        {eventType === 'Flight' &&
          <div>
            <h5>Flight Details</h5>
            {this.state.start &&
              <div>
                <h5>Arrival airport: {this.state.eventRowInDb.arrivalLocation.name}</h5>
                <h5>Flight no: {this.state.eventRowInDb.flightNumber}</h5>
                <h5>Departure Terminal: {this.state.eventRowInDb.departureTerminal}</h5>
                <h5>Departure Time: {startTime}, {startDate}</h5>
              </div>
            }
            {!this.state.start &&
              <div>
                <h5>Departure airport: {this.state.eventRowInDb.departureLocation.name}</h5>
                <h5>Flight no: {this.state.eventRowInDb.flightNumber}</h5>
                <h5>Arrival Terminal: {this.state.eventRowInDb.arrivalTerminal}</h5>
                <h5>Arrival Time: {endTime}, {endDate}</h5>
              </div>
            }
          </div>
        }

        <div style={{position: 'absolute', right: '0', bottom: '0'}}>
          {eventType !== 'Flight' &&
            <Button bsStyle='danger' style={mapInfoBoxButtonStyle} onClick={() => this.handleSubmit()}>Save</Button>
          }
          <Button bsStyle='default' style={mapInfoBoxButtonStyle} onClick={() => this.closePlannerPopup()}>Cancel</Button>
          <Button bsStyle='default' style={mapInfoBoxButtonStyle} onClick={() => this.openEditEventForm()}>More</Button>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    includeDayInDaysFilter: (dayInt) => {
      dispatch(includeDayInDaysFilter(dayInt))
    },
    setCurrentlyFocusedEvent: (currentEventObj) => {
      dispatch(setCurrentlyFocusedEvent(currentEventObj))
    },
    clearCurrentlyFocusedEvent: () => {
      dispatch(clearCurrentlyFocusedEvent())
    },
    setOpenEditFormParams: (params) => {
      dispatch(setOpenEditFormParams(params))
    }
  }
}

export default connect(null, mapDispatchToProps)(compose(
  graphql(updateActivity, {name: 'updateActivity'}),
  graphql(updateFood, {name: 'updateFood'}),
  graphql(updateLodging, {name: 'updateLodging'}),
  graphql(updateLandTransport, {name: 'updateLandTransport'}),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'})
)(MapEditEventPopup))
