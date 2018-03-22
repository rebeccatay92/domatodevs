import React, { Component } from 'react'
import Auth0Lock from 'auth0-lock'
import history from './history'

export default class Lock {
  lock = new Auth0Lock(
    'y7lfqtXJsvLJUfcsHASjBC5HfD2d8Jyl',
    'domatodevs.auth0.com',
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
      autoclose: true
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
}
