import checkForTimelineErrorsInPlanner from '../helpers/checkForTimelineErrorsInPlanner'

export const plannerReducer = (state = [], action) => {
  switch (action.type) {
    case 'INITIALIZE_PLANNER':
      return checkForTimelineErrorsInPlanner(action.activities)
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
        })
        let newStateWithActivitiesWithThatDate = state.filter(activity => {
          return activity.modelId && activity.day === action.activity.day
        })
        return [
          ...stateWithoutActivitiesWithThatDate,
          ...[
            ...newStateWithActivitiesWithThatDate.slice(0, action.index),
            ...[action.activity],
            ...newStateWithActivitiesWithThatDate.slice(action.index, newStateWithActivitiesWithThatDate.length)
          ]
        ]
      }
    case 'DELETE_ACTIVITY':
      return state.filter((activity) => {
        return activity.id !== action.activity.id
      })
    case 'HOVER_OVER_ACTIVITY':
      if (!(action.index + 1)) {
        return state.filter(activity => {
          return activity.id
        })
      }
      let stateWithoutActivitiesWithThatDate = state.filter(activity => {
        return activity.id && activity.day !== action.day
      })
      let newStateWithActivitiesWithThatDate = state.filter(activity => {
        return activity.id && activity.day === action.day
      })
      return [
        ...stateWithoutActivitiesWithThatDate,
        ...[
          ...newStateWithActivitiesWithThatDate.slice(0, action.index),
          ...[{
            modelId: '',
            day: action.day,
            dropzone: true
          }],
          ...newStateWithActivitiesWithThatDate.slice(action.index, newStateWithActivitiesWithThatDate.length)
        ]
      ]
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
