import React, { Component } from 'react'
import Planner from './Planner'
import { plannerPageStyles, plannerStyle, bucketStyle, bucketTitleStyle } from '../Styles/styles'
// import BucketList from './BucketList'

class PlannerPage extends Component {
  render () {
    return (
      <div style={plannerPageStyles}>
        {/* <div style={plannerStyle}>
          <Planner id={this.props.match.params.itineraryId} />
        </div> */}
      </div>
    )
  }
}

export default PlannerPage
