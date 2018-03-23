export const changeActivePost = (index) => {
  return {
    type: 'CHANGE_ACTIVE_POST',
    index
  }
}

export const initializePosts = (pages) => {
  return {
    type: 'INITIALIZE_POSTS',
    pages
  }
}
