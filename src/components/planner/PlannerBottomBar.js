import React, { Component } from 'react'
import BottomBarItineraryInfoPanel from './BottomBarItineraryInfoPanel'

import { connect } from 'react-redux'
import { switchToTableView, switchToMapView } from '../../actions/planner/plannerViewActions'
import { updateActiveEvent } from '../../actions/planner/activeEventActions'

import { graphql, compose } from 'react-apollo'
import { updateItineraryDetails, queryItinerary } from '../../apollo/itinerary'

import Radium from 'radium'
import { PlannerBottomBarStyles as styles } from '../../Styles/PlannerBottomBarStyles'

class PlannerBottomBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showItineraryInfo: false
    }
  }

  switchToMapView () {
    this.props.updateActiveEvent('')
    this.props.switchToMapView()
  }

  switchToTableView () {
    this.props.updateActiveEvent('')
    this.props.switchToTableView()
  }

  toggleItineraryInfo () {
    if (!this.state.showItineraryInfo) {
      this.setState({
        showItineraryInfo: true
      })
    } else {
      this.closePanel()
    }
  }

  closePanel () {
    // console.log('close panel. itinerary details obj is', this.props.itineraryDetails)
    this.setState({
      showItineraryInfo: false
    })

    // send to backend and refetch
    this.props.updateItineraryDetails({
      variables: {
        id: this.props.itineraryDetails.id,
        name: this.props.itineraryDetails.name,
        description: this.props.itineraryDetails.description,
        days: this.props.itineraryDetails.days,
        startDate: this.props.itineraryDetails.startDate,
        isPrivate: this.props.itineraryDetails.isPrivate,
        countries: this.props.itineraryDetails.countries.map(e => {
          return e.id
        })
        // countries: ['1', '119', '120'] // send as string ids.
      },
      refetchQueries: [{
        query: queryItinerary,
        variables: {
          id: this.props.itineraryDetails.id
        }
      }]
    })
  }

  render () {
    // console.log('itinerary details', this.props.itineraryDetails)
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
        <div key={'plannerBottomBarTab5'} style={styles.tabContainer} className={'ignore-react-onclickoutside'} onClick={() => this.toggleItineraryInfo()}>
          <span style={{color: this.state.showItineraryInfo ? 'rgb(67, 132, 150)' : 'rgb(60, 58, 68)', fontWeight: this.state.showItineraryInfo ? 700 : 400}}>Information</span>
        </div>
        {this.state.showItineraryInfo &&
          <BottomBarItineraryInfoPanel closePanel={() => this.closePanel()} />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    plannerView: state.plannerView,
    itineraryDetails: state.itineraryDetails
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

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(updateItineraryDetails, {name: 'updateItineraryDetails'})
)(Radium(PlannerBottomBar)))
