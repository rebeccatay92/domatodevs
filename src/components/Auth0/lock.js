import React, { Component } from 'react'
import Auth0Lock from 'auth0-lock'
import history from './history'

export default class Lock {
  lock = new Auth0Lock(
    process.env.REACT_APP_AUTH0_CLIENT_ID,
    process.env.REACT_APP_AUTH0_CLIENT_DOMAIN,
    {
      auth: {
        redirectUrl: 'http://localhost:3000/callback',
        audience: 'http://localhost:3001',
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
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)

    this.onAuthenticated = this.onAuthenticated.bind(this)
    this.onAuthenticated()
  }

  onAuthenticated () {
    this.lock.on('authenticated', authResult => {
      console.log('authResult', authResult)
      let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime())
      localStorage.setItem('access_token', authResult.accessToken)
      localStorage.setItem('id_token', authResult.idToken)
      localStorage.setItem('expires_at', expiresAt)
      localStorage.setItem('user_id', authResult.idTokenPayload.sub)

      fetch('http://localhost:3001/graphql', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${authResult.accessToken}`
        },
        body: JSON.stringify({query:`mutation {onAuth0UserAuthentication(idToken: \"${authResult.idToken}\") {id,fullName,email,username,profilePic}}`})
      })
      .then(response => {
        // console.log('response', response)
        // console.log('body', response.body)
      })
      .catch(err => {
        console.log('err', err)
      })

      history.replace('/')
    })
    this.scheduleRenewal()
  }

  renewToken () {
    this.lock.checkSession({},(err, authResult) => {
      if (err) {
        console.log('err', err)
      } else {
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime())
        localStorage.setItem('access_token', authResult.accessToken)
        localStorage.setItem('id_token', authResult.idToken)
        localStorage.setItem('expires_at', expiresAt)
        localStorage.setItem('user_id', authResult.idTokenPayload.sub)
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
      console.log('set timeout')
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewToken()
      }, delay)
    } else {
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
        console.log('ticket url', json.ticket)
        window.location.assign(json.ticket)
      })
      .catch(err => console.log('err', err))
    })
  }
}
