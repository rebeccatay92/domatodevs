export const initializeEvents = (events) => {
  return {
    type: 'INITIALIZE_EVENTS',
    events
  }
}

export const updateEvent = (id, property, value) => {
  return {
    type: 'UPDATE_EVENT',
    id,
    property,
    value
  }
}
