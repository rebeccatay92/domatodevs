import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import AccountTab from './AccountTab'

import { updateUserProfile } from '../../apollo/user'
import { setUserProfile } from '../../actions/userActions'

const unclickedTabStyle = {cursor: 'pointer', height: '100%', marginTop: '3px', padding: '10px 20px 10px 20px', color: 'grey'}
const clickedTabStyle = {cursor: 'pointer', height: '100%', marginTop: '3px', borderBottom: '5px solid red', padding: '10px 20px 10px 20px', color: 'black'}

class UserDashboardPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tabsArray: [
        {tab: 'blogs', text: 'Blogs'},
        {tab: 'itineraries', text: 'Itineraries'},
        {tab: 'media', text: 'Media'},
        {tab: 'bucket', text: 'Bucket'},
        {tab: 'savedArticles', text: 'Saved Articles'},
        {tab: 'account', text: 'Account'}
      ],
      focusedTab: 'account',
      bio: '',
      editingBio: false
    }
  }

  focusTab (tabName) {
    this.setState({focusedTab: tabName})
  }

  makeBioEditable () {
    this.setState({editingBio: true})
  }

  saveBio () {
    console.log('state', this.state.bio)
    this.props.updateUserProfile({
      variables: {
        bio: this.state.bio
      }
    })
      .then(returning => {
        let profile = returning.data.updateUserProfile
        this.props.setUserProfile(profile)
      })
    this.setState({editingBio: false})
  }

  handleChange (e, field) {
    this.setState({
      [field]: e.target.value
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.userProfile !== this.props.userProfile) {
      this.setState({
        profilePic: nextProps.userProfile.profilePic,
        bio: nextProps.userProfile.bio || ''
      }, () => console.log('initialize', this.state))
    }
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
          {!this.state.editingBio &&
            <React.Fragment>
              {this.state.bio &&
                <h4>Bio: {this.state.bio}</h4>
              }
              {!this.state.bio &&
                <h4>Bio: You don't have a bio!</h4>
              }
              <button onClick={() => this.makeBioEditable()}>Click to edit bio</button>
            </React.Fragment>
          }
          {this.state.editingBio &&
            <React.Fragment>
              <textarea value={this.state.bio} placeholder={'Describe yourself in 255 characters'} onChange={e => this.handleChange(e, 'bio')} style={{display: 'block', width: 'calc(100% - 120px)', height: '80px', resize: 'none'}} />
              <button onClick={() => this.saveBio()}>Save</button>
            </React.Fragment>
          }
        </div>

        <div style={{marginTop: '30px', boxSizing: 'border-box', borderBottom: '3px solid gray', display: 'flex', justifyContent: 'flex-start', height: '60px'}}>
          {this.state.tabsArray.map((obj, i) => {
            return (
              <h3 key={i} style={this.state.focusedTab === obj.tab ? clickedTabStyle : unclickedTabStyle} onClick={() => this.focusTab(obj.tab)}>{obj.text}</h3>
            )
          })}
        </div>

        {this.state.focusedTab !== 'account' &&
          <div>
            component here
          </div>
        }
        {this.state.focusedTab === 'account' &&
          <div style={{width: '100%', height: 'calc(100% - 210px)', paddingTop: '15px'}}>
            <AccountTab lock={this.props.lock} />
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

const mapDispatchToProps = (dispatch) => {
  return {
    setUserProfile: (userProfile) => {
      dispatch(setUserProfile(userProfile))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(graphql(updateUserProfile, {name: 'updateUserProfile'})(UserDashboardPage))
