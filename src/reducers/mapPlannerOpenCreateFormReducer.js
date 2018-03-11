export const mapPlannerOpenCreateFormReducer = (state = {
  toOpen: false,
  eventType: 'Activity',
  defaultStartDay: 1,
  defaultEndDay: 1,
  defaultStartTime: 0,
  defaultEndTime: 0,
  defaultDescription: '',
  defaultGooglePlaceData: {},
  defaultArrivalGooglePlaceData: {}
}, action) => {
  switch (action.type) {
    case 'SET_OPEN_CREATE_FORM_PARAMS':
      return action.params
    case 'CLEAR_OPEN_CREATE_FORM_PARAMS':
      return {
        toOpen: false,
        eventType: 'Activity',
        defaultStartDay: 1,
        defaultEndDay: 1,
        defaultStartTime: 0,
        defaultEndTime: 0,
        defaultDescription: '',
        defaultGooglePlaceData: {},
        defaultArrivalGooglePlaceData: {}
      }
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
defaultDescription // activity, food, lodging
defaultGooglePlaceData // location for activity, food, lodging. departureLocation for transport.
defaultArrivalGooglePlaceData // arrival location for transport
*/
