export const sortReducer = (state = {sortBy: '', type: ''}, action) => {
  switch (action.type) {
    case 'CHANGE_COLUMN_SORT':
      return {sortBy: action.column, type: action.type}
    default:
      return state
  }
}
