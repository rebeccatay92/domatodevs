import _ from 'lodash'

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
      // console.log('selectedMedia', state.selectedMedia, 'clicked', action.medium)
      // check if medium id exists in selectedMedia
      let isInside = _.find(state.selectedMedia, function (e) {
        return e.id === medium.id
      })
      // console.log('isInside', isInside)
      if (isInside) {
        // console.log('includes, uncheck')
        return {
          ...state,
          selectedMedia: selectedMedia.filter(e => {
            return e.id !== medium.id
          })
        }
      } else {
        // console.log('not includes, check')
        return {
          ...state,
          selectedMedia: [...selectedMedia, medium]
        }
      }
    case 'ClEAR_SELECTED_MEDIA':
      return {...state, selectedMedia: []}
    case 'CHECK_ALL_IN_ALBUM':
      // console.log('albumid', action.AlbumId)
      // console.log('state selectedMedia', state.selectedMedia)
      let focusedAlbum = state.albums.find(e => {
        return e.id === action.AlbumId
      })
      let albumMedia = focusedAlbum.media
      // merge selectedMedia and all of album's media with no dupes
      // objects are not of same structure. just check 1 property
      let newSelectedMedia = _.unionBy(state.selectedMedia, albumMedia, 'id')
      // console.log('check all resulting arr', newSelectedMedia)
      return {
        ...state,
        selectedMedia: newSelectedMedia
      }
    case 'UNCHECK_ALL_IN_ALBUM':
      // console.log('albumId passed', action.AlbumId)
      return {
        ...state,
        selectedMedia: state.selectedMedia.filter(e => {
          return e.AlbumId !== action.AlbumId
        })
      }
    case 'SET_SELECTED_MEDIA':
      return {
        ...state,
        selectedMedia: action.mediaArr
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
selectedMedia: [ {id, AlbumId, type....}] // array of medium obj. DOES NOT HV LOAD SEQ, CAPTION. solely for checkbox rendering
*/
