import React, { Component } from 'react'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
// import { deleteActivity } from '../apollo/activity'
// import { deleteFood } from '../apollo/food'
// import { deleteFlightBooking } from '../apollo/flight'
// import { deleteLandTransport } from '../apollo/landtransport'
// import { deleteLodging } from '../apollo/lodging'
import { queryItinerary } from '../apollo/itinerary'
import { changingLoadSequence } from '../apollo/changingLoadSequence'
// import { deleteEventReassignSequence } from '../helpers/deleteEventReassignSequence'

class EventDropdownMenu extends Component {
  handleClickOutside (event) {
    this.props.toggleEventDropdown(event)
  }

  deleteEvent () {
    console.log('need to switch to V2 helper')
    // const apolloNaming = {
    //   Activity: 'deleteActivity',
    //   Food: 'deleteFood',
    //   Flight: 'deleteFlightBooking',
    //   LandTransport: 'deleteLandTransport',
    //   Lodging: 'deleteLodging'
    // }
    // var eventType = this.props.event.type
    // var deleteMutationNaming = apolloNaming[eventType]
    // var modelId = this.props.event.modelId

    // var loadSequenceInputArr = deleteEventReassignSequence(this.props.events, eventType, modelId)

    // this.props.changingLoadSequence({
    //   variables: {
    //     input: loadSequenceInputArr
    //   }
    // })
    // this.props[`${deleteMutationNaming}`]({
    //   variables: {
    //     id: modelId
    //   },
    //   refetchQueries: [{
    //     query: queryItinerary,
    //     variables: { id: this.props.itineraryId }
    //   }]
    // })
    this.props.toggleEventDropdown()
  }

  render () {
    return (
      <div style={{border: '1px solid rgba(60, 58, 68, 0.2)', width: '145px', position: 'absolute', right: '-158px', top: '15px', backgroundColor: 'white', zIndex: 1, cursor: 'default', boxShadow: '0px 3px 6px 0px rgba(0, 0, 0, .2)'}}>
        <div style={{margin: '8px 16px 16px 16px'}}>
          <span key='edit' onClick={() => this.props.toggleEditEvent()} style={{color: '#3C3A44', ':hover': {color: '#ed685a'}}}>Edit Event</span>
        </div>
        <div style={{margin: '16px'}}>
          <span key='delete' onClick={() => this.deleteEvent()} style={{color: '#3C3A44', ':hover': {color: '#ed685a'}}}>Delete Event</span>
        </div>
        <div style={{margin: '16px 16px 8px 16px'}}>
          <span key='kissDom' onClick={() => window.alert('yoo haz bin bless by koding doge')} style={{color: '#3C3A44', ':hover': {color: '#ed685a'}}}>Kiss Dom</span>
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

export default connect(mapStateToProps)(compose(
  // graphql(deleteFood, { name: 'deleteFood' }),
  // graphql(deleteActivity, { name: 'deleteActivity' }),
  // graphql(deleteFlightBooking, { name: 'deleteFlightBooking' }),
  // graphql(deleteLodging, { name: 'deleteLodging' }),
  // graphql(deleteLandTransport, { name: 'deleteLandTransport' }),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'})
)(onClickOutside(Radium(EventDropdownMenu))))
