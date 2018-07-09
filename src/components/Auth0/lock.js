import Auth0Lock from 'auth0-lock'
import history from './history'

import { store } from '../../store'
import { setUserProfile } from '../../actions/userActions'

class Lock {
  // lock = new Auth0Lock(
  //   process.env.REACT_APP_AUTH0_CLIENT_ID,
  //   process.env.REACT_APP_AUTH0_CLIENT_DOMAIN,
  //   {
  //     auth: {
  //       redirectUrl: 'http://localhost:3000',
  //       audience: 'http://localhost:3001',
  //       autoParseHash: true,
  //       responseType: 'token id_token',
  //       params: {
  //         scope: 'openid profile email'
  //       }
  //     },
  //     autoclose: true,
  //     rememberLastLogin: true
  //   }
  // )
  lock = new Auth0Lock(
    process.env.REACT_APP_AUTH0_CLIENT_ID,
    process.env.REACT_APP_AUTH0_CLIENT_DOMAIN,
    {
      auth: {
        redirectUrl: 'https://domatodevs.herokuapp.com',
        audience: 'https://domatodevsbackend.herokuapp.com/graphql',
        autoParseHash: true,
        responseType: 'token id_token',
        params: {
          scope: 'openid profile email'
        }
      },
      autoclose: true,
      rememberLastLogin: true
    }
  )
  constructor (props) {
    let tokenRenewalTimeout
    let redirectUrlAfterLoggingIn = '/'

    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.setRedirectUrlAfterLoggingIn = this.setRedirectUrlAfterLoggingIn.bind(this)

    this.onAuthenticated = this.onAuthenticated.bind(this)
    this.onAuthenticated()

    // immediately initialize user profile
    this.fetchUserProfile()
  }

  setRedirectUrlAfterLoggingIn (url) {
    this.redirectUrlAfterLoggingIn = url
  }

  // fetches user profile from backend and sets redux state
  fetchUserProfile () {
    if (this.isAuthenticated()) {
      return fetch('https://domatodevsbackend.herokuapp.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${window.localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          query: `{getUserProfile {id,fullName,email,username,profilePic,CountryId,bio, country{id, name, code},itineraries{id, name}}}`
        })
      })
      .then(response => {
        return response.json()
      })
      .then(json => {
        var userProfile = json.data.getUserProfile
        // console.log('lock fetch backend', userProfile)

        // set redux state when backend returns
        if (userProfile) {
          store.dispatch(setUserProfile(userProfile))
        }
        // return userProfile
      })
      .catch(err => {
        console.log('err', err)
      })
    } else {
      console.log('not authenticated')
      return Promise.resolve(null)
    }
  }

  //auth result on sign in has picture field
  onAuthenticated () {
    this.lock.on('authenticated', authResult => {
      // console.log('authResult', authResult)
      let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime())
      localStorage.setItem('access_token', authResult.accessToken)
      localStorage.setItem('id_token', authResult.idToken)
      localStorage.setItem('expires_at', expiresAt)
      localStorage.setItem('user_id', authResult.idTokenPayload.sub)

      fetch('https://domatodevsbackend.herokuapp.com/graphql', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${authResult.accessToken}`
        },
        body: JSON.stringify({query:`mutation {onAuth0UserAuthentication(idToken: \"${authResult.idToken}\") {id,fullName,email,username,profilePic}}`})
      })
      .then(response => {
        return response.json()
      })
      .then(json => {
        // console.log('json', json)
        // this.userProfile = json.data.onAuth0UserAuthentication
        // console.log('after json', this.userProfile)

        // fetch profile from backend
        this.fetchUserProfile()
      })
      .catch(err => {
        console.log('err', err)
      })

      // history.replace('/')
      history.replace(this.redirectUrlAfterLoggingIn)
      this.setRedirectUrlAfterLoggingIn('/')
      // need to reset it after login and redirect to original url is complete
    }) // close listener
    this.scheduleRenewal()
  }

  renewToken () {
    const checkSessionOptions = {
      scope: 'openid profile email'
    }
    this.lock.checkSession(checkSessionOptions,(err, authResult) => {
      if (err) {
        console.log('err', err)
      } else {
        // console.log('renew result', authResult)
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime())
        localStorage.setItem('access_token', authResult.accessToken)
        localStorage.setItem('id_token', authResult.idToken)
        localStorage.setItem('expires_at', expiresAt)
        localStorage.setItem('user_id', authResult.idTokenPayload.sub)

        // fetch profile from backend
        this.fetchUserProfile()

        this.scheduleRenewal()
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
      // console.log('expired. renew token now')
      this.renewToken()
    }
  }

  login () {
    this.lock.show()
  }

  logout () {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    localStorage.removeItem('user_id')
    // clear timeout for token renewal
    clearTimeout(this.tokenRenewalTimeout)

    store.dispatch(setUserProfile({}))

    history.replace('/')
  }

  isAuthenticated () {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt
  }

  changePassword () {
    var managementAccessToken = fetch('https://domatodevs.auth0.com/oauth/token', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        client_id: process.env.REACT_APP_AUTH0_MANAGEMENT_CLIENT_ID,
        client_secret: process.env.REACT_APP_AUTH0_MANAGEMENT_CLIENT_SECRET,
        audience: 'https://domatodevs.auth0.com/api/v2/',
        grant_type: 'client_credentials'
      })
    })
    .then(response => {
      return response.json()
    })
    .then(json => {
      return json.access_token
    })
    .catch(err => {
      console.log('err', err)
    })

    managementAccessToken
    .then(token => {
      // console.log('token', token)
      fetch('https://domatodevs.auth0.com/api/v2/tickets/password-change', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          result_url: "http://localhost:3000/passwordChanged",
          user_id: window.localStorage.getItem('user_id')
        })
      })
      .then(response => {
        return response.json()
      })
      .then(json => {
        // console.log('ticket url', json.ticket)
        window.location.assign(json.ticket)
        // window.open(json.ticket)
      })
      .catch(err => console.log('err', err))
    })
  }
}

export default Lock
