export const openMediaConsole = (openedFrom) => {
  return {
    type: 'OPEN_MEDIA_CONSOLE',
    openedFrom
  }
}

export const closeMediaConsole = () => {
  return {
    type: 'CLOSE_MEDIA_CONSOLE'
  }
}

export const initializeMediaConsoleAlbums = (albums) => {
  return {
    type: 'INITIALIZE_MEDIA_CONSOLE_ALBUMS',
    albums
  }
}

export const setFocusedAlbumId = (id) => {
  return {
    type: 'SET_FOCUSED_ALBUM_ID',
    id
  }
}

export const clickCheckbox = (medium) => {
  return {
    type: 'CLICK_CHECKBOX',
    medium
  }
}

export const clearSelectedMedia = () => {
  return {
    type: 'ClEAR_SELECTED_MEDIA'
  }
}

export const uncheckAllInAlbum = (AlbumId) => {
  return {
    type: 'UNCHECK_ALL_IN_ALBUM',
    AlbumId
  }
}

export const checkAllInAlbum = (AlbumId) => {
  return {
    type: 'CHECK_ALL_IN_ALBUM',
    AlbumId
  }
}
