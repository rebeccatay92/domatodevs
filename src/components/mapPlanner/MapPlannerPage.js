import React, { Component } from 'react'
import SideBarPlanner from './SideBarPlanner'
import MapPlannerHOC from './MapPlannerHOC'

const backgroundColor = '#FAFAFA'

class MapPlannerPage extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <div>
        <div style={{position: 'absolute', display: 'inline-block', bottom: '0', width: '15%', height: '94vh', background: backgroundColor}}>
          <SideBarPlanner />
        </div>
        <div style={{position: 'absolute', display: 'inline-block', bottom: '0', left: '15%', width: '70%', height: '94vh'}}>
          <MapPlannerHOC />
        </div>
        <div style={{position: 'absolute', display: 'inline-block', bottom: '0', right: '0', width: '15%', height: '94vh', background: backgroundColor}}>BUCKET</div>
      </div>
    )
  }
}

export default MapPlannerPage
