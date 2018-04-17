export const googleCloudTokenReducer = (state = {
  expiresAt: 0,
  token: ''
}, action) => {
  switch (action.type) {
    case 'SET_GOOGLE_CLOUD_TOKEN':
      return action.tokenObj
    default:
      return state
  }
}
