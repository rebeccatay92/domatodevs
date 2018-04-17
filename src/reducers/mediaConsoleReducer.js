export const mediaConsoleReducer = (state = {
  isOpen: false,
  openedFrom: '', // either dashboard or editor or ''
  // stuffToAddToPost: [{} , {}] // edit route
  // selectedMedia: [id, id] // solely for checkbox logic in console
  albums: [],
  focusedAlbumId: ''
}, action) => {
  switch (action.type) {
    case 'OPEN_MEDIA_CONSOLE':
      return {...state, isOpen: true, openedFrom: action.openedFrom}
    case 'CLOSE_MEDIA_CONSOLE':
      return {...state, isOpen: false, openedFrom: ''}
    case 'INITIALIZE_MEDIA_CONSOLE_ALBUMS':
      // console.log('reducer received', action.albums)
      return {
        ...state,
        albums: action.albums
      }
    case 'SET_FOCUSED_ALBUM_ID':
      return {...state, focusedAlbumId: action.id}
    default:
      return state
  }
}

/*
mediaConsole redux state

isOpen: Boolean
openedFrom: String
albums: [Album]
focusedAlbumId: ID
selectedMedia: [medium id]
*/
