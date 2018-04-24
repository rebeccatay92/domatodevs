export const editorPostsListDragDropReducer = (state = 'post', action) => {
  // Reducer to tell the App whether the dragged Post is a post or subpost when dropped.
  switch (action.type) {
    case 'TOGGLE_POST': // Post or Header
      return 'post'
    case 'TOGGLE_SUBPOST': // Subpost
      return 'subpost'
    default:
      return state
  }
}
