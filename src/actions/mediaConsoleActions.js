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

export const initializeMediaConsole = (albums) => {
  return {
    type: 'INITIALIZE_MEDIA_CONSOLE',
    albums
  }
}

export const setFocusedAlbum = (index) => {
  return {
    type: 'SET_FOCUSED_ALBUM',
    index
  }
}
