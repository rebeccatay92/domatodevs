export const userDashboardReducer = (state = {
  stickyTabs: false,
  stickySidebar: false
}, action) => {
  switch (action.type) {
    case 'SET_STICKY_TABS':
      return {...state, stickyTabs: action.sticky}
    case 'SET_STICKY_SIDEBAR':
      return {...state, stickySidebar: action.sticky}
    default:
      return state
  }
}

/*
track stickiness of dashboard tabs, sidebar
stickyTabs: Boolean
stickySidebar: Boolean
*/
