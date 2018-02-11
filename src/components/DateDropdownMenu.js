import React, { Component } from 'react'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'

import { deleteMultipleEvents } from '../apollo/deleteMultipleEvents'
import { changingLoadSequence } from '../apollo/changingLoadSequence'
import { queryItinerary, updateItineraryDetails } from '../apollo/itinerary'

import findEventsFromDayToDelete from '../helpers/findEventsFromDayToDelete'
import { deleteDayAndAssignLoadSequence } from '../helpers/deleteDayAndAssignLoadSequence'

import { initializePlanner } from '../actions/plannerActions'
import { toggleSpinner } from '../actions/spinnerActions'

class DateDropdownMenu extends Component {
  handleClickOutside (event) {
    this.props.toggleDateDropdown(event)
  }

  deleteDay () {
    this.props.toggleDateDropdown()
    const eventsToDelete = findEventsFromDayToDelete(this.props.events, this.props.day)
    const newEventsArr = deleteDayAndAssignLoadSequence(this.props.events, this.props.day)
    this.props.toggleSpinner(true)

    this.props.changingLoadSequence({
      variables: {
        input: newEventsArr
      }
    })
    .then(response => {
      this.props.deleteMultipleEvents({
        variables: {
          input: eventsToDelete
        }
      })
    })
    .then(response => {
      this.props.updateItineraryDetails({
        variables: {
          id: this.props.itineraryId,
          days: this.props.days - 1
        }
      })
    })
    .then(response => {
      setTimeout(() => {
        this.props.data.refetch()
      }, 1000)
    })
  }

  clearDay () {
    this.props.toggleDateDropdown()

    const events = findEventsFromDayToDelete(this.props.events, this.props.day)

    if (events.length === 0) return

    this.props.toggleSpinner(true)
    this.props.deleteMultipleEvents({
      variables: {
        input: events
      }
    })
    .then(response => {
      setTimeout(() => {
        this.props.data.refetch()
      }, 500)
    })
  }

  render () {
    return (
      <div style={{width: '145px', position: 'absolute', right: '-156px', top: '15px', backgroundColor: 'white', zIndex: 1, cursor: 'default', boxShadow: '0px 1px 5px 2px rgba(0, 0, 0, .2)'}}>
        <div style={{margin: '8px', lineHeight: '100%'}}>
          <span key='delete' onClick={() => this.deleteDay()} style={{fontSize: '16px', fontWeight: '300', color: '#3C3A44', ':hover': {color: '#ed685a'}}}>Delete Day</span>
        </div>
        <div style={{margin: '8px', lineHeight: '100%'}}>
          <span key='empty' onClick={() => this.clearDay()} style={{fontSize: '16px', fontWeight: '300', color: '#3C3A44', ':hover': {color: '#ed685a'}}}>Clear Day</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.plannerActivities
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializePlanner: (activities) => {
      dispatch(initializePlanner(activities))
    },
    toggleSpinner: (spinner) => {
      dispatch(toggleSpinner(spinner))
    }
  }
}

const options = {
  options: props => ({
    variables: {
      id: props.itineraryId
    }
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(queryItinerary, options),
  graphql(deleteMultipleEvents, {name: 'deleteMultipleEvents'}),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'}),
  graphql(updateItineraryDetails, {name: 'updateItineraryDetails'})
)(onClickOutside(Radium(DateDropdownMenu))))