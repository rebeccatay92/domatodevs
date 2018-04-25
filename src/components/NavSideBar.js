import React, { Component } from 'react'
import { connect } from 'react-redux'
import onClickOutside from 'react-onclickoutside'
import { toggleShowNavBar } from '../actions/navBarActions'

let navLinksArray = [
  {icon: 'home', text: 'Home'},
  {icon: 'thumb_up', text: 'Liked Posts'},
  {icon: 'assignment', text: 'Bucket List'},
  {icon: 'perm_media', text: 'Your Media'}
]

class NavSideBar extends Component {
  handleClickOutside (event) {
    this.props.toggleShowNavBar()
  }

  render () {
    return (
      <div style={{display: 'flex', flexFlow: 'column nowrap', position: 'fixed', top: '52px', width: '220px', height: 'calc(100vh - 52px)', zIndex: '200', background: 'rgb(250, 250, 250)', padding: '0 24px 0 24px', borderRight: '1px solid rgba(60, 58, 68, 0.3)', color: 'rgba(60, 58, 68, 0.7)', fontFamily: 'Roboto, sans-serif', fontWeight: '400'}}>
        {navLinksArray.map((obj, i) => {
          return (
            <div key={i} style={{display: 'flex', margin: '12px 0 12px 0', cursor: 'pointer'}}>
              <i className='material-icons' style={{fontSize: '24px', marginRight: '20px'}}>{obj.icon}</i>
              <span style={{fontSize: '15px', lineHeight: '24px'}}>{obj.text}</span>
            </div>
          )
        })}
        <hr style={{margin: 0, padding: 0}} />
        <div style={{width: '100%', height: '300px', margin: '12px 0 12px 0', display: 'flex', flexFlow: 'column nowrap'}}>
          <span style={{margin: '12px 0 12px 0', fontSize: '18px'}}>ITINERARIES</span>
          {/* USERS ITINERARIES */}
        </div>
        <hr style={{margin: 0, padding: 0}} />
        <div style={{display: 'flex', alignItems: 'center', margin: '12px 0 12px 0', cursor: 'pointer'}}>
          <i className='material-icons' style={{fontSize: '24px', marginRight: '20px'}}>settings</i>
          <span style={{fontSize: '15px', lineHeight: '24px'}}>Settings</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', margin: '12px 0 12px 0', cursor: 'pointer'}}>
          <i className='material-icons' style={{fontSize: '24px', marginRight: '20px'}}>chat_bubble</i>
          <span style={{fontSize: '15px', lineHeight: '24px'}}>Feedback</span>
        </div>
      </div>
    )
  }
}

// const mapStateToProps = (state) => {
//   return {
//     navBar: state.navBar
//   }
// }

const mapDispatchToProps = (dispatch) => {
  return {
    toggleShowNavBar: () => {
      dispatch(toggleShowNavBar())
    }
  }
}

export default connect(null, mapDispatchToProps)(onClickOutside(NavSideBar))
