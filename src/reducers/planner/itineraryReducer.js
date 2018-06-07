export const itineraryReducer = (state = {
  id: '',
  name: '',
  description: '',
  days: 0,
  startDate: null,
  countries: [],
  isPrivate: true
}, action) => {
  switch (action.type) {
    case 'INTIALIZE_ITINERARY_DETAILS':
      return action.details
    case 'UPDATE_ITINERARY':
      return {
        ...state,
        [action.field]: action.value
      }
    default:
      return state
  }
}
