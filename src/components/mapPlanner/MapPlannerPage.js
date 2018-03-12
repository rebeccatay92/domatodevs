import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { initializePlanner } from '../../actions/plannerActions'
import { clearOpenCreateFormParams, setCurrentlyFocusedEvent } from '../../actions/mapPlannerActions'

import { queryItinerary } from '../../apollo/itinerary'
import SideBarPlanner from './SideBarPlanner'
import MapPlannerHOC from './MapPlannerHOC'
import CreateEventFormHOC from '../createEvent/CreateEventFormHOC'

const _ = require('lodash')

const backgroundColor = '#FAFAFA'

function constructDatesArrUnix (startDateUnix, days) {
  let datesArrUnix = [startDateUnix]
  while (datesArrUnix.length < days) {
    datesArrUnix.push(datesArrUnix[datesArrUnix.length - 1] + 86400)
  }
  return datesArrUnix
}

const getDates = (startDate, days) => {
  let dateArray = []
  let currentDate = new Date(startDate)
  while (dateArray.length < days) {
    dateArray.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return dateArray
}

class MapPlannerPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      startDate: null,
      days: null,
      datesArr: null, // keep null instead of [] so components know to display day dropdown. DATES ARR IS IN UNIX (SECS) FOR MAPPLANNER
      daysArr: [], // keep as empty arr. first render needs a daysArr.map,
      datesArrForForm: null
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.data.findItinerary !== nextProps.data.findItinerary) {
      const allEvents = nextProps.data.findItinerary.events
      // const activitiesWithTimelineErrors = checkForTimelineErrorsInPlanner(allEvents)
      // console.log(activitiesWithTimelineErrors)
      // this.props.initializePlanner(activitiesWithTimelineErrors)
      this.props.initializePlanner(allEvents)

      var startDate = nextProps.data.findItinerary.startDate
      var days = nextProps.data.findItinerary.days

      this.setState({startDate: startDate, days: days})
      if (startDate && days) {
        var datesArr = constructDatesArrUnix(startDate, days)
        this.setState({datesArr: datesArr})

        // construct js date obj arr just for eventFormHOC
        var jsDatesArr = getDates(startDate * 1000, days)
        // console.log('jsDatesArr', jsDatesArr)
        // var datesArrForForm = jsDatesArr.map(date => {
        //   return date.getTime()
        // })
        // console.log('datesArrForForm', datesArrForForm)
        this.setState({datesArrForForm: jsDatesArr})
      }
      var daysArr = _.range(1, days + 1)
      this.setState({daysArr: daysArr})
    }
  }

  componentDidMount () {
    if (this.props.data.findItinerary) {
      var allEvents = this.props.data.findItinerary.events
      this.props.initializePlanner(allEvents)

      var startDate = this.props.data.findItinerary.startDate
      var days = this.props.data.findItinerary.days

      // startDate is unix (secs)
      this.setState({startDate: startDate, days: days})

      if (startDate && days) {
        var datesArr = constructDatesArrUnix(startDate, days)
        this.setState({datesArr: datesArr})

        // construct js date obj arr just for eventFormHOC
        var jsDatesArr = getDates(startDate * 1000, days)
        // console.log('js datesArr', jsDatesArr)
        // var datesArrForForm = jsDatesArr.map(date => {
        //   return date.getTime()
        // })
        // console.log('datesArrForForm', datesArrForForm)
        this.setState({datesArrForForm: jsDatesArr})
      }
      var daysArr = _.range(1, days + 1)
      this.setState({daysArr: daysArr})
    }
  }

  // closeCreateEventForm () {
  //   console.log('close create event form')
  //   this.props.clearOpenCreateFormParams()
  // }

  mapCreateEventFormSuccess (eventObj) {
    console.log('focusEventObj', eventObj)

    // set days filter, setCurrentlyFocusedEvent, clear search markers, clearOpenCreateFormParams
    // this.props.clearOpenCreateFormParams()
    // this.props.setCurrentlyFocusedEvent()
  }

  mapCreateEventFormCancel () {
    this.props.clearOpenCreateFormParams()
  }

  render () {
    if (this.props.data.loading) {
      return (
        <h1 style={{marginTop: '60px'}}>Loading</h1>
      )
    }
    return (
      <div>
        <div style={{marginTop: '60px', height: 'calc(100vh - 60px)', width: '1920px'}}>
          <div style={{display: 'inline-block', verticalAlign: 'top', width: '15%', height: 'calc(100vh - 60px)', background: backgroundColor, overflow: 'hidden'}}>
            <div style={{overflowY: 'scroll', width: '107%', height: '100%', paddingRight: '7%'}}>
              <SideBarPlanner itinerary={this.props.data.findItinerary} itineraryId={this.props.match.params.itineraryId} events={this.props.events} days={this.state.days} daysArr={this.state.daysArr} datesArr={this.state.datesArr} />
            </div>
          </div>
          <div style={{display: 'inline-block', verticalAlign: 'top', left: '15%', width: '50%', height: 'calc(100vh - 60px)'}}>
            <MapPlannerHOC ItineraryId={this.props.match.params.itineraryId} events={this.props.events} days={this.state.days} daysArr={this.state.daysArr} datesArr={this.state.datesArr} />
          </div>
          {/* <div style={{display: 'inline-block', verticalAlign: 'top', right: '0', width: '15%', height: 'calc(100vh - 60px)', background: backgroundColor}}>BUCKET</div> */}
        </div>

        {/* <MORE> FORMS ARE ANCHORED HERE. PASS DATES ARR, DATE AS JS DATE OBJS. DEFAULTGOOGLEPLACEDATA IS MARKER LOCATION. */}
        <div>
          {this.props.openCreateFormParams.toOpen &&
            <CreateEventFormHOC openedFromMap ItineraryId={this.props.match.params.itineraryId} day={this.props.openCreateFormParams.defaultStartDay} date={this.state.datesArrForForm[this.props.openCreateFormParams.defaultStartDay - 1]} dates={this.state.datesArrForForm} daysArr={this.state.daysArr} eventType={this.props.openCreateFormParams.eventType} defaultStartDay={this.props.openCreateFormParams.defaultStartDay} defaultEndDay={this.props.openCreateFormParams.defaultEndDay} defaultStartTime={this.props.openCreateFormParams.defaultStartTime} defaultEndTime={this.props.openCreateFormParams.defaultEndTime} defaultDescription={this.props.openCreateFormParams.defaultDescription} defaultGooglePlaceData={this.props.openCreateFormParams.defaultGooglePlaceData} defaultArrivalGooglePlaceData={this.props.openCreateFormParams.defaultArrivalGooglePlaceData} mapCreateEventFormSuccess={(eventObj) => this.mapCreateEventFormSuccess(eventObj)} mapCreateEventFormCancel={() => this.mapCreateEventFormCancel()} />
          }
        </div>
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
    events: state.plannerActivities,
    openCreateFormParams: state.openCreateFormParams
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializePlanner: (activities) => {
      dispatch(initializePlanner(activities))
    },
    clearOpenCreateFormParams: () => {
      dispatch(clearOpenCreateFormParams())
    },
    setCurrentlyFocusedEvent: (eventObj) => {
      dispatch(setCurrentlyFocusedEvent(eventObj))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(graphql(queryItinerary, options)(MapPlannerPage))
