export const clickDayCheckbox = (day) => {
  return {
    type: 'CLICK_DAY_CHECKBOX',
    day
  }
}

export const ensureDayIsChecked = (day) => {
  return {
    type: 'ENSURE_DAY_IS_CHECKED',
    day
  }
}

export const setPopupToShow = (name) => {
  return {
    type: 'SET_POPUP_TO_SHOW',
    name
  }
}
