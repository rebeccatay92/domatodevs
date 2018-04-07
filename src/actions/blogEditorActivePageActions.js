export const initializeActivePage = (page) => {
  return {
    type: 'INITIALIZE_ACTIVE_PAGE',
    page
  }
}

export const updateActivePage = (property, value) => {
  return {
    type: 'UPDATE_ACTIVE_PAGE',
    property,
    value
  }
}
