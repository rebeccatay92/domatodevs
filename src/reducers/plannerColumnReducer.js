export const plannerColumnReducer = (state = ['Notes', 'Booking Status', 'Booking Platform'], action) => {
  switch (action.type) {
    case 'CHANGE_COLUMNS':
      return action.columns
    default:
      return state
  }
}
