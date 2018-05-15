export const activeEventReducer = (state = '', action) => {
  switch (action.type) {
    case 'UPDATE_ACTIVE_EVENT':
<<<<<<< HEAD
      return action.id || state
=======
      return action.id
>>>>>>> origin/yt
    default:
      return state
  }
}
