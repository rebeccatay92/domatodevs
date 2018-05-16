import React, { Component } from 'react'
import Planner from './Planner'

import PlannerRightBar from './planner/PlannerRightBar'
import PlannerBottomBar from './planner/PlannerBottomBar'

class PlannerPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      plannerView: 'planner'
    }
    // MOVE PLANNER VIEW STATE INTO REDUX
  }

  changePlannerView () {
    this.setState({
      plannerView: this.state.plannerView === 'planner' ? 'map' : 'planner'
    })
  }

  // NEED TO INITALIZE EVENTS ARR IN THIS COMPONENT, SO SHARED BETWEEN TABLE, MAP, SIDEBARS.

  // PUBLIC VS PRIVATE ROUTE: REPLACE COMPONENTS WITH A PUBLIC FACING COMPONENT?
  render () {
    return (
      <div>
        {/* PLANNER VIEW. */}
        {/* STYLING FOR CENTERING IS IN PLANNER ITSELF */}
        {this.state.plannerView === 'planner' &&
          <Planner id={this.props.match.params.itineraryId} />
        }

        {/* CUSTOM LOCATION VIEW. ONLY HAS MAP + RIGHT SIDEBAR */}

        {/* MAP PLANNER VIEW. SWOP PLANNER OUT WITH PLANNER LEFT BAR, MAP COMPONENT */}

        {/* ALWAYS VISIBLE REGARDLESS OF VIEW */}
        <PlannerRightBar />
        <PlannerBottomBar plannerView={this.state.plannerView} changePlannerView={() => this.changePlannerView()} />
      </div>
    )
  }
}

export default PlannerPage
