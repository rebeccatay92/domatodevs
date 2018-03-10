export const mapPlannerOpenCreateFormReducer = (state = {toOpen: false, eventType: 'Activity', defaultStartDay: 1, defaultEndDay: 1, defaultStartTime: 0, defaultEndTime: 0, defaultGooglePlaceData: {}}, action) => {
  switch (action.type) {
    case 'SET_OPEN_CREATE_FORM_PARAMS':
      return action.params
    case 'CLEAR_OPEN_CREATE_FORM_PARAMS':
      return {toOpen: false, eventType: 'Activity', defaultStartDay: 1, defaultEndDay: 1, defaultStartTime: 0, defaultEndTime: 0, defaultGooglePlaceData: {}}
    default:
      return state
  }
}

/*
openCreateFormParams (action.params)
toOpen: false
eventType
defaultStartDay
defaultEndDay
defaultStartTime
defaultEndTime
defaultGooglePlaceData
*/
