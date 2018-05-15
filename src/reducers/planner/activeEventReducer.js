export const activeEventReducer = (state = '', action) => {
  switch (action.type) {
    case 'UPDATE_ACTIVE_EVENT':
      return action.id
    default:
      return state
  }
}
