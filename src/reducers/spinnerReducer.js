export const spinnerReducer = (state = false, action) => {
  switch (action.type) {
    case 'TOGGLE_SPINNER':
      return action.spinner
    default:
      return state
  }
}
