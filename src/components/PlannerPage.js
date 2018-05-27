import React, { Component } from 'react'

import { graphql } from 'react-apollo'
import { queryItinerary } from '../apollo/itinerary'

import { connect } from 'react-redux'
import { toggleSpinner } from '../actions/spinnerActions'
import { initializeEvents } from '../actions/planner/eventsActions'

import { EditorState, convertFromRaw, ContentState } from 'draft-js'

import Planner from './Planner'

import PlannerLeftBar from './planner/PlannerLeftBar'
import PlannerRightBar from './planner/PlannerRightBar'
import PlannerBottomBar from './planner/PlannerBottomBar'

import MapboxMap from './planner/mapbox/MapboxMap'

import _ from 'lodash'

function generateDatesUnixArr (startDateUnixSecs, numOfDaysInt) {
  let tempArr = []
  while (tempArr.length < numOfDaysInt) {
    tempArr.push(startDateUnixSecs + (tempArr.length * 86400))
  }
  return tempArr
}

class PlannerPage extends Component {
  constructor (props) {
    super(props)
    // PLANNER VIEW STATE IN REDUX
  }

  componentWillReceiveProps (nextProps) {
    // GRAPHQL DATA FROM BACKEND.
    if (this.props.data.findItinerary !== nextProps.data.findItinerary) {
      console.log('nextProps allevents', nextProps.data.findItinerary.events)
      const allEvents = nextProps.data.findItinerary.events.map(event => {
        return {
          ...event,
          ...{
            startTime: event.startTime ? new Date(event.startTime * 1000).toGMTString().substring(17, 22) : '',
            endTime: event.endTime ? new Date(event.endTime * 1000).toGMTString().substring(17, 22) : '',
            eventType: event.eventType ? ContentState.createFromText(event.eventType) : ContentState.createFromText(''),
            // content state for place name
            locationName: event.location ? ContentState.createFromText(event.location.name) : ContentState.createFromText(''),
            // regular json object holding verified, name, address, latlng, countrycode.
            locationObj: event.location ? {
              verified: event.location.verified,
              name: event.location.name,
              address: event.location.address,
              latitude: event.location.latitude,
              longitude: event.location.longitude,
              countryCode: event.location.country ? event.location.country.code : ''
            } : null,
            currency: event.currency ? ContentState.createFromText(event.currency) : ContentState.createFromText(''),
            cost: event.cost ? ContentState.createFromText(event.cost) : ContentState.createFromText(''),
            notes: event.notes ? ContentState.createFromText(event.notes) : ContentState.createFromText(''),
            bookingService: event.bookingService ? ContentState.createFromText(event.bookingService) : ContentState.createFromText(''),
            bookingConfirmation: event.bookingConfirmation ? ContentState.createFromText(event.bookingConfirmation) : ContentState.createFromText('')
          }
        }
      })
      this.props.initializeEvents(allEvents)
      setTimeout(() => this.props.toggleSpinner(false), 250)
    }
  }

  // PUBLIC VS PRIVATE ROUTE: REPLACE COMPONENTS WITH A PUBLIC FACING COMPONENT?
  render () {
    if (this.props.data.loading) return (<h1>Loading</h1>)

    // CALCULATE DATES, DAYS HERE. DATES ARR IN UNIX (SECS).
    const startDateUnix = this.props.data.findItinerary.startDate
    const numOfDaysInt = this.props.data.findItinerary.days

    // [1, 2, 3 ...days] props to pass Planner
    let daysIntArr = _.range(1, numOfDaysInt + 1)

    // props to pass Planner. either null or []
    let datesUnixArr = null
    if (startDateUnix) {
      datesUnixArr = generateDatesUnixArr(startDateUnix, numOfDaysInt)
    }

    return (
      <div style={{width: '100vw', minHeight: 'calc(100vh - 52px)'}}>
        {/* STYLING FOR CENTERING IS IN PLANNER ITSELF */}
        {this.props.plannerView.tablePlanner &&
          <Planner itineraryId={this.props.match.params.itineraryId} days={numOfDaysInt} daysArr={daysIntArr} datesArr={datesUnixArr} />
        }

        {/* CUSTOM LOCATION VIEW. ONLY HAS MAP + RIGHT SIDEBAR */}
        <div style={{display: 'flex'}}>
          {this.props.plannerView.leftBar &&
            <PlannerLeftBar itineraryId={this.props.match.params.itineraryId} days={numOfDaysInt} daysArr={daysIntArr} datesArr={datesUnixArr} />
          }
          {this.props.plannerView.mapbox &&
            <MapboxMap daysArr={daysIntArr} />
          }
        </div>

        <PlannerRightBar />
        <PlannerBottomBar />
      </div>
    )
  }
}

const options = {
  options: props => ({
    variables: {
      id: props.match.params.itineraryId
    }
  })
}

const mapStateToProps = (state) => {
  return {
    plannerView: state.plannerView
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeEvents: (events) => {
      dispatch(initializeEvents(events))
    },
    toggleSpinner: (spinner) => {
      dispatch(toggleSpinner(spinner))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(graphql(queryItinerary, options)(PlannerPage))
