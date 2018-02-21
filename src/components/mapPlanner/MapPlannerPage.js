import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { initializePlanner } from '../../actions/plannerActions'
import { queryItinerary } from '../../apollo/itinerary'
import SideBarPlanner from './SideBarPlanner'
import MapPlannerHOC from './MapPlannerHOC'
const _ = require('lodash')

const backgroundColor = '#FAFAFA'

class MapPlannerPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      startDate: null,
      days: null,
      datesArr: null, // keep null instead of [] so components know to display day dropdown
      daysArr: [] // keep as empty arr. first render needs a daysArr.map
    }
  }

  render () {
    if (this.props.data.loading) {
      return (
        <h1 style={{marginTop: '60px'}}>Loading</h1>
      )
    }
    return (
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

      var startDate = nextProps.data.findItinerary.startDate
      var days = nextProps.data.findItinerary.days

      // startDate is unix (secs)
      this.setState({startDate: startDate, days: days})

      // x1000 to convert to ms for datesArr
      startDate = new Date(startDate * 1000)

      if (startDate && days) {
        var dates = getDates(startDate, days)
        var datesArr = dates.map(date => {
          return date.getTime()
        })
        this.setState({datesArr: datesArr})
      } else {
        datesArr = null
      }
      var daysArr = _.range(1, days + 1)
      this.setState({daysArr: daysArr})
    }
  }
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
