export const initializeEvents = (events) => {
  return {
    type: 'INITIALIZE_EVENTS',
    events
  }
}

export const updateEvent = (index, property, value) => {
  return {
    type: 'UPDATE_EVENT',
    index,
    property,
    value
  }
}
