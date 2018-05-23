export const mapboxReducer = (state = {
  daysToShow: []
}, action) => {
  switch (action.type) {
    default:
      return state
  }
}

/*
daysToShow: [1, 3, 5] controls which days left bar shows, markers to plot. (note: active event must be in a visible day)
theres activeEventId in activeEventReducer -> controls which marker is focused.
*/
