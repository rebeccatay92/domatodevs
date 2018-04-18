const _ = require('lodash')

export const mediaConsoleReducer = (state = {
  isOpen: false,
  openedFrom: '',
  // stuffToAddToPost: [{} , {}] // edit route
  selectedMedia: [],
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
    case 'CLICK_CHECKBOX':
      // check if id is in current selected media. if yes, remove, if no, add.
      let medium = action.medium
      let selectedMedia = state.selectedMedia
      if (selectedMedia.includes(medium)) {
        return {
          ...state,
          selectedMedia: selectedMedia.filter(e => {
            return e.id !== medium.id
          })
        }
      } else {
        return {
          ...state,
          selectedMedia: [...selectedMedia, medium]
        }
      }
    case 'ClEAR_SELECTED_MEDIA':
      return {...state, selectedMedia: []}
    case 'CHECK_ALL_IN_ALBUM':
      // console.log(action.AlbumId)
      let focusedAlbum = state.albums.find(e => {
        return e.id === action.AlbumId
      })
      let albumMedia = focusedAlbum.media
      // merge selectedMedia and all of album's media with no dupes
      let newSelectedMedia = _.union(state.selectedMedia, albumMedia)
      return {
        ...state,
        selectedMedia: newSelectedMedia
      }
    case 'UNCHECK_ALL_IN_ALBUM':
      // console.log('album', action.AlbumId)
      return {
        ...state,
        selectedMedia: state.selectedMedia.filter(e => {
          return e.AlbumId !== action.AlbumId
        })
      }
    default:
      return state
  }
}

/*
mediaConsole redux state

isOpen: Boolean
openedFrom: String // either dashboard or editor or ''
albums: [Album]
focusedAlbumId: ID
selectedMedia: [ {id, AlbumId, type....}] // array of medium obj. solely for checkbox rendering
*/
