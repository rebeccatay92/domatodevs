// USING GCP ES6 CLASS INITIALIZED IN APP.JS
export const setGoogleCloudToken = (tokenObj) => {
  return {
    type: 'SET_GOOGLE_CLOUD_TOKEN',
    tokenObj
  }
}
