export const mapPlannerCurrentFocusReducer = (state = {modelId: '', eventType: '', flightInstanceId: '', day: 0, start: null, loadSequence: 0}, action) => {
  switch (action.type) {
    case 'SET_CURRENTLY_FOCUSED_EVENT':
      // console.log('obj', action.currentlyFocusedEvent)
      return action.currentlyFocusedEvent
    default:
      return state
  }
}

/*
currentlyFocusedEvent
modelId
eventType
flightInstanceId
day
start
loadSequence
*/
