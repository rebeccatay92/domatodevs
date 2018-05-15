import checkForTimelineErrorsInPlanner from '../helpers/checkForTimelineErrorsInPlanner'

export const plannerReducer = (state = [], action) => {
  switch (action.type) {
    case 'INITIALIZE_PLANNER':
      return action.activities
    case 'DROP_ACTIVITY':
      if (action.index === 'none') {
        return [
          ...state.filter(activity => {
            return activity.modelId
          }),
          action.activity
        ]
      } else {
        let stateWithoutActivitiesWithThatDate = state.filter(activity => {
          return activity.modelId && activity.day !== action.activity.day
        }).sort((a, b) => {
          return a.loadSequence - b.loadSequence
        })
        let newStateWithActivitiesWithThatDate = state.filter(activity => {
          return activity.modelId && activity.day === action.activity.day
        }).sort((a, b) => {
          return a.loadSequence - b.loadSequence
        })
        const lastEventBeforeDroppedEvent = newStateWithActivitiesWithThatDate.slice(0, action.index)[action.index - 1]
        const nextEventAfterDroppedEvent = newStateWithActivitiesWithThatDate.slice(action.index, newStateWithActivitiesWithThatDate.length)[0]
        const nextEventType = nextEventAfterDroppedEvent && nextEventAfterDroppedEvent.type
        const lastEventType = lastEventBeforeDroppedEvent && lastEventBeforeDroppedEvent.type
        let lastEventEndTime, nextEventStartTime
        if (lastEventBeforeDroppedEvent) {
          lastEventEndTime = (lastEventBeforeDroppedEvent.start) ? (lastEventBeforeDroppedEvent[lastEventType].startTime || lastEventBeforeDroppedEvent[lastEventType].FlightInstance.startTime) : (lastEventBeforeDroppedEvent[lastEventType].endTime || lastEventBeforeDroppedEvent[lastEventType].FlightInstance.endTime)
        }
        if (nextEventAfterDroppedEvent) {
          nextEventStartTime = (typeof nextEventAfterDroppedEvent.start !== 'boolean' || nextEventAfterDroppedEvent.start) ? (nextEventAfterDroppedEvent[nextEventType].startTime || nextEventAfterDroppedEvent[nextEventType].FlightInstance.startTime) : (nextEventAfterDroppedEvent[nextEventType].endTime || nextEventAfterDroppedEvent[nextEventType].FlightInstance.endTime)
        }
        const duration = action.activity[action.activity.type].endTime - action.activity[action.activity.type].startTime
        let suggestedStartTime, suggestedEndTime
        if (action.activity.type === 'Activity' || action.activity.type === 'Food') {
          suggestedStartTime = lastEventBeforeDroppedEvent ? lastEventEndTime : nextEventStartTime - duration
          suggestedEndTime = nextEventAfterDroppedEvent ? (suggestedStartTime + duration <= nextEventStartTime ? suggestedStartTime + duration : nextEventStartTime) : suggestedStartTime + duration
        } else if (action.activity.type === 'Lodging' || action.activity.type === 'LandTransport') {
          suggestedStartTime = lastEventEndTime || nextEventStartTime
          suggestedEndTime = nextEventStartTime || lastEventEndTime
        }
        return [
          ...stateWithoutActivitiesWithThatDate,
          ...[
            ...newStateWithActivitiesWithThatDate.slice(0, action.index),
            ...[{...action.activity,
              ...newStateWithActivitiesWithThatDate.length > 0 && {
                isDropped: true,
                suggestedStartTime: suggestedStartTime,
                suggestedEndTime: suggestedEndTime,
                newDay: action.activity.day
              }}],
            ...newStateWithActivitiesWithThatDate.slice(action.index, newStateWithActivitiesWithThatDate.length)
          ]
        ].sort((a, b) => {
          return a.day - b.day
        })
      }
    case 'DELETE_ACTIVITY':
      return state.filter((activity) => {
        return activity.id !== action.activity.id
      })
    // case 'HOVER_OVER_ACTIVITY':
    //   if (!(action.index + 1)) {
    //     return state.filter(activity => {
    //       return activity.id
    //     })
    //   }
    //   let stateWithoutActivitiesWithThatDate = state.filter(activity => {
    //     return activity.id && activity.day !== action.day
    //   })
    //   let newStateWithActivitiesWithThatDate = state.filter(activity => {
    //     return activity.id && activity.day === action.day
    //   })
    //   return [
    //     ...stateWithoutActivitiesWithThatDate,
    //     ...[
    //       ...newStateWithActivitiesWithThatDate.slice(0, action.index),
    //       ...[{
    //         modelId: '',
    //         day: action.day,
    //         dropzone: true
    //       }],
    //       ...newStateWithActivitiesWithThatDate.slice(action.index, newStateWithActivitiesWithThatDate.length)
    //     ]
    //   ]
    case 'PLANNERACTIVITY_HOVER_OVER_ACTIVITY':
      // console.log(state)
      if (!(action.index + 1)) {
        return state.filter(activity => {
          return activity.modelId && (activity.modelId !== action.activity.modelId || activity.type !== action.activity.type || activity.start !== action.activity.start)
        })
      }
      let stateWithoutPlannerActivitiesWithThatDate = state.filter(activity => {
        return activity.modelId && activity.day !== action.day && (activity.modelId !== action.activity.modelId || activity.type !== action.activity.type || activity.start !== action.activity.start)
      })
      let newStateWithPlannerActivitiesWithThatDate = state.filter(activity => {
        return activity.modelId && activity.day === action.day && (activity.modelId !== action.activity.modelId || activity.type !== action.activity.type || activity.start !== action.activity.start)
      })
      // console.log(stateWithoutPlannerActivitiesWithThatDate);
      // console.log(newStateWithPlannerActivitiesWithThatDate);
      // console.log(action.day);
      return [
        ...stateWithoutPlannerActivitiesWithThatDate,
        ...[
          ...newStateWithPlannerActivitiesWithThatDate.slice(0, action.index),
          ...[{
            modelId: '',
            day: action.day,
            type: 'empty',
            empty: {},
            fromReducer: true,
            dropzone: true
          }],
          ...newStateWithPlannerActivitiesWithThatDate.slice(action.index, newStateWithPlannerActivitiesWithThatDate.length)
        ]
      ]
    case 'HOVER_OUTSIDE_PLANNER':
      return state.filter(activity => {
        return activity.modelId
      })
    default:
      return state
  }
}
