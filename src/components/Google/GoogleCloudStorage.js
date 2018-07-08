import { store } from '../../store'
import { setGoogleCloudToken } from '../../actions/cloudStorageActions'
const jwt = require('jsonwebtoken')

class GoogleCloudStorage {
  constructor (props) {
    let tokenRenewalTimeout
    this.scheduleRenewal()
  }

  scheduleRenewal () {
    // obtain state from redux store
    let reduxState = store.getState()
    // console.log('redux state googleCloudToken', reduxState.googleCloudToken)

    // check current time against expiresAt in redux store
    let currentTime = Date.now() / 1000
    // console.log('currentTime in secs', currentTime)

    // if token is still valid, set timeout to renew token
    // if token is expired, not within time margin, trigger obtainCloudToken function
    // time margin 10s for 60s expiry (TESTING ONLY)
    if (currentTime < reduxState.googleCloudToken.expiresAt - 10) {
      // console.log('still valid, set timeout')
      let timeoutDelayInSecs = reduxState.googleCloudToken.expiresAt - currentTime - 10
      // console.log('timeoutDelay', timeoutDelayInSecs)
      this.tokenRenewalTimeout = setTimeout(() => {
        this.obtainCloudToken()
      }, timeoutDelayInSecs * 1000)
    } else {
      // console.log('expired, renew now')
      this.obtainCloudToken()
    }
  }

  obtainCloudToken () {
    // send req to google to exchange credentials for token, then dispatch redux action to set global state with token so all components can access it
    // also scheduleRenewal again
    // expiry in 1 hr. testing with 60s
    var payload = {
      'iss': 'domatodevs@neon-rex-186905.iam.gserviceaccount.com',
      'scope': 'https://www.googleapis.com/auth/cloud-platform',
      'aud': 'https://www.googleapis.com/oauth2/v4/token',
      'exp': (Date.now() / 1000) + 3600,
      'iat': Date.now() / 1000
    }
    let privateKey = JSON.parse(process.env.REACT_APP_OAUTH_PRIVATE_KEY)
    var token = jwt.sign(payload, privateKey, {algorithm: 'RS256'})

    var dataString = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${token}`

    return fetch('https://www.googleapis.com/oauth2/v4/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: dataString
    })
      .then(response => {
        return response.json()
      })
      .then(json => {
        var apiToken = json.access_token
        // console.log('apiToken from fetch', apiToken)
        // console.log('new expires at', payload.exp)
        let tokenObj = {
          expiresAt: payload.exp,
          token: apiToken
        }
        // dispatch redux
        store.dispatch(setGoogleCloudToken(tokenObj))
        this.scheduleRenewal()
      })
      .catch(err => {
        console.log('fetch cloud token err', err)
        // if fetch fails try again?
        this.scheduleRenewal()
      })
  }
}

export default GoogleCloudStorage
