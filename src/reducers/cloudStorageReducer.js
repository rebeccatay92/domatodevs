import { retrieveToken } from '../helpers/cloudStorage'

export const cloudStorageReducer = (state = {expiry: 0, token: ''}, action) => {
  switch (action.type) {
    case 'GENERATE_CLOUD_STORAGE_TOKEN':
      return retrieveToken()
    case 'RETRIEVE_CLOUD_STORAGE_TOKEN':
      var currentUnix = Date.now() / 1000
      if (currentUnix < (state.expiry - 1800)) {
        // console.log('havent expire')
        return Promise.resolve(state)
      } else {
        // console.log('fetch token from backend')
        return retrieveToken()
      }

      // var tokenObj = state.then(obj => {
      //   if (currentUnix < (obj.expiry - 1800)) { // half hr buffer
      //     // console.log('token still valid')
      //     return obj
      //   } else {
      //     // console.log('token will expire soon, refreshing it')
      //     return retrieveToken()
      //   }
      // })

      // return tokenObj
    default:
      return Promise.resolve(state)
  }
}

// state is {expiry, token}
// retrieveToken helper returns Promise {expiry, token}
