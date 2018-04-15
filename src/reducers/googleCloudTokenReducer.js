export const googleCloudTokenReducer = (state = {
  expiresAt: 100,
  token: ''
}, action) => {
  switch (action.type) {
    case 'SET_CLOUD_STORAGE_TOKEN':
      return action.tokenObj
    default:
      return state
  }
}
