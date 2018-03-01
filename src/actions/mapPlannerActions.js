export const setCurrentlyFocusedEvent = (currentlyFocusedEvent) => {
  return {
    type: 'SET_CURRENTLY_FOCUSED_EVENT',
    currentlyFocusedEvent
  }
}

export const clearCurrentlyFocusedEvent = () => {
  return {
    type: 'CLEAR_CURRENTLY_FOCUSED_EVENT'
  }
}

export const toggleDaysFilter = (dayInt) => {
  return {
    type: 'TOGGLE_DAYS_FILTER',
    dayInt
  }
}
