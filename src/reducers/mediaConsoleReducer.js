export const mediaConsoleReducer = (state = {
  isOpen: false
}, action) => {
  switch (action.type) {
    case 'OPEN_MEDIA_CONSOLE':
      return {...state, isOpen: true}
    case 'CLOSE_MEDIA_CONSOLE':
      return {...state, isOpen: false}
    default:
      return state
  }
}

/*
mediaConsole redux state
{
isOpen: Boolean
}
*/
