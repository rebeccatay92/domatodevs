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
    case 'SET_FOCUSED_SEARCH_MARKER':
      return Object.assign({}, state, {
        focusedSearchMarker: action.marker
      })
    case 'CLEAR_FOCUSED_SEARCH_MARKER':
      return Object.assign({}, state, {
        focusedSearchMarker: null
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
focusedSearchMarker: marker obj {position, placeinfo}
*/
