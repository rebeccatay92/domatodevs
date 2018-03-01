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
