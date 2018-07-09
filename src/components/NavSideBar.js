import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import onClickOutside from 'react-onclickoutside'
import { toggleShowNavBar } from '../actions/navBarActions'
import Radium from 'radium'
import { NavSideBarStyles as styles } from '../Styles/NavSideBarStyles'

let navLinksArray = [
  {icon: 'home', text: 'Home', redirect: '/'},
  {icon: 'thumb_up', text: 'Liked Posts', redirect: '/user/savedArticles'},
  {icon: 'assignment', text: 'Bucket List', redirect: '/user/bucket'},
  {icon: 'perm_media', text: 'Your Media', redirect: '/user/media'}
]

class NavSideBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // none, more, less
      showExpand: 'none'
    }
  }

  handleClickOutside (event) {
    this.props.toggleShowNavBar()
  }

  onNavLinkClick (redirectUrl) {
    this.props.history.push(redirectUrl)
    this.props.toggleShowNavBar()
  }

  componentDidMount () {
    // console.log('props', this.props.userProfile)
    let itineraryList = this.props.userProfile.itineraries
    let length = itineraryList.length

    if (length <= 7) {
      this.setState({showExpand: 'none'})
    } else if (length > 7) {
      this.setState({showExpand: 'more'})
    }
  }

  render () {
    return (
      <div style={styles.navSideBarContainer}>
        <div style={styles.navSection}>
          {navLinksArray.map((obj, i) => {
            return (
              <div key={i} style={styles.navLinkContainer} onClick={() => this.onNavLinkClick(obj.redirect)}>
                <i className='material-icons' style={styles.navLinkIcon}>{obj.icon}</i>
                <span style={styles.navLinkText}>{obj.text}</span>
              </div>
            )
          })}
        </div>

        <hr style={styles.sectionDivider} />

        <div style={styles.middleItinerarySection}>
          <span style={styles.itineraryHeaderText} onClick={() => this.onNavLinkClick('/user/itineraries')}>ITINERARIES</span>
          <div style={this.state.showExpand === 'more' ? {height: '280px', overflow: 'hidden'} : {}}>
            {this.props.userProfile.itineraries.map((itinerary, i) => {
              return (
                <div key={`itinerary${i}`} style={styles.navLinkContainer} onClick={() => this.onNavLinkClick(`/planner/${i + 1}`)}>
                  <div style={{display: 'inline-block', width: '24px', height: '24px', borderRadius: '50%', marginRight: '22px', border: '1px solid black'}} />
                  <span style={styles.itineraryName}>{itinerary.name}</span>
                </div>
              )
            })}
          </div>
          {/* FONT SIZE INCREASED TO 24PX FOR EXPAND ICON. MARGINRIGHT ADJUST TO 22PX INSTEAD OF  25 PX TO MATCH ITINERARIES */}
          {this.state.showExpand === 'more' &&
            <div style={styles.navLinkContainer} key={'showMoreItineraries'} onClick={() => this.setState({showExpand: 'less'})}>
              <i className='material-icons' style={{...styles.navLinkIcon, fontSize: '24px', marginRight: '22px'}}>expand_more</i>
              <span style={styles.navLinkText}>Show more</span>
            </div>
          }
          {this.state.showExpand === 'less' &&
            <div style={styles.navLinkContainer} key={'showMoreItineraries'} onClick={() => this.setState({showExpand: 'more'})}>
              <i className='material-icons' style={{...styles.navLinkIcon, fontSize: '24px', marginRight: '22px'}}>expand_less</i>
              <span style={styles.navLinkText}>Show less</span>
            </div>
          }
        </div>

        <hr style={styles.sectionDivider} />

        <div style={styles.navSection}>
          <div style={styles.navLinkContainer} key={'navSideBar-Settings'}>
            <i className='material-icons' style={styles.navLinkIcon}>settings</i>
            <span style={styles.navLinkText} onClick={() => this.onNavLinkClick('/user/account')}>Settings</span>
          </div>
          <div style={styles.navLinkContainer} key={'navSideBar-Feedback'}>
            <i className='material-icons' style={styles.navLinkIcon}>chat_bubble</i>
            <span style={styles.navLinkText}>Feedback</span>
          </div>
        </div>

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
    toggleShowNavBar: () => {
      dispatch(toggleShowNavBar())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter((onClickOutside(Radium(NavSideBar)))))
