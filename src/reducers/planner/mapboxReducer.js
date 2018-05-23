export const mapboxReducer = (state = {
  daysToShow: [1]
}, action) => {
  switch (action.type) {
    case 'CLICK_DAY_CHECKBOX':
      // add or remove day from daysToShow []
      if (state.daysToShow.includes(action.day)) {
        return {
          ...state,
          daysToShow: state.daysToShow.filter(e => {
            return e !== action.day
          })
        }
      } else {
        return {
          ...state,
          daysToShow: [...state.daysToShow, action.day]
        }
      }
    default:
      return state
  }
}

/*
daysToShow: [1, 3, 5] controls which days left bar shows, markers to plot. (note: active event must be in a visible day)
theres activeEventId in activeEventReducer -> controls which marker is focused.
*/
