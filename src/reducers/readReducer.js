export const readReducer = (state = {pagesArr: [], activePostIndex: 'home'}, action) => {
  switch (action.type) {
    case 'INITIALIZE_POSTS':
      return {pagesArr: action.pages, activePostIndex: 'home'}
    case 'CHANGE_ACTIVE_POST':
      return {...state, ...{activePostIndex: action.index}}
    default:
      return state
  }
}
