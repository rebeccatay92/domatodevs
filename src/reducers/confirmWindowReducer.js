export const confirmWindowReducer = (state = {
  open: false,
  message: '',
  secondaryMessage: '',
  confirmMessage: '',
  confirmClicked: false
}, action) => {
  switch (action.type) {
    case 'OPEN_CONFIRM_WINDOW':
      return {
        open: true,
        message: action.input.message || '',
        secondaryMessage: action.input.secondaryMessage || '',
        confirmMessage: action.input.confirmMessage || ''
      }
    case 'CONFIRM_CLICKED':
      return {...state, ...{confirmClicked: true, open: false}}
    case 'CANCEL_CLICKED':
      return {...state, ...{open: false, message: '', secondaryMessage: '', confirmMessage: ''}}
    case 'RESET_CONFIRM_WINDOW':
      return {
        open: false,
        message: '',
        secondaryMessage: '',
        confirmMessage: '',
        confirmClicked: false
      }
    default:
      return state
  }
}
