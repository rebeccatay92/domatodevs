export const sortReducer = (state = {column: '', type: 'unsorted'}, action) => {
  switch (action.type) {
    case 'CHANGE_COLUMN_SORT':
      return {column: action.column, type: action.sortType}
    default:
      return state
  }
}
