export const mediaConsoleReducer = (state = {
  isOpen: false,
  albums: [],
  focusedAlbum: {
    id: '',
    title: '',
    description: '',
    media: []
  }
}, action) => {
  switch (action.type) {
    case 'OPEN_MEDIA_CONSOLE':
      return {...state, isOpen: true}
    case 'CLOSE_MEDIA_CONSOLE':
      return {...state, isOpen: false}
    case 'INITIALIZE_MEDIA_CONSOLE_ALBUMS':
      // console.log('reducer received', action.albums)
      return {
        ...state,
        albums: action.albums
      }
    case 'SET_FOCUSED_ALBUM':
    // based on action.id
      return {
        ...state,
        focusedAlbum: state.albums.find(e => {
          return e.id === action.id
        })
      }
    default:
      return state
  }
}

/*
mediaConsole redux state

isOpen: Boolean
albums: [Album]
focusedAlbum: {
  id
  title
  description
  media: []
}
selectedMedia: [medium id]
*/
