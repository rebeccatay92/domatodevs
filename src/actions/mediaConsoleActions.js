export const openMediaConsole = () => {
  return {
    type: 'OPEN_MEDIA_CONSOLE'
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

export const setFocusedAlbum = (id) => {
  return {
    type: 'SET_FOCUSED_ALBUM',
    id
  }
}
