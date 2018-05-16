export const initializeEvents = (events) => {
  return {
    type: 'INITIALIZE_EVENTS',
    events
  }
}

export const updateEvent = (id, property, value, fromSidebar) => {
  return {
    type: 'UPDATE_EVENT',
    id,
    property,
    value,
    fromSidebar
  }
}
