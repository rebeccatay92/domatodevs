import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggleShowNavBar } from '../actions/navBarActions'

// import { primaryColor } from '../Styles/styles'

// const dropdownIconStyle = {
//   lineHeight: '54px',
//   left: '2vw',
//   position: 'absolute',
//   color: primaryColor,
//   cursor: 'pointer'
// }
//
// const searchIconStyle = {
//   fontSize: '18px'
// }
//
// const bucketLogoStyle = {
//   lineHeight: '54px',
//   fontSize: '36px',
//   // marginLeft: '1vw',
//   color: primaryColor,
//   cursor: 'pointer'
// }

const navBarContainerStyle = {display: 'flex', position: 'fixed', top: '0', width: '100%', height: '52px', boxSizing: 'border-box', borderBottom: '1px solid rgba(60, 58, 68, 0.3)', boxShadow: '0px -2px 5px 2px rgba(0, 0, 0, .2)', background: 'white', zIndex: '200', alignItems: 'center', justifyContent: 'space-between'}

class NavbarInstance extends Component {
  render () {
    var userProfile = this.props.userProfile
    var isLoggedIn = userProfile.id ? true : false
    if (isLoggedIn) {
      var profilePic = userProfile.profilePic
    }

    return (
      <div style={navBarContainerStyle}>
        <div style={{height: '100%', display: 'flex', alignItems: 'center'}}>
          <i className='material-icons ignoreNavBarHamburger' style={{fontSize: '32px', cursor: 'pointer', marginLeft: '32px', marginRight: '100px'}} onClick={() => this.props.toggleShowNavBar()}>menu</i>
          <Link to={'/'} >
            <img src={`${process.env.PUBLIC_URL}/img/marcoLogo.png`} style={{height: '32px', width: '32px', cursor: 'pointer'}} />
          </Link>
          <input type='text' style={{width: '300px', height: '32px', lineHeight: '32px', marginLeft: '32px'}} />
          <i className='material-icons' style={{fontSize: '32px', marginLeft: '10px', cursor: 'pointer'}}>search</i>
        </div>
        <div style={{height: '100%', display: 'flex', alignItems: 'center', marginRight: '32px'}}>
          {isLoggedIn &&
            <React.Fragment>
              <span onClick={() => this.props.lock.logout()} style={{cursor: 'pointer'}}>Log out</span>
              <Link to={'/user/media'}>
                <img src={profilePic} width='35px' height='35px' style={{background: 'black', borderRadius: '50%', marginLeft: '10px'}} />
              </Link>
            </React.Fragment>
          }
          {!isLoggedIn &&
            <span onClick={() => this.props.lock.login()} style={{cursor: 'pointer'}}>Log In / Sign Up</span>
          }
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

export default connect(mapStateToProps, mapDispatchToProps)(NavbarInstance)
