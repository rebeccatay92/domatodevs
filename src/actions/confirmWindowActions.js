export const openConfirmWindow = (input) => {
  return {
    type: 'OPEN_CONFIRM_WINDOW',
    input
  }
}

export const confirmClicked = () => {
  return {
    type: 'CONFIRM_CLICKED'
  }
}

export const cancelClicked = () => {
  return {
    type: 'CANCEL_CLICKED'
  }
}

export const resetConfirmWindow = () => {
  return {
    type: 'RESET_CONFIRM_WINDOW'
  }
}
