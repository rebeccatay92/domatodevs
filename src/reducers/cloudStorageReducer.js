import { retrieveToken } from '../helpers/cloudStorage'

export const cloudStorageReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GENERATE_CLOUD_STORAGE_TOKEN':
      return retrieveToken()
    case 'RETRIEVE_CLOUD_STORAGE_TOKEN':
      var currentUnix = Date.now() / 1000
      var tokenObj = state.then(obj => {
        if (currentUnix < (obj.expiry - 1800)) { // half hr buffer
          // console.log('token still valid')
          return obj
        } else {
          // console.log('token will expire soon, refreshing it')
          return retrieveToken()
        }
      })
      return tokenObj
    default:
      return state
  }
}
