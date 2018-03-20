import React, { Component } from 'react'
import jwt from 'jsonwebtoken'

class UserProfilePage extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    var id_token = window.localStorage.getItem('id_token')
    var decodedIdToken = jwt.decode(id_token)
    var userId = decodedIdToken.sub

    var user_id = window.localStorage.getItem('user_id')
    return (
      <div style={{marginTop: '60px'}}>
        USER PROFILE
        <h3>userId: {user_id}</h3>
      </div>
    )
  }
}

export default UserProfilePage
