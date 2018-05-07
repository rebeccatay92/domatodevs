import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { DropTarget } from 'react-dnd'

import { dayTimelineContainerStyle, dayTimelineWordStyle } from '../Styles/styles'

// import { updateActivity } from '../apollo/activity'
// import { updateFlightBooking } from '../apollo/flight'
// import { updateLodging } from '../apollo/lodging'
// import { updateLandTransport } from '../apollo/landtransport'
// import { updateSeaTransport } from '../apollo/seatransport'
// import { updateTrain } from '../apollo/train'
// import { updateFood } from '../apollo/food'
import { updateItineraryDetails, queryItinerary } from '../apollo/itinerary'

const dayTarget = {
  drop (props, monitor) {
    const droppedEvent = monitor.getItem()
    if (droppedEvent.type !== 'Lodging') {
      props[`update${droppedEvent.type}`]({
        variables: {
          id: droppedEvent.modelId,
          startDay: props.day,
          endDay: props.day + droppedEvent[droppedEvent.type].endDay - droppedEvent[droppedEvent.type].startDay
        },
        refetchQueries: [{
          query: queryItinerary,
          variables: { id: props.itineraryId }
        }]
      })
      if (props.day + droppedEvent[droppedEvent.type].endDay - droppedEvent[droppedEvent.type].startDay > props.days && droppedEvent.type === 'LandTransport') {
        props.updateItineraryDetails({
          variables: {
            id: props.itineraryId,
            days: props.day + droppedEvent[droppedEvent.type].endDay - droppedEvent[droppedEvent.type].startDay
          },
          refetchQueries: [{
            query: queryItinerary,
            variables: { id: props.itineraryId }
          }]
        })
      }
    } else if (droppedEvent.type === 'Lodging') {
      props.updateLodging({
        variables: {...{
          id: droppedEvent.modelId
        },
          ...droppedEvent.start && {
            startDay: props.day
          },
          ...!droppedEvent.start && {
            endDay: props.day
          }
        },
        refetchQueries: [{
          query: queryItinerary,
          variables: { id: props.itineraryId }
        }]
      })
    }
  }
}

function collectTarget (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

class PlannerTimelineDayButton extends Component {
  render () {
    const { connectDropTarget, isOver } = this.props
    return connectDropTarget(
      <div style={dayTimelineContainerStyle(this.props.isDateOnScreen, isOver)}>
        <span style={dayTimelineWordStyle(this.props.isDateOnScreen)}>Day {this.props.day}</span>
      </div>
    )
  }
}

export default compose(
  // graphql(updateActivity, { name: 'updateActivity' }),
  // graphql(updateFlightBooking, { name: 'updateFlightBooking' }),
  // graphql(updateLandTransport, { name: 'updateLandTransport' }),
  // graphql(updateLodging, { name: 'updateLodging' }),
  // graphql(updateFood, { name: 'updateFood' }),
  // graphql(updateSeaTransport, {name: 'updateSeaTransport'}),
  // graphql(updateTrain, {name: 'updateTrain'}),
  graphql(updateItineraryDetails, {name: 'updateItineraryDetails'})
)(DropTarget(['activity', 'plannerActivity'], dayTarget, collectTarget)(PlannerTimelineDayButton))
