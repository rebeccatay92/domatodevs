import React, { Component } from 'react'
import { connect } from 'react-redux'
import { includeDayInDaysFilter, setCurrentlyFocusedEvent, clearCurrentlyFocusedEvent, setOpenCreateFormParams, setSearchInputStr, setSearchMarkerArr, clearFocusedSearchMarker } from '../../actions/mapPlannerActions'

import { Button } from 'react-bootstrap'
import MapEventToggles from './MapEventToggles'
import MapDateTimePicker from './MapDateTimePicker'
import MapLocationSearchDropdown from './MapLocationSearchDropdown'
import MapPopupOpeningHours from './MapPopupOpeningHours'

// import { constructGooglePlaceDataObj } from '../../helpers/location'
// import checkStartAndEndTime from '../../helpers/checkStartAndEndTime'
// import newEventLoadSeqAssignment from '../../helpers/newEventLoadSeqAssignment'

import { graphql, compose } from 'react-apollo'
import { queryItinerary } from '../../apollo/itinerary'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
// import { createActivity } from '../../apollo/activity'
// import { createFood } from '../../apollo/food'
// import { createLodging } from '../../apollo/lodging'
// import { createLandTransport } from '../../apollo/landtransport'

const _ = require('lodash')

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
      arrivalGooglePlaceData: {}, // only for transport
      eventObj: null,
      // SEARCH ARRIVAL LOCATION FOR TRANSPORT ONLY
      isLocationSearching: false,
      searchStr: '', // str to search for arrival locations
      searchResults: []
    }
  }

  handleSubmit () {
    // console.log('create event', this.state.eventType)
    // console.log('HANDLE SUBMIT STATE', this.state)

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
      .then(resolved => {
        // console.log('returning', resolved)
        var modelId = resolved.data[`${apolloNamespace}`].id
        var day = newEvent.startDay
        var eventType = this.state.eventType
        if (this.state.eventType === 'Activity' || this.state.eventType === 'Food') {
          var loadSequence = helperOutput.newEvent.loadSequence
          var start = null
        } else if (this.state.eventType === 'Lodging' || this.state.eventType === 'LandTransport') {
          loadSequence = helperOutput.newEvent.startLoadSequence
          start = true
        }
        var eventObj = {
          modelId,
          eventType,
          day,
          loadSequence,
          start,
          flightInstanceId: null
        }
        this.setState({eventObj: eventObj}, () => console.log('set state eventObj'))

        // set day filter first before setCurrentlyFocusedEvent. DAYS FILTER MUST CORRESPOND WITH THE DAY OF NEWLY CREATED EVENT.
        this.props.includeDayInDaysFilter(eventObj.day)
      })
      .catch(err => {
        console.log('err', err)
      })
  }

  openCreateEventForm () {
    console.log('open create event form', this.state.eventType)
    // construct openCreateFormParams, dispatch redux setOpenCreateFormParams
    var params = {
      toOpen: true,
      eventType: this.state.eventType,
      defaultStartDay: this.state.startDay,
      defaultEndDay: this.state.endDay,
      defaultStartTime: this.state.startTime,
      defaultEndTime: this.state.endTime,
      defaultDescription: this.state.description,
      defaultGooglePlaceData: this.state.googlePlaceData,
      defaultArrivalGooglePlaceData: this.state.arrivalGooglePlaceData
    }
    // console.log('openCreateFormParams', params)
    this.props.setOpenCreateFormParams(params)
  }

  componentDidMount () {
    var request = {placeId: this.props.placeId}
    var service = new window.google.maps.places.PlacesService(document.createElement('div'))
    service.getDetails(request, (place, status) => {
      if (status === 'OK') {
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

    if (type !== 'LandTransport') {
      this.setState({
        searchStr: '',
        isLocationSearching: false,
        searchResults: [],
        arrivalGooglePlaceData: {}
      })
    }
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
    if (field === 'searchStr') {
      this.setState({
        searchStr: e.target.value,
        isLocationSearching: true
      })
    }
  }

  componentDidUpdate (prevProps, prevState) {
    // event has been created -> state here will have eventObj. wait for parent to add new event to plannerMarkers -> trigger here.

    // if plannerMarkers change due to changing day checkbox (but popup is open) -> eventobj here is null. do not _.find
    if (this.props.plannerMarkers !== prevProps.plannerMarkers && prevState.eventObj) {
      var isCreatedEventInPlannerMarkers = _.find(this.props.plannerMarkers, function (e) {
        return (e.modelId === prevState.eventObj.modelId)
      })
      if (isCreatedEventInPlannerMarkers) {
        this.props.setSearchInputStr('')
        this.props.setSearchMarkerArr([])
        this.props.clearFocusedSearchMarker()

        this.props.clearCurrentlyFocusedEvent() // force redraw on infobox
        this.props.setCurrentlyFocusedEvent(prevState.eventObj)
      }
    }
  }

  customDebounce () {
    var queryStr = this.state.searchStr
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.searchLocation(queryStr)
    }, 500)
  }

  searchLocation (queryStr) {
    // console.log('search by str', queryStr)

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
    // var request = {
    //   bounds: LatLngBounds, LatLngBoundsLiteral,
    //   location: LatLng, LatLngLiteral,
    //   query: string,
    //   radius: numberMetres,
    //   type: string
    // }
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
    var googlePlaceData = constructGooglePlaceDataObj(place)
    googlePlaceData
      .then(resolved => {
        this.setState({
          arrivalGooglePlaceData: resolved,
          isLocationSearching: false,
          searchStr: resolved.name
        }, () => console.log('state', this.state))
      })
  }

  clearSearch () {
    this.setState({
      isLocationSearching: false,
      searchResults: [],
      searchStr: '',
      arrivalGooglePlaceData: {}
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

  render () {
    var place = this.state.googlePlaceData
    if (!place.placeId) return <span>Loading</span>
    return (
      <div>
        <div style={{width: '100%'}}>
          <h5 style={{fontSize: '16px'}}>{place.name}</h5>

          <MapPopupOpeningHours datesArr={this.props.datesArr} dayInt={this.state.startDay} googlePlaceData={this.state.googlePlaceData} />

          {/* DESCRIPTION OR LOCATION INPUT */}
          <div style={{width: '100%'}}>
            {this.state.eventType !== 'LandTransport' &&
              <div>
                <h5 style={{fontSize: '12px'}}>Description</h5>
                <input type='text' placeholder='Optional description' onChange={(e) => this.handleChange(e, 'description')} value={this.state.description} style={{backgroundColor: 'white', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', color: 'rgba(60, 58, 68, 1)', height: '30px', fontSize: '12px', padding: '6px', width: '100%'}} />
              </div>
            }
            {/* IF TRANSPORT USE PLACESSERVICE FOR ARRIVAL LOCATION */}
            {this.state.eventType === 'LandTransport' &&
              <div>
                <h5 style={{fontSize: '12px'}}>Arrival Location</h5>
                <input type='text' placeholder='Search for an arrival location' value={this.state.searchStr} onFocus={() => this.onSearchFocus()} onChange={(e) => this.handleChange(e, 'searchStr')} onKeyUp={() => this.customDebounce()} style={{backgroundColor: 'white', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', color: 'rgba(60, 58, 68, 1)', height: '30px', fontSize: '12px', padding: '6px', width: '90%'}} className={'ignoreLocationSearchInput'} />
                <i className='material-icons' style={{display: 'inline-block', fontSize: '20px', verticalAlign: 'middle', cursor: 'pointer'}} onClick={() => this.clearSearch()}>clear</i>
                {/* DROPDOWN STYLING IS BROKEN. NEED TO BE SAME WIDTH AS INPUT FIELD */}
                {this.state.isLocationSearching && this.state.searchResults.length > 0 &&
                  <div style={{width: '100%', padding: '6px', maxHeight: '120px', overflowY: 'scroll', background: 'white', position: 'absolute', zIndex: '2', border: '1px solid grey'}}>
                    {/* NOT SAME COMPONENT AS LOCATIONSEARCH/GOOGLEPLACERESULT. USES MAP PLACES SERVICE GETDETAILS INSTEAD OF JS API PLACESDETAILS */}
                    <MapLocationSearchDropdown outsideClickIgnoreClass={'ignoreLocationSearchInput'} searchResults={this.state.searchResults} closeSearchDropdown={() => this.closeSearchDropdown()} selectLocation={(place) => this.selectLocation(place)} />
                  </div>
                }
              </div>
            }
          </div>

          {/* START / END DATE/DAY/TIME */}
          <MapDateTimePicker daysArr={this.props.daysArr} datesArr={this.props.datesArr} startDay={this.state.startDay} endDay={this.state.endDay} handleChange={(e, field) => this.handleChange(e, field)} startTimeUnix={this.state.startTime} endTimeUnix={this.state.endTime} />
        </div>

        <MapEventToggles formType={'create'} eventType={this.state.eventType} changeEventType={(type) => this.changeEventType(type)} />

        <div style={{position: 'absolute', right: '0', bottom: '0'}}>
          <Button bsStyle='danger' style={mapInfoBoxButtonStyle} onClick={() => this.handleSubmit()}>Submit</Button>
          <Button bsStyle='default' style={mapInfoBoxButtonStyle} onClick={() => this.props.closeSearchPopup()}>Cancel</Button>
          <Button bsStyle='default' style={mapInfoBoxButtonStyle} onClick={() => this.openCreateEventForm()} >More</Button>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentlyFocusedEvent: (currentEventObj) => {
      dispatch(setCurrentlyFocusedEvent(currentEventObj))
    },
    clearCurrentlyFocusedEvent: () => {
      dispatch(clearCurrentlyFocusedEvent())
    },
    setOpenCreateFormParams: (params) => {
      dispatch(setOpenCreateFormParams(params))
    },
    includeDayInDaysFilter: (dayInt) => {
      dispatch(includeDayInDaysFilter(dayInt))
    },
    setSearchInputStr: (str) => {
      dispatch(setSearchInputStr(str))
    },
    setSearchMarkerArr: (arr) => {
      dispatch(setSearchMarkerArr(arr))
    },
    clearFocusedSearchMarker: () => {
      dispatch(clearFocusedSearchMarker())
    }
  }
}

export default connect(null, mapDispatchToProps)(compose(
  // graphql(createActivity, {name: 'createActivity'}),
  // graphql(createFood, {name: 'createFood'}),
  // graphql(createLodging, {name: 'createLodging'}),
  // graphql(createLandTransport, {name: 'createLandTransport'}),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'})
)(MapCreateEventPopup))
