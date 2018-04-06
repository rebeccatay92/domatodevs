export const blogEditorActivePageReducer = (state = {}, action) => {
  switch (action.type) {
    // Whenever the user changes active post on blog editor page
    case 'INITIALIZE_ACTIVE_PAGE':
      return {
        modelId: action.page.modelId, // id of the post/blog/heading
        type: action.page.type, // Blog, BlogHeading or Post
        title: action.page.title, // also description for events
        isSubPost: action.page.isSubPost,
        textContent: action.page.textContent,
        startDay: action.page.startDay, // event only
        endDay: action.page.endDay, // event only
        eventType: action.page.eventType, // event only
        days: action.page.days, // No. of days in the trip the blog represents
        googlePlaceData: action.page.googlePlaceData,
        changesMade: false
      }
    case 'UPDATE_ACTIVE_PAGE':
      return {
        ...state,
        ...{
          [action.property]: action.value
        },
        ...action.property !== 'changesMade' && {
          changesMade: true
        }
      }
    default:
      return state
  }
}
