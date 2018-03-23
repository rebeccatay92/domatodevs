import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { getUserProfile } from '../../apollo/user'

class UserProfilePage extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    var isAuthenticated = this.props.lock.isAuthenticated()
    if (!isAuthenticated) return <p>Not logged in</p>

    if (this.props.data.loading) return <p>Loading...</p>

    var profile = this.props.data.getUserProfile
    if (!profile) return <h3>no profile?</h3>
    return (
      <div>
        <img src={profile.profilePic} width='200px' height='200px' style={{borderRadius: '50%'}} />
        <h3>Email address: {profile.email}</h3>
        <h3>Full Name: {profile.fullName}</h3>
      </div>
    )
  }
}

export default compose(
  (graphql(getUserProfile))
)(UserProfilePage)
