import React, { Component } from 'react'

import { connect } from 'react-redux'
import { switchToTableView, switchToMapView } from '../../actions/planner/plannerViewActions'
import { updateActiveEvent } from '../../actions/planner/activeEventActions'

import Radium from 'radium'
import { PlannerBottomBarStyles as styles } from '../../Styles/PlannerBottomBarStyles'

class PlannerBottomBar extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  switchToMapView () {
    this.props.updateActiveEvent('')
    this.props.switchToMapView()
  }

  switchToTableView () {
    this.props.updateActiveEvent('')
    this.props.switchToTableView()
  }

  render () {
    return (
      <div style={styles.plannerBottomBarContainer}>
        {this.props.plannerView.tablePlanner &&
          <div key={'plannerBottomBarTab1'} style={styles.tabContainer} onClick={() => this.switchToMapView()}>
            <span>Switch to map</span>
          </div>
        }
        {this.props.plannerView.mapbox &&
          <div key={'plannerBottomBarTab2'} style={styles.tabContainer} onClick={() => this.switchToTableView()}>
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
    },
    updateActiveEvent: (id) => {
      dispatch(updateActiveEvent(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(PlannerBottomBar))
