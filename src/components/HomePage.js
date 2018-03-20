import React, { Component } from 'react'
import jwt from 'jsonwebtoken'
import moment from 'moment'

// auth was passed as a prop from App.js into Route '/'
// import Auth from './Auth0/Auth'
// const auth = new Auth()

class HomePage extends Component {

  // componentDidMount () {
  //
  // }

  getProfile () {
    this.props.auth.getProfile()
  }

  render () {
    var access_token = window.localStorage.getItem('access_token')
    var id_token = window.localStorage.getItem('id_token')
    var expires_at = window.localStorage.getItem('expires_at')
    var expiresAtString = moment.unix(expires_at / 1000).format('ddd, DD MMM YYYY, hh:mm A')
    console.log('expires at', expiresAtString)
    const isAuthenticated = this.props.auth.isAuthenticated()
    // console.log('isAuthenticated', isAuthenticated)

    if (id_token) {
      var decodedIdToken = jwt.decode(id_token)
      console.log('id token claims', decodedIdToken)

      var idTokenExpiry = decodedIdToken.exp
      var idTokenExpiryString = moment.unix(idTokenExpiry).format('DD MMM YYYY, hh:mm A')
    }

    return (
      <div style={{marginTop: '60px'}}>
        <h1>HOMEPAGE</h1>
        <h3>isAuthenticated ===> {isAuthenticated ? 'true' : 'false'}</h3>
        <h3>Access token: {access_token}</h3>
        <h3>Access token Expires at: {expires_at}, {expiresAtString}</h3>
        <h3>Id token: {id_token}</h3>
        {id_token &&
          <React.Fragment>
            <h3>id token expiry: {idTokenExpiry}, {idTokenExpiryString}</h3>
            <h3>ID token claims</h3>
            <h3>{decodedIdToken.name}</h3>
            <h3>{decodedIdToken.sub}</h3>
            <img src={decodedIdToken.picture} height={'200px'} width={'200px'} />
          </React.Fragment>
        }
        <button onClick={() => this.getProfile()}>Get user profile</button>
      </div>
    )
  }
}

export default HomePage
