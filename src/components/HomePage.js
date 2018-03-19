import React, { Component } from 'react'
import jwt from 'jsonwebtoken'

// auth was passed as a prop from App.js into Route '/'
// import Auth from './Auth0/Auth'
// const auth = new Auth()

const handleAuthentication = ({location}) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    this.props.auth.handleAuthentication()
  }
}

class HomePage extends Component {

  // componentDidMount () {
  //
  // }

  checkSession () {
    console.log('auth', this.props.auth)
  }

  render () {
    var access_token = window.localStorage.getItem('access_token')
    var id_token = window.localStorage.getItem('id_token')
    var expires_at = window.localStorage.getItem('expires_at')
    const isAuthenticated = this.props.auth.isAuthenticated()
    // console.log('isAuthenticated', isAuthenticated)

    var decodedIdToken = jwt.decode(id_token)
    console.log('id token claims', decodedIdToken)
    return (
      <div style={{marginTop: '60px'}}>
        {!access_token &&
          <button onClick={() => this.props.auth.login()}>AUTH0 LOGIN/SIGNUP</button>
        }
        {access_token &&
          <button onClick={() => this.props.auth.logout()}>LOGOUT</button>
        }
        <h1>HOMEPAGE</h1>
        <h3>isAuthenticated ===> {isAuthenticated ? 'true' : 'false'}</h3>
        <h3>Access token: {access_token}</h3>
        <h3>Access token Expires at: {expires_at}</h3>
        <h3>Id token: {id_token}</h3>

        <button onClick={() => this.checkSession()}>Check session endpoint</button>
      </div>
    )
  }
}

export default HomePage
