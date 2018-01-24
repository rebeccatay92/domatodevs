import React, { Component } from 'react'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { deleteActivity } from '../apollo/activity'
import { deleteFood } from '../apollo/food'
import { deleteFlightBooking } from '../apollo/flight'
import { deleteLandTransport } from '../apollo/landtransport'
import { deleteLodging } from '../apollo/lodging'
import { queryItinerary } from '../apollo/itinerary'
import { changingLoadSequence } from '../apollo/changingLoadSequence'

class EventDropdownMenu extends Component {
  handleClickOutside (event) {
    this.props.toggleEventDropdown(event)
  }

  deleteEvent () {
    const apolloNaming = {
      Activity: 'deleteActivity',
      Food: 'deleteFood',
      Flight: 'deleteFlightBooking',
      LandTransport: 'deleteLandTransport',
      Lodging: 'deleteLodging'
    }
    var eventType = this.props.event.type
    var deleteMutationNaming = apolloNaming[eventType]
    var modelId = this.props.event.modelId

    // REASSIGN LOAD SEQ AFTER DELETING
    function constructLoadSeqInputObj (event, correctLoadSeq) {
      var inputObj = {
        type: event.type === 'Flight' ? 'FlightInstance' : event.type,
        id: event.type === 'Flight' ? event.Flight.FlightInstance.id : event.modelId,
        loadSequence: correctLoadSeq,
        day: event.day
      }
      if (event.type === 'Flight' || event.type === 'LandTransport' || event.type === 'SeaTransport' || event.type === 'Train' || event.type === 'Lodging') {
        inputObj.start = event.start
      }
      return inputObj
    }
    // console.log('all events', this.props.events)
    var loadSequenceInputArr = []
    var eventsArr = this.props.events
    // remove deleted rows from eventsArr
    var newEventsArr = eventsArr.filter(e => {
      var isDeletedEvent = (e.type === eventType && e.modelId === modelId)
      return (!isDeletedEvent)
    })
    // console.log('newEventsArr', newEventsArr)
    // find how many days with events exist in eventsArr, split by day
    var daysArr = []
    newEventsArr.forEach(e => {
      if (!daysArr.includes(e.day)) {
        daysArr.push(e.day)
      }
    })
    // console.log('daysArr', daysArr)
    // check load seq and reassign
    daysArr.forEach(day => {
      var dayEvents = newEventsArr.filter(e => {
        return e.day === day
      })
      dayEvents.forEach(event => {
        var correctLoadSeq = dayEvents.indexOf(event) + 1
        if (event.loadSequence !== correctLoadSeq) {
          var loadSequenceInputObj = constructLoadSeqInputObj(event, correctLoadSeq)
          loadSequenceInputArr.push(loadSequenceInputObj)
        }
      })
    })
    this.props.toggleEventDropdown()
    console.log('loadSequenceInputArr', loadSequenceInputArr)
    this.props.changingLoadSequence({
      variables: {
        input: loadSequenceInputArr
      }
    })
    this.props[`${deleteMutationNaming}`]({
      variables: {
        id: modelId
      },
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.itineraryId }
      }]
    })
  }

  render () {
    return (
      <div style={{width: '145px', position: 'absolute', right: '-150px', top: '15px', backgroundColor: 'white', zIndex: 1, cursor: 'default', boxShadow: '0px 1px 5px 2px rgba(0, 0, 0, .2)'}}>
        <div style={{margin: '8px'}}>
          <span key='edit' onClick={() => this.props.toggleEditEvent()} style={{color: '#3C3A44', ':hover': {color: '#ed685a'}}}>Edit Event</span>
        </div>
        <div style={{margin: '8px'}}>
          <span key='delete' onClick={() => this.deleteEvent()} style={{color: '#3C3A44', ':hover': {color: '#ed685a'}}}>Delete Event</span>
        </div>
        <div style={{margin: '8px'}}>
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
  graphql(deleteFood, { name: 'deleteFood' }),
  graphql(deleteActivity, { name: 'deleteActivity' }),
  graphql(deleteFlightBooking, { name: 'deleteFlightBooking' }),
  graphql(deleteLodging, { name: 'deleteLodging' }),
  graphql(deleteLandTransport, { name: 'deleteLandTransport' }),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'})
)(onClickOutside(Radium(EventDropdownMenu))))
