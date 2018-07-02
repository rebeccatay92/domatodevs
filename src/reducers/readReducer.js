export const readReducer = (state = {
  pagesArr: [],
  activePostIndex: 0 // 0 is homepage, then 1,2,3 follows load seq, and index in pagesArr
}, action) => {
  switch (action.type) {
    case 'INITIALIZE_POSTS':
      return {...state, ...{pagesArr: action.pages}}
    case 'CHANGE_ACTIVE_POST':
      return {...state, ...{activePostIndex: action.index}}
    default:
      return state
  }
}
