export const timeCellFocusReducer = (state = false, action) => {
  switch (action.type) {
    case 'SET_TIMECELL_FOCUS':
      return action.focus
    default:
      return state
  }
}
