export const plannerViewReducer = (state = {
  tablePlanner: false,
  leftBar: true,
  mapbox: true,
  rightBar: ''
}, action) => {
  switch (action.type) {
    case 'SWITCH_TO_MAP_VIEW':
      return {
        tablePlanner: false,
        leftBar: true,
        mapbox: true,
        ...state.rightBar
      }
    case 'SWITCH_TO_TABLE_VIEW':
      return {
        tablePlanner: true,
        leftBar: false,
        mapbox: false,
        ...state.rightBar
      }
    case 'SET_RIGHT_BAR_FOCUSED_TAB':
      return {
        ...state,
        rightBar: action.tabName
      }
    default:
      return state
  }
}

// rightBar ('' OR 'bucket' OR 'event') CONTROLS WHICH TABS ARE EXPANDED
// ''  means tabs are collapsed
// whether event tab is rendered depends on activeEventReducer
