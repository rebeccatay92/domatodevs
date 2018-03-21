import auth0 from 'auth0-js'
import history from './history'

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'domatodevs.auth0.com',
    clientID: 'y7lfqtXJsvLJUfcsHASjBC5HfD2d8Jyl',
    redirectUri: 'http://localhost:3000/callback',
    // audience: 'https://domatodevs.auth0.com/userinfo',
    audience: 'http://localhost:3001', // so access_token is for backend
    responseType: 'token id_token',
    scope: 'openid profile'
  })


  constructor() {
    let tokenRenewalTimeout
    let userProfile
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.handleAuthentication = this.handleAuthentication.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.getProfile = this.getProfile.bind(this)
    // automatically refresh token on App.js mount
    this.scheduleRenewal()
  }

  login() {
    this.auth0.authorize()
  }

  handleAuthentication () {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
        console.log('AUTHENTICATED')

        fetch('http://localhost:3001/graphql', {
          method:'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${authResult.accessToken}`
          },
          body: JSON.stringify({"query":"{\n\tfindUser(id: \"auth0|5ab1dce98bd5067ff5786507\") {\n\t\tid\n\t\tfullName\n\t\tusername\n\t\temail\n\t\tprofilePic\n\t}\n}"})
        })
        .then(response => {
          console.log('response', response)
        })
        .catch(err => {
          console.log('err', err)
        })

        history.replace('/')
      } else if (err) {
        history.replace('/')
        console.log('ERROR', err)
      }
    })
  }

  scheduleRenewal () {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    // console.log('expiresAt', expiresAt)
    if (!expiresAt) return // if no expiresAt (user has logged out. dont renew)
    const delay = expiresAt - Date.now()
    // console.log('delay', delay)
    if (delay > 0) {
      // console.log('set timeout')
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewToken()
      }, delay)
    } else {
      this.renewToken()
    }
  }

  renewToken () {
    this.auth0.checkSession({},(err, result) => {
      if (err) {
        console.log('err', err)
      } else {
        console.log('renewtoken', result)
        this.setSession(result)
      }
    })
  }

  setSession (authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime())
    console.log('AUTH RESULT', authResult)
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)
    localStorage.setItem('user_id', authResult.idTokenPayload.sub)
    // set timeout to silently renew token
    this.scheduleRenewal()

    // navigate to the home route
    history.replace('/')
  }

  logout () {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    localStorage.removeItem('user_id')
    // clear timeout for token renewal
    clearTimeout(this.tokenRenewalTimeout)
    // navigate to the home route
    history.replace('/')
  }

  isAuthenticated () {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt
  }

  getAccessToken () {
    const accessToken = window.localStorage.getItem('access_token')
    if (!accessToken) {
      throw new Error('No access token found')
    }
    return accessToken
  }

  getProfile () {
    let accessToken = this.getAccessToken()
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile
        console.log('user profile', profile)
      }
    })
  }
}
