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

export const sortEvents = (column, sortType) => {
  return {
    type: 'SORT_EVENTS',
    column,
    sortType
  }
}

export const hoverOverEvent = (index, event, day) => {
  return {
    type: 'HOVER_OVER_EVENT',
    index,
    event,
    day
  }
}

export const dropPlannerEvent = (event, index) => {
  return {
    type: 'DROP_PLANNER_EVENT',
    event,
    index
  }
}
