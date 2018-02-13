import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { initializePlanner } from '../../actions/plannerActions'
import { queryItinerary } from '../../apollo/itinerary'
import SideBarPlanner from './SideBarPlanner'
import MapPlannerHOC from './MapPlannerHOC'

const backgroundColor = '#FAFAFA'

class MapPlannerPage extends Component {
  render () {
    return (
      <div>
        <div style={{position: 'absolute', display: 'inline-block', bottom: '0', width: '15%', height: '94vh', background: backgroundColor}}>
          <SideBarPlanner events={this.props.events} />
        </div>
        <div style={{position: 'absolute', display: 'inline-block', bottom: '0', left: '15%', width: '70%', height: '94vh'}}>
          <MapPlannerHOC />
        </div>
        <div style={{position: 'absolute', display: 'inline-block', bottom: '0', right: '0', width: '15%', height: '94vh', background: backgroundColor}}>BUCKET</div>
      </div>
    )
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.data.findItinerary !== nextProps.data.findItinerary) {
      const allEvents = nextProps.data.findItinerary.events
      // const activitiesWithTimelineErrors = checkForTimelineErrorsInPlanner(allEvents)
      // console.log(activitiesWithTimelineErrors)
      // this.props.initializePlanner(activitiesWithTimelineErrors)
      console.log(allEvents)
      this.props.initializePlanner(allEvents)
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
