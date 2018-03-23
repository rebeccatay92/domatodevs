export const mapPlannerOpenEditFormReducer = (state = {
  toOpen: false,
  eventType: 'Activity',
  eventRow: {},
  defaultStartDay: 1,
  defaultEndDay: 1,
  defaultStartTime: 0,
  defaultEndTime: 0,
  defaultDescription: '',
  defaultGooglePlaceData: {},
  defaultDepartureGooglePlaceData: {},
  defaultArrivalGooglePlaceData: {}
}, action) => {
  switch (action.type) {
    case 'SET_OPEN_EDIT_FORM_PARAMS':
      return action.params
    case 'CLEAR_OPEN_EDIT_FORM_PARAMS':
      return {
        toOpen: false,
        eventType: 'Activity',
        eventRow: {},
        defaultStartDay: 1,
        defaultEndDay: 1,
        defaultStartTime: 0,
        defaultEndTime: 0,
        defaultDescription: '',
        defaultGooglePlaceData: {},
        defaultDepartureGooglePlaceData: {},
        defaultArrivalGooglePlaceData: {}
      }
    default:
      return state
  }
}

/*
openEditFormParams
toOpen: false,
eventType
eventRow: {} //eventRow in db. eg Activity
defaultStartDay
defaultEndDay
defaultStartTime
defaultEndTime
defaultDescription // activity, food, lodging
defaultGooglePlaceData // location for activity, food, lodging. departureLocation for transport.
defaultDepartureGooglePlaceData // departureLocation for transport
defaultArrivalGooglePlaceData // arrival location for transport
*/
// how to deal with flight lol
