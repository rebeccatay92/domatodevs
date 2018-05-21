export const switchToMapView = () => {
  return {
    type: 'SWITCH_TO_MAP_VIEW'
  }
}

export const switchToTableView = () => {
  return {
    type: 'SWITCH_TO_TABLE_VIEW'
  }
}

export const setRightBarFocusedTab = (tabName) => {
  return {
    type: 'SET_RIGHT_BAR_FOCUSED_TAB',
    tabName
  }
}
