import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { getUserProfile } from '../../apollo/user'

const unclickedTabStyle = {cursor: 'pointer', height: '100%', marginTop: '3px', padding: '10px'}
const clickedTabStyle = {cursor: 'pointer', height: '100%', marginTop: '3px', borderBottom: '5px solid red', padding: '10px'}

class UserDashboardPage extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    var isAuthenticated = this.props.lock.isAuthenticated()
    if (!isAuthenticated) return <p>Not logged in</p>

    if (this.props.data.loading) return <p>Loading...</p>

    var profile = this.props.data.getUserProfile
    return (
      <div style={{margin: '100px auto 0 auto', width: '70%', height: '100%'}}>
        {/* CLICK ON IMG GRAY TINT TO CHANGE PROFILE PIC. */}
        <img src={profile.profilePic} width='150px' height='150px' style={{borderRadius: '50%', display: 'inline-block'}} />
        <div style={{display: 'inline-block', verticalAlign: 'middle', width: 'calc(100% - 150px)', height: '150px', padding: '0 20px 0 20px'}}>
          <h1 style={{marginTop: 0}}>{profile.username}</h1>
          <h4>Bio: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consequat tempus ex ac malesuada. Etiam id pharetra sapien, sed malesuada quam. Curabitur facilisis, ex quis placerat dapibus, nisl purus malesuada libero</h4>
        </div>
        <div style={{marginTop: '30px', boxSizing: 'border-box', borderBottom: '3px solid gray', display: 'flex', justifyContent: 'space-between', height: '60px', color: 'grey'}}>
          <h3 style={clickedTabStyle}>Blogs</h3>
          <h3 style={unclickedTabStyle}>Itineraries</h3>
          <h3 style={unclickedTabStyle}>Media</h3>
          <h3 style={unclickedTabStyle}>Bucket</h3>
          <h3 style={unclickedTabStyle}>Saved Articles</h3>
          <h3 style={unclickedTabStyle}>Account</h3>
        </div>
      </div>
    )
  }
}

export default compose(
  (graphql(getUserProfile))
)(UserDashboardPage)


{/* <h3>Email address: {profile.email}</h3>
<h3>Full Name: {profile.fullName}</h3>
<button onClick={() => this.props.lock.changePassword()}>Change password</button> */}
