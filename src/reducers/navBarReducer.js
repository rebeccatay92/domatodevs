export const navBarReducer = (state = {
  showNavBar: false
}, action) => {
  switch (action.type) {
    case 'TOGGLE_SHOW_NAVBAR':
      return {...state, showNavBar: !state.showNavBar}
    default:
      return state
  }
}
