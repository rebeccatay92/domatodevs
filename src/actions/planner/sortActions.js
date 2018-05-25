export const changeColumnSort = (column, sortType) => {
  return {
    type: 'CHANGE_COLUMN_SORT',
    column,
    sortType
  }
}
