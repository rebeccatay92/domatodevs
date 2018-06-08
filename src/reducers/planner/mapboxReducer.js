export const mapboxReducer = (state = {
  daysToShow: [1],
  popupToShow: '' // '' or 'event' or 'search'
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
    case 'ENSURE_DAY_IS_CHECKED':
      console.log('REDUX DAY', action.day, typeof(action.day))
      if (state.daysToShow.includes(action.day)) {
        console.log('already in days filter')
        return state
      } else {
        console.log('not in days filter')
        return {
          ...state,
          daysToShow: [...state.daysToShow, action.day]
        }
      }
    case 'SET_POPUP_TO_SHOW':
      return {
        ...state,
        popupToShow: action.name
      }
    default:
      return state
  }
}

/*
daysToShow: [1, 3, 5] controls which days left bar shows, markers to plot. (note: active event must be in a visible day)
theres activeEventId in activeEventReducer -> controls which marker is focused.

popupToShow: '' or 'event' or 'search'. only 1 popup is visible at any time (to prevent overlap)
*/
