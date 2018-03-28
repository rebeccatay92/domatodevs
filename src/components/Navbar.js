import { Navbar, FormGroup, FormControl, InputGroup, Button, Nav, NavItem } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import { connect } from 'react-redux'
// import jwt from 'jsonwebtoken'
import { primaryColor } from '../Styles/styles'

const dropdownIconStyle = {
  lineHeight: '54px',
  left: '2vw',
  position: 'absolute',
  color: primaryColor
}

const searchIconStyle = {
  fontSize: '18px'
}

const bucketLogoStyle = {
  lineHeight: '54px',
  fontSize: '36px',
  // marginLeft: '1vw',
  color: primaryColor
}

class NavbarInstance extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const isAuthenticated = this.props.lock.isAuthenticated()
    if (isAuthenticated) {
      var userProfile = this.props.userProfile
      var profilePic = userProfile.profilePic
    }

    return (
      <Navbar style={{backgroundColor: 'white', position: 'fixed', top: '0', backfaceVisibility: 'hidden', zIndex: '200'}}>
        <Navbar.Header>
          <i style={dropdownIconStyle} className='material-icons'>menu</i>
          <i style={bucketLogoStyle} className='material-icons'>delete</i>
        </Navbar.Header>
        <Navbar.Form style={{margin: '10px 0', marginLeft: '89px', paddingLeft: '0', display: 'inline-block'}}>
          <FormGroup style={{boxShadow: '2px 2px 10px -1px rgba(0, 0, 0, .2)'}}>
            <InputGroup>
              <FormControl type='text' placeholder='Discover' style={{width: '30vw', borderRadius: '0'}} />
              <InputGroup.Button>
                <Button style={{paddingBottom: '3px', borderRadius: '0'}}><i style={searchIconStyle} className='material-icons md-18'>search</i></Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
          {' '}
        </Navbar.Form>
        <Nav bsStyle='pills' pullRight>
          {isAuthenticated &&
            <React.Fragment>
              <NavItem onClick={() => this.props.lock.logout()}>Log Out</NavItem>
              <Link to={'/user'}>
                <img src={profilePic} width='50px' height='50px' style={{background: 'black', borderRadius: '50%'}} />
              </Link>
            </React.Fragment>
          }
          {!isAuthenticated &&
            <NavItem onClick={() => this.props.lock.login()}>Log In / Sign up</NavItem>
          }
        </Nav>
      </Navbar>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile
  }
}

export default connect(mapStateToProps)(NavbarInstance)
