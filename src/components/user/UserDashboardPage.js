import React, { Component } from 'react'
import { connect } from 'react-redux'
import AccountTab from './AccountTab'

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
    // var isAuthenticated = this.props.lock.isAuthenticated()
    // if (!isAuthenticated) return <p>Not logged in</p>
    // console.log('isAuthenticated', isAuthenticated)

    // use redux state instead of token expiry time to determine logged in status
    var profile = this.props.userProfile
    if (!profile.id) return <p>Not logged in</p>

    return (
      <div style={{margin: '30px auto 30px auto', width: '70%', height: 'calc(100% - 60px)', boxSizing: 'border-box'}}>
        {/* CLICK ON IMG GRAY TINT TO CHANGE PROFILE PIC. */}
        <img src={profile.profilePic} width='120px' height='120px' style={{borderRadius: '50%', display: 'inline-block', cursor: 'pointer'}} />
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
            <AccountTab />
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
