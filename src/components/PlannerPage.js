import React, { Component } from 'react'

import { graphql, compose } from 'react-apollo'
import { queryItinerary } from '../apollo/itinerary'
import { getUserBucketList } from '../apollo/bucket'

import { connect } from 'react-redux'
import { toggleSpinner } from '../actions/spinnerActions'
import { initializeEvents } from '../actions/planner/eventsActions'
import { initializeItineraryDetails } from '../actions/planner/itineraryActions'
import { initializeBucketList } from '../actions/planner/bucketListActions'

import Planner from './Planner'
import PlannerLeftBar from './planner/PlannerLeftBar'
import PlannerRightBar from './planner/rightBar/PlannerRightBar'
import PlannerBottomBar from './planner/bottomBar/PlannerBottomBar'
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
    if (!nextProps.queryItinerary.loading && nextProps.queryItinerary.findItinerary !== this.props.queryItinerary.findItinerary) {
      initializeEventsHelper(nextProps.queryItinerary.findItinerary.events, this.props.initializeEvents)
      setTimeout(() => this.props.toggleSpinner(false), 250)

      // console.log('itinerary details', nextProps.queryItinerary.findItinerary)
      let itinerary = nextProps.queryItinerary.findItinerary
      let details = {
        id: itinerary.id,
        name: itinerary.name,
        description: itinerary.description,
        days: itinerary.days,
        startDate: itinerary.startDate,
        isPrivate: itinerary.isPrivate,
        countries: itinerary.countries ? itinerary.countries.map(country => {
          return {
            id: country.id,
            text: country.name,
            code: country.code
          }
        }) : []
      }
      this.props.initializeItineraryDetails(details)
    }
    if (!nextProps.getUserBucketList.loading && nextProps.getUserBucketList.getUserBucketList !== this.props.getUserBucketList.getUserBucketList) {
      this.props.initializeBucketList(nextProps.getUserBucketList.getUserBucketList.buckets, nextProps.getUserBucketList.getUserBucketList.countries)
    }
  }

  render () {
    if (this.props.queryItinerary.loading) return (<h1>Loading</h1>)
    if (this.props.getUserBucketList.loading) return (<h1>Loading</h1>)

    if (this.props.queryItinerary.findItinerary.owner.id !== this.props.userProfile.id) {
      return <h1>You are not authorized to view this itinerary</h1>
    }

    // CALCULATE DATES, DAYS HERE. DATES ARR IN UNIX (SECS).
    const startDateUnix = this.props.queryItinerary.findItinerary.startDate
    const numOfDaysInt = this.props.queryItinerary.findItinerary.days
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
            <MapboxMap daysArr={daysIntArr} itineraryId={this.props.match.params.itineraryId} />
          }
        </div>

        <PlannerRightBar daysArr={daysIntArr} datesArr={datesUnixArr} itineraryId={this.props.match.params.itineraryId} />
        <PlannerBottomBar days={numOfDaysInt} daysArr={daysIntArr} datesArr={datesUnixArr} itineraryId={this.props.match.params.itineraryId} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    plannerView: state.plannerView,
    userProfile: state.userProfile
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeEvents: (events) => {
      dispatch(initializeEvents(events))
    },
    toggleSpinner: (spinner) => {
      dispatch(toggleSpinner(spinner))
    },
    initializeItineraryDetails: (details) => {
      dispatch(initializeItineraryDetails(details))
    },
    initializeBucketList: (buckets, countries) => {
      dispatch(initializeBucketList(buckets, countries))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(queryItinerary, {
    options: props => ({
      variables: {
        id: props.match.params.itineraryId
      }
    }),
    name: 'queryItinerary'
  }),
  graphql(getUserBucketList, {name: 'getUserBucketList'})
)(PlannerPage))
