import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { initializePlanner } from '../../actions/plannerActions'
import { queryItinerary } from '../../apollo/itinerary'
import SideBarPlanner from './SideBarPlanner'
import MapPlannerHOC from './MapPlannerHOC'
const _ = require('lodash')

const backgroundColor = '#FAFAFA'

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
      days: null
    }
  }

  // CALCULATE DATES ETC HERE AND PASS DOWN
  render () {
    if (this.props.data.loading) {
      return (
        <h1 style={{marginTop: '60px'}}>Loading</h1>
      )
    }
    const startDate = new Date(this.state.startDate * 1000)
    const days = this.state.days

    if (startDate && days) {
      var dates = getDates(startDate, days)
      var newDates = dates.map(date => {
        return date.getTime()
      })
    } else {
      newDates = null
    }
    var daysArr = _.range(1, days + 1)

    return (
      <div style={{marginTop: '60px', height: 'calc(100vh - 60px)', width: '1920px'}}>
        <div style={{display: 'inline-block', verticalAlign: 'top', width: '15%', height: 'calc(100vh - 60px)', background: backgroundColor, overflow: 'hidden'}}>
          <div style={{overflowY: 'scroll', width: '107%', height: '100%', paddingRight: '7%'}}>
            <SideBarPlanner itinerary={this.props.data.findItinerary} itineraryId={this.props.match.params.itineraryId} events={this.props.events} days={this.state.days} daysArr={daysArr} datesArr={newDates} />
          </div>
        </div>
        <div style={{display: 'inline-block', verticalAlign: 'top', left: '15%', width: '50%', height: 'calc(100vh - 60px)'}}>
          <MapPlannerHOC ItineraryId={this.props.match.params.itineraryId} events={this.props.events} />
        </div>
        <div style={{display: 'inline-block', verticalAlign: 'top', right: '0', width: '15%', height: 'calc(100vh - 60px)', background: backgroundColor}}>BUCKET</div>
      </div>
    )
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.data.findItinerary !== nextProps.data.findItinerary) {
      const allEvents = nextProps.data.findItinerary.events
      // const activitiesWithTimelineErrors = checkForTimelineErrorsInPlanner(allEvents)
      // console.log(activitiesWithTimelineErrors)
      // this.props.initializePlanner(activitiesWithTimelineErrors)
      console.log('allEvents', allEvents)
      this.props.initializePlanner(allEvents)
      this.setState({startDate: nextProps.data.findItinerary.startDate, days: nextProps.data.findItinerary.days})
    }
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
    events: state.plannerActivities
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializePlanner: (activities) => {
      dispatch(initializePlanner(activities))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(graphql(queryItinerary, options)(MapPlannerPage))
