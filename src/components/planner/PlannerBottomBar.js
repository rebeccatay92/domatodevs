import React, { Component } from 'react'

import { connect } from 'react-redux'
import { switchToTableView, switchToMapView } from '../../actions/planner/plannerViewActions'

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
        {this.props.plannerView.tablePlanner &&
          <div key={'plannerBottomBarTab1'} style={styles.tabContainer} onClick={() => this.props.switchToMapView()}>
            <span>Switch to map</span>
          </div>
        }
        {this.props.plannerView.mapbox &&
          <div key={'plannerBottomBarTab2'} style={styles.tabContainer} onClick={() => this.props.switchToTableView()}>
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

const mapStateToProps = (state) => {
  return {
    plannerView: state.plannerView
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    switchToMapView: () => {
      dispatch(switchToMapView())
    },
    switchToTableView: () => {
      dispatch(switchToTableView())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(PlannerBottomBar))
