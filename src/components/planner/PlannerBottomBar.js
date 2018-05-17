import React, { Component } from 'react'

import Radium from 'radium'
import { PlannerBottomBarStyles as styles } from '../../Styles/PlannerBottomBarStyles'

class PlannerBottomBar extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div style={styles.plannerBottomBarContainer}>
        {this.props.plannerView === 'planner' &&
          <div key={'plannerBottomBarTab1'} style={styles.tabContainer} onClick={() => this.props.changePlannerView()}>
            <span>Switch to map</span>
          </div>
        }
        {this.props.plannerView === 'map' &&
          <div key={'plannerBottomBarTab2'} style={styles.tabContainer} onClick={() => this.props.changePlannerView()}>
            <span>Switch to planner</span>
          </div>
        }
        <div key={'plannerBottomBarTab3'} style={styles.tabContainer}>
          <span>Add Day</span>
        </div>
        <div key={'plannerBottomBarTab4'} style={styles.tabContainer}>
          <span>Add Event</span>
        </div>
        <div key={'plannerBottomBarTab5'} style={styles.tabContainer}>
          <span>Information</span>
        </div>
      </div>
    )
  }
}

export default Radium(PlannerBottomBar)