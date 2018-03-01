export const mapPlannerCurrentlyClickedReducer = (state = {modelId: '', eventType: '', flightInstanceId: '', day: 0, start: true, loadSequence: 0}, action) => {
  switch (action.type) {
    case 'CHANGE_CURRENTLY_CLICKED':
    // action has type and currentlyClickedObj
      console.log('action', action)
      return state
    default:
      return state
  }
}
