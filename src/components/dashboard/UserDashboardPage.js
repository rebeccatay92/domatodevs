import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import Radium from 'radium'

import DashboardTabsHOC from './DashboardTabsHOC'

import { updateUserProfile } from '../../apollo/user'
import { setUserProfile } from '../../actions/userActions'
import { setStickyTabs } from '../../actions/userDashboardActions'

// use alias to shorten style names
import { userDashboardStyles as styles } from '../../Styles/UserDashboardStyles'

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
    this.props.history.push(`/user/${tabName}`)
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
    console.log('this.props', this.props)
    let tab = this.props.match.params.tab
    console.log('tab in route', tab)

    if (tab !== 'account' && tab !== 'blogs' && tab !== 'itineraries' && tab !== 'media' && tab !== 'savedArticles' && tab !== 'bucket') {
      console.log('no match with tab. default to account')
      this.props.history.replace('/user/account')
    }

    this.setState({
      focusedTab: tab
    })

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
      this.setState({
        profilePic: nextProps.userProfile.profilePic,
        bio: nextProps.userProfile.bio || ''
      })
    }
    if (nextProps.match.params.tab !== this.props.match.params.tab) {
      this.setState({
        focusedTab: nextProps.match.params.tab
      })
    }
  }

  render () {
    // use redux state instead of token expiry time to determine logged in status
    var profile = this.props.userProfile
    // console.log('redux state profile', profile)
    if (!profile.id) return <p>Not logged in</p>

    let stickyTabs = this.props.userDashboard.stickyTabs

    return (
      <div style={{margin: '52px auto 153px auto', width: '1265px', minHeight: 'calc(100vh - 52px)', boxSizing: 'border-box'}}>

        {/* PROFILE SECTION */}
        <div style={{margin: '48px 0 32px 0', width: '100%', height: '97px', display: 'inline-flex'}}>
          <label>
            <div style={styles.profilePicContainer}>
              <div style={styles.profilePicTint}>
                <span style={styles.profilePicTintText}>CHANGE</span>
              </div>
              <img src={this.state.profilePic} width='97px' height='97px' style={styles.profilePic} />
            </div>
            <input type='file' accept='.jpeg, .jpg, .png' onChange={e => this.uploadProfilePic(e)} style={{display: 'none'}} />
          </label>

          <div style={styles.bioSectionContainer}>
            <h1 style={styles.username}>{profile.username}</h1>
            {!this.state.editingBio &&
              <div style={styles.bioTextContainer}>
                {this.state.bio &&
                  <h4 style={styles.bioText}>{this.state.bio}</h4>
                }
                {!this.state.bio &&
                  <h4 style={styles.bioText}>You don't have a bio!</h4>
                }
                <i className='material-icons' onClick={() => this.makeBioEditable()} style={{cursor: 'pointer', marginLeft: '10px'}}>mode_edit</i>
              </div>
            }
            {this.state.editingBio &&
              <div style={styles.bioTextAreaContainer}>
                <textarea value={this.state.bio} placeholder={'Describe yourself in 255 characters'} onChange={e => this.handleChange(e, 'bio')} onKeyDown={(e) => this.onBioKeyDown(e)} style={styles.bioTextArea} />
                {/* <span>{100 - this.state.bio.length} characters left</span> */}
              </div>
            }
          </div>
        </div>

        {/* TABS BECOME STICKY AFTER SCROLLPOINT */}
        <div className={'dashboardTabs'} style={stickyTabs ? styles.tabsBarSticky : styles.tabsBarNonSticky}>
          {this.state.tabsArray.map((obj, i) => {
            return (
              <h3 key={i} style={this.state.focusedTab === obj.tab ? styles.clickedTab : styles.unclickedTab} onClick={() => this.focusTab(obj.tab)}>{obj.text}</h3>
            )
          })}
        </div>
        {/* GHOST DIV TO MAINTAIN POSITIONING AFTER TABS BECOME POSITION FIXED (LEAVES DOM FLOW) */}
        {stickyTabs &&
          <div style={{width: '100%', height: '56px'}} />
        }
        <DashboardTabsHOC focusedTab={this.state.focusedTab} lock={this.props.lock} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
    googleCloudToken: state.googleCloudToken,
    userDashboard: state.userDashboard
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUserProfile: (userProfile) => {
      dispatch(setUserProfile(userProfile))
    },
    setStickyTabs: (sticky) => {
      dispatch(setStickyTabs(sticky))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(graphql(updateUserProfile, {name: 'updateUserProfile'})(Radium(UserDashboardPage)))
