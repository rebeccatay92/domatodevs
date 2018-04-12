export const userDashboardReducer = (state = {
  stickyTabs: false
}, action) => {
  switch (action.type) {
    case 'SET_STICKY_TABS':
      return {stickyTabs: action.sticky}
    default:
      return state
  }
}

/*
track stickiness of dashboard tabs, sidebar
stickyTabs: Boolean
stickyMediaSidebar: Boolean
*/
