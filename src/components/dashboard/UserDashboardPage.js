import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import Radium from 'radium'

import DashboardTabsHOC from './DashboardTabsHOC'

import { updateUserProfile } from '../../apollo/user'
import { setUserProfile } from '../../actions/userActions'
// import { retrieveCloudStorageToken } from '../../actions/cloudStorageActions'
import { setStickyTabs } from '../../actions/userDashboardActions'

const unclickedTabStyle = {cursor: 'pointer', height: '100%', fontFamily: 'Roboto, sans-serif', fontSize: '24px', fontWeight: '300', marginTop: '1px', marginRight: '40px', paddingTop: '16px', paddingBottom: '16px', color: 'rgba(60, 58, 68, 0.3)'}
const clickedTabStyle = {...unclickedTabStyle, color: 'rgba(223, 56, 107, 1)', borderBottom: '3px solid rgba(223, 56, 107, 1)'}

const profilePicTintStyle = {background: `rgba(255, 255, 255, 0.3)`, width: '97px', height: '97px', borderRadius: '50%', position: 'absolute', top: '0', left: '0', textAlign: 'center', padding: '30px 0 30px 0', cursor: 'pointer', opacity: 0, ':hover': {opacity: '1'}}

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
      focusedTab: 'media',
      bio: '',
      editingBio: false
    }
    this.handleScrollBound = (e) => this.handleScroll(e)
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
      if (e.target.value.length <= 100) {
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
          'Authorization': `Bearer ${this.props.googleCloudToken.token}`,
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
    // this.props.retrieveCloudStorageToken()

    if (this.props.userProfile.id) {
      this.setState({
        profilePic: this.props.userProfile.profilePic,
        bio: this.props.userProfile.bio || ''
      })
    }

    document.addEventListener('scroll', this.handleScrollBound)
  }

  componentWillUnmount () {
    document.removeEventListener('scroll', this.handleScrollBound)
  }

  handleScroll (e) {
    // console.log('scroll', e)
    const el = document.querySelector('.dashboardTabs')
    const rect = el.getBoundingClientRect()
    // console.log('rect', rect)
    const distFromTop = rect.top
    // console.log('tabs distFromTop', distFromTop)

    if (distFromTop <= 50 && !this.props.userDashboard.stickyTabs) {
      this.props.setStickyTabs(true)
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

    let stickyTabs = this.props.userDashboard.stickyTabs

    return (
      <div style={{margin: '53px auto 153px auto', width: '1265px', minHeight: 'calc(100vh - 53px)', boxSizing: 'border-box'}}>

        {/* PROFILE SECTION */}
        <div style={{margin: '48px 0 32px 0', width: '100%', height: '97px', display: 'inline-flex'}}>
          <label>
            <div style={{position: 'relative', width: '97px', height: '97px'}}>
              <div style={profilePicTintStyle}>
                <span style={{fontSize: '16px', textShadow: '2px 2px 0 rgb(255, 255, 255)'}}>CHANGE</span>
              </div>
              <img src={this.state.profilePic} width='97px' height='97px' style={{borderRadius: '50%', display: 'inline-block'}} />
            </div>
            <input type='file' accept='.jpeg, .jpg, .png' onChange={e => this.uploadProfilePic(e)} style={{display: 'none'}} />
          </label>

          <div style={{width: 'calc(100% - 97px)', height: '97px', padding: '0 20px 0 20px'}}>
            <h1 style={{margin: 0, fontFamily: 'Roboto, sans-serif', fontSize: '55px', lineHeight: '66px', fontWeight: 100, color: 'rgba(60, 58, 68, 0.7)'}}>{profile.username}</h1>
            {!this.state.editingBio &&
              <div style={{display: 'inline-flex', justifyContent: 'flex-start', alignItems: 'center', width: 'auto'}}>
                {this.state.bio &&
                  <h4 style={{fontFamily: 'EB Garamond, serif', fontSize: '24px', lineHeight: '31px', fontWeight: 400, color: 'rgba(60, 58, 68, 1)', margin: '0'}}>{this.state.bio}</h4>
                }
                {!this.state.bio &&
                  <h4>You don't have a bio!</h4>
                }
                <i className='material-icons' onClick={() => this.makeBioEditable()} style={{cursor: 'pointer', marginLeft: '10px'}}>mode_edit</i>
              </div>
            }
            {this.state.editingBio &&
              <div style={{display: 'inline-flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                <textarea value={this.state.bio} placeholder={'Describe yourself in 255 characters'} onChange={e => this.handleChange(e, 'bio')} onKeyDown={(e) => this.onBioKeyDown(e)} style={{fontFamily: 'EB Garamond, serif', fontSize: '24px', lineHeight: '31px', height: '31px', fontWeight: 400, color: 'rgba(60, 58, 68, 1)', margin: '0', padding: '0', width: '100%', resize: 'none'}} />
                {/* <i className='material-icons' onClick={() => this.saveBio()} style={{cursor: 'pointer'}}>save</i> */}
                {/* <span>{100 - this.state.bio.length} characters left</span> */}
              </div>
            }
          </div>
        </div>

        {/* TABS BECOME STICKY AFTER SCROLLPOINT */}
        <div className={'dashboardTabs'} style={{boxSizing: 'border-box', borderBottom: '1px solid rgba(60, 58, 68, 0.3)', display: 'flex', justifyContent: 'flex-start', height: '56px', background: 'white', position: stickyTabs ? 'fixed' : 'relative', top: stickyTabs ? '50px' : '0', width: stickyTabs ? '1265px' : '100%'}}>
          {this.state.tabsArray.map((obj, i) => {
            return (
              <h3 key={i} style={this.state.focusedTab === obj.tab ? clickedTabStyle : unclickedTabStyle} onClick={() => this.focusTab(obj.tab)}>{obj.text}</h3>
            )
          })}
        </div>
        {stickyTabs &&
          <div style={{width: '100%', height: '60px'}} />
        }
        <DashboardTabsHOC focusedTab={this.state.focusedTab} lock={this.props.lock} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
    // cloudStorageToken: state.cloudStorageToken,
    googleCloudToken: state.googleCloudToken,
    userDashboard: state.userDashboard
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // retrieveCloudStorageToken: () => {
    //   dispatch(retrieveCloudStorageToken())
    // },
    setUserProfile: (userProfile) => {
      dispatch(setUserProfile(userProfile))
    },
    setStickyTabs: (sticky) => {
      dispatch(setStickyTabs(sticky))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(graphql(updateUserProfile, {name: 'updateUserProfile'})(Radium(UserDashboardPage)))
