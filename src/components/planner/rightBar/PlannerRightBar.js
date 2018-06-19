import React, { Component } from 'react'
// import { graphql, compose } from 'react-apollo'

import { connect } from 'react-redux'
import { setRightBarFocusedTab } from '../../../actions/planner/plannerViewActions'

import EventRightBar from './EventRightBar'
import BucketRightBar from './BucketRightBar'

import { PlannerRightBarStyles as styles } from '../../../Styles/PlannerRightBarStyles'

class PlannerRightBar extends Component {
  toggleRightBar (tabName) {
    let rightBar = this.props.plannerView.rightBar
    if (tabName === rightBar) {
      this.props.setRightBarFocusedTab('')
    } else {
      this.props.setRightBarFocusedTab(tabName)
    }
  }

  render () {
    return (
      <div>
        {/* TABS */}
        <div style={this.props.plannerView.rightBar === '' ? styles.tabsContainer : {...styles.tabsContainer, right: '344px'}}>
          <div style={this.props.plannerView.rightBar === 'bucket' ? styles.tabClicked : styles.tabUnclicked} onClick={() => this.toggleRightBar('bucket')}>
            <span style={styles.tabText}>Bucket</span>
          </div>
          {this.props.activeEventId &&
            <div style={this.props.plannerView.rightBar === 'event' ? styles.tabClicked : styles.tabUnclicked} onClick={() => this.toggleRightBar('event')}>
              <span style={styles.tabText}>Event</span>
            </div>
          }
        </div>

        <div style={styles.sidebarContainer}>
          {this.props.plannerView.rightBar === 'bucket' &&
            <BucketRightBar />
          }

          {this.props.plannerView.rightBar === 'event' && this.props.activeEventId &&
            <EventRightBar daysArr={this.props.daysArr} datesArr={this.props.datesArr} itineraryId={this.props.itineraryId} />
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    activeEventId: state.activeEventId,
    plannerView: state.plannerView
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setRightBarFocusedTab: (tabName) => {
      dispatch(setRightBarFocusedTab(tabName))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlannerRightBar)
