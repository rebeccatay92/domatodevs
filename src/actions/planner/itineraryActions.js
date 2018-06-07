export const initializeItineraryDetails = (details) => {
  return {
    type: 'INTIALIZE_ITINERARY_DETAILS',
    details
  }
}

export const updateItinerary = (field, value) => {
  return {
    type: 'UPDATE_ITINERARY',
    field,
    value
  }
}
