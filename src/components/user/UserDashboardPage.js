import React, { Component } from 'react'
import { connect } from 'react-redux'

const unclickedTabStyle = {cursor: 'pointer', height: '100%', marginTop: '3px', padding: '10px 20px 10px 20px', color: 'grey'}
const clickedTabStyle = {cursor: 'pointer', height: '100%', marginTop: '3px', borderBottom: '5px solid red', padding: '10px 20px 10px 20px', color: 'black'}

class UserDashboardPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      focusedTab: 'account'
    }
  }

  focusTab (tabName) {
    this.setState({focusedTab: tabName})
  }

  render () {
    var isAuthenticated = this.props.lock.isAuthenticated()
    if (!isAuthenticated) return <p>Not logged in</p>
    var profile = this.props.userProfile

    return (
      <div style={{margin: '30px auto 30px auto', width: '70%', height: 'calc(100% - 60px)', boxSizing: 'border-box'}}>
        {/* CLICK ON IMG GRAY TINT TO CHANGE PROFILE PIC. */}
        <img src={profile.profilePic} width='120px' height='120px' style={{borderRadius: '50%', display: 'inline-block'}} />
        <div style={{display: 'inline-block', verticalAlign: 'middle', width: 'calc(100% - 120px)', height: '120px', padding: '0 20px 0 20px'}}>
          <h1 style={{marginTop: 0}}>{profile.username}</h1>
          <h4>Bio: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consequat tempus ex ac malesuada. Etiam id pharetra sapien, sed malesuada quam. Curabitur facilisis, ex quis placerat dapibus, nisl purus malesuada libero</h4>
        </div>
        <div style={{marginTop: '30px', boxSizing: 'border-box', borderBottom: '3px solid gray', display: 'flex', justifyContent: 'flex-start', height: '60px'}}>
          <h3 style={this.state.focusedTab === 'blogs' ? clickedTabStyle : unclickedTabStyle} onClick={() => this.focusTab('blogs')}>Blogs</h3>
          <h3 style={this.state.focusedTab === 'itineraries' ? clickedTabStyle : unclickedTabStyle} onClick={() => this.focusTab('itineraries')}>Itineraries</h3>
          <h3 style={this.state.focusedTab === 'media' ? clickedTabStyle : unclickedTabStyle} onClick={() => this.focusTab('media')}>Media</h3>
          <h3 style={this.state.focusedTab === 'bucket' ? clickedTabStyle : unclickedTabStyle} onClick={() => this.focusTab('bucket')}>Bucket</h3>
          <h3 style={this.state.focusedTab === 'savedArticles' ? clickedTabStyle : unclickedTabStyle} onClick={() => this.focusTab('savedArticles')}>Saved Articles</h3>
          <h3 style={this.state.focusedTab === 'account' ? clickedTabStyle : unclickedTabStyle} onClick={() => this.focusTab('account')}>Account</h3>
        </div>

        {this.state.focusedTab !== 'account' &&
          <div>
            component here
          </div>
        }
        {this.state.focusedTab === 'account' &&
          <div style={{width: '100%', height: 'calc(100% - 210px)', paddingTop: '15px'}}>
            <div style={{display: 'inline-block', verticalAlign: 'top', width: '20%', height: '100%', borderRight: '2px solid gray', paddingRight: '10px'}}>
              <h4 style={{paddingLeft: '10px', borderLeft: '5px solid gray'}}>Profile Information</h4>
              <h4 style={{paddingLeft: '10px', borderLeft: '5px solid gray'}}>Security</h4>
            </div>
            <div style={{display: 'inline-block', verticalAlign: 'top', width: '80%', boxSizing: 'border-box', paddingLeft: '20px'}}>
              Username, email, fullName, Country
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile
  }
}

export default connect(mapStateToProps)(UserDashboardPage)


{/* <h3>Email address: {profile.email}</h3>
<h3>Full Name: {profile.fullName}</h3>
<button onClick={() => this.props.lock.changePassword()}>Change password</button> */}
