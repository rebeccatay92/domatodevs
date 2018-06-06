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

// helpers
import { initializeEventsHelper } from '../helpers/initializeEvents'

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
      initializeEventsHelper(nextProps.data.findItinerary.events, this.props.initializeEvents)
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

        <PlannerRightBar daysArr={daysIntArr} datesArr={datesUnixArr} itineraryId={this.props.match.params.itineraryId} />
        <PlannerBottomBar days={numOfDaysInt} daysArr={daysIntArr} datesArr={datesUnixArr} itinerary={this.props.data.findItinerary} />
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
