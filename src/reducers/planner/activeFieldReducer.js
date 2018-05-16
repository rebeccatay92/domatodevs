export const activeFieldReducer = (state = '', action) => {
  switch (action.type) {
    case 'CHANGE_ACTIVE_FIELD':
      return action.field
    default:
      return state
  }
}
