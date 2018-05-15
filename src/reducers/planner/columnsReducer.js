export const columnsReducer = (state = ['Event', 'Location', 'Price', 'Notes'], action) => {
  switch (action.type) {
    case 'CHANGE_COLUMNS':
      return action.columns
    default:
      return state
  }
}
