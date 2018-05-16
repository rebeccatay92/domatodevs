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
          <span key={'plannerBottomBarTab1'} style={styles.tabText} onClick={() => this.props.changePlannerView()}>Switch to map</span>
        }
        {this.props.plannerView === 'map' &&
          <span key={'plannerBottomBarTab2'} style={styles.tabText} onClick={() => this.props.changePlannerView()}>Switch to planner</span>
        }
        <span key={'plannerBottomBarTab3'} style={styles.tabText}>Add Day</span>
        <span key={'plannerBottomBarTab4'} style={styles.tabText}>Add Event</span>
        <span key={'plannerBottomBarTab5'} style={styles.tabText}>Information</span>
      </div>
    )
  }
}

export default Radium(PlannerBottomBar)
