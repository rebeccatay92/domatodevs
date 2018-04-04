import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import Radium from 'radium'

import AccountTab from './AccountTab'

import { updateUserProfile } from '../../apollo/user'
import { setUserProfile } from '../../actions/userActions'
import { retrieveCloudStorageToken } from '../../actions/cloudStorageActions'

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
    if (field === 'bio') {
      if (e.target.value.length <= 255) {
        this.setState({
          bio: e.target.value
        })
      }
    }
  }

  onBioKeyDown (e) {
    if (e.key === 'Enter') {
      this.saveBio()
    }
  }

  uploadProfilePic (e) {
    let file = e.target.files[0]

    if (file) {
      console.log('file', file)
      let UserId = this.props.userProfile.id
      var timestamp = Date.now()
      var uriBase = process.env.REACT_APP_CLOUD_UPLOAD_URI
      var uriFull = `${uriBase}${UserId}/account/profilePic_${timestamp}`
      // timestamp the profilepic so redux knows it is different from previous copy

      fetch(uriFull, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': file.type,
          'Content-Length': file.size
        },
        body: file
      })
        .then(response => {
          return response.json()
        })
        .then(json => {
          console.log('json', json)
          let publicUrl = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}${json.name}`
          console.log('public url', publicUrl)
          return publicUrl
        })
        .then(publicUrl => {
          this.props.updateUserProfile({
            variables: {
              profilePic: publicUrl
            }
          })
            .then(returning => {
              // console.log('returning', returning.data.updateUserProfile)
              let returningProfile = returning.data.updateUserProfile
              this.props.setUserProfile(returningProfile)
            })
        })
        .catch(err => {
          console.log('err', err)
        })
    }
  }

  componentDidMount () {
    // check and refresh token
    this.props.retrieveCloudStorageToken()

    if (this.props.userProfile.id) {
      this.setState({
        profilePic: this.props.userProfile.profilePic,
        bio: this.props.userProfile.bio || ''
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.userProfile !== this.props.userProfile) {
      // if compare, only refresh displays properly. first direct to this route doesnt initialize. componentDidMount instead.
      this.setState({
        profilePic: nextProps.userProfile.profilePic,
        bio: nextProps.userProfile.bio || ''
      })
    }
    if (nextProps.cloudStorageToken !== this.props.cloudStorageToken) {
      nextProps.cloudStorageToken
        .then(returning => {
          // console.log('token', returning.token)
          this.apiToken = returning.token
        })
    }
  }

  render () {
    // var isAuthenticated = this.props.lock.isAuthenticated()
    // if (!isAuthenticated) return <p>Not logged in</p>
    // console.log('isAuthenticated', isAuthenticated)
    // use redux state instead of token expiry time to determine logged in status
    var profile = this.props.userProfile
    // console.log('redux state profile', profile)
    if (!profile.id) return <p>Not logged in</p>

    return (
      <div style={{margin: '90px auto 30px auto', width: '70%', height: 'calc(100vh - 120px)', boxSizing: 'border-box'}}>
        {/* CLICK ON IMG GRAY TINT TO CHANGE PROFILE PIC. */}
        <label>
          <div style={{position: 'relative', width: '150px', height: '150px'}}>
            <div key={'test'} style={{background: `rgba(255, 255, 255, 0.3)`, width: '150px', height: '150px', borderRadius: '50%', position: 'absolute', top: '0', left: '0', textAlign: 'center', padding: '60px 0 60px 0', cursor: 'pointer', opacity: 0, ':hover': {opacity: '1'}}}>
              <span style={{fontSize: '16px', textShadow: '2px 2px 0 rgb(255, 255, 255)'}}>CHANGE</span>
            </div>
            <img src={this.state.profilePic} width='150px' height='150px' style={{borderRadius: '50%', display: 'inline-block'}} />
          </div>
          <input type='file' accept='.jpeg, .jpg, .png' onChange={e => this.uploadProfilePic(e)} style={{display: 'none'}} />
        </label>

        <div style={{display: 'inline-block', verticalAlign: 'middle', width: 'calc(100% - 150px)', height: '150px', padding: '0 20px 0 20px'}}>
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
              <textarea value={this.state.bio} placeholder={'Describe yourself in 255 characters'} onChange={e => this.handleChange(e, 'bio')} onKeyDown={(e) => this.onBioKeyDown(e)} style={{display: 'block', width: 'calc(100% - 120px)', height: '80px', resize: 'none'}} />
              <button onClick={() => this.saveBio()}>Save</button>
              <span>{255 - this.state.bio.length} characters left</span>
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
          <div style={{width: '100%', height: 'calc(100% - 240px)', paddingTop: '15px'}}>
            <AccountTab lock={this.props.lock} />
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
    cloudStorageToken: state.cloudStorageToken
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    retrieveCloudStorageToken: () => {
      dispatch(retrieveCloudStorageToken())
    },
    setUserProfile: (userProfile) => {
      dispatch(setUserProfile(userProfile))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(graphql(updateUserProfile, {name: 'updateUserProfile'})(Radium(UserDashboardPage)))
