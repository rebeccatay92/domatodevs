export const mapPlannerSearchReducer = (state = {
  searchInputStr: '',
  searchMarkerArr: [],
  focusedSearchMarker: null
}, action) => {
  switch (action.type) {
    case 'SET_SEARCH_INPUT_STR':
      return Object.assign({}, state, {
        searchInputStr: action.str
      })
    case 'SET_SEARCH_MARKER_ARR':
      return Object.assign({}, state, {
        searchMarkerArr: action.arr
      })
    default:
      return state
  }
}

/*
search redux state
searchInputStr: String
searchMarkerArr: Array
focusedSearchMarker: Object in searchMarkerArr
focusedSearchMarker: {position, placeinfo}
*/
