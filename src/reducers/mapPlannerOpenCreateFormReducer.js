export const mapPlannerOpenCreateFormReducer = (state = {eventType: 'Activity', defaultStartDay: 1, defaultEndDay: 1, defaultStartTime: 0, defaultEndTime: 0, defaultGooglePlaceData: {}}, action) => {
  // switch (action.type) {
  //   case 'SET_CURRENTLY_FOCUSED_EVENT':
  //     return action.currentlyFocusedEvent
  //   case 'CLEAR_CURRENTLY_FOCUSED_EVENT':
  //     return {modelId: '', eventType: '', flightInstanceId: '', day: 0, start: null, loadSequence: 0}
  //   default:
  //     return state
  // }
  switch (action.type) {
    case 'SET_OPEN_CREATE_FORM_PARAMS':
      return state
    default:
      return state
  }
}

/*
openCreateFormParams (action.params)
eventType
defaultStartDay
defaultEndDay
defaultStartTime
defaultEndTime
defaultGooglePlaceData
*/
