export const plannerFocusReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_FOCUS_TO':
      return action.focus
    default:
      return state
  }
}
