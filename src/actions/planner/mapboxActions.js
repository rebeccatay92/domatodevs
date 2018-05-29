export const clickDayCheckbox = (day) => {
  return {
    type: 'CLICK_DAY_CHECKBOX',
    day
  }
}

export const setPopupToShow = (name) => {
  return {
    type: 'SET_POPUP_TO_SHOW',
    name
  }
}
