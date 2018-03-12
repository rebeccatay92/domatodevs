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

export const includeDayInDaysFilter = (dayInt) => {
  return {
    type: 'INCLUDE_DAY_IN_DAYS_FILTER',
    dayInt
  }
}

export const setOpenCreateFormParams = (params) => {
  return {
    type: 'SET_OPEN_CREATE_FORM_PARAMS',
    params
  }
}

export const clearOpenCreateFormParams = () => {
  return {
    type: 'CLEAR_OPEN_CREATE_FORM_PARAMS'
  }
}

export const setSearchInputStr = (str) => {
  return {
    type: 'SET_SEARCH_INPUT_STR',
    str
  }
}

export const setSearchMarkerArr = (arr) => {
  return {
    type: 'SET_SEARCH_MARKER_ARR',
    arr
  }
}
