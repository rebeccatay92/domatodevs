import React, { Component } from 'react'
import Planner from './Planner'
import { plannerPageStyles, plannerStyle, bucketStyle, bucketTitleStyle } from '../Styles/styles'
// import BucketList from './BucketList'

class PlannerPage extends Component {
  render () {
    return (
      <div style={plannerPageStyles}>
        <div style={plannerStyle}>
          {/* <h1>Short Trip to Thailand</h1> */}
          <Planner id={this.props.match.params.itineraryId} />
        </div>
        {/* <div style={bucketStyle}>
          <p style={bucketTitleStyle}>BUCKETLIST</p>
          <BucketList />
        </div> */}
      </div>
    )
  }
}

export default PlannerPage
