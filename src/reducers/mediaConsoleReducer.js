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
    case 'INITIALIZE_MEDIA_CONSOLE':
      // console.log('reducer received', action.albums)
      return {
        ...state,
        albums: action.albums,
        focusedAlbum: action.albums[0] || {id: '', title: '', description: '', media: []}
      }
    case 'SET_FOCUSED_ALBUM':
      return {
        ...state,
        focusedAlbum: state.albums[action.index]
      }
    default:
      return state
  }
}

/*
mediaConsole redux state
{
isOpen: Boolean
albums: [Album]
focusedAlbum: {
  id
  title
  description
  media: []
}
}
*/
