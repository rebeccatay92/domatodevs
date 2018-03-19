import { Navbar, FormGroup, FormControl, InputGroup, Button, Nav, NavItem } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import React from 'react'
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

const navbarInstance = (
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
    {/* <Nav bsStyle='pills' pullRight>
      <Link to={`/signup`}>
        Sign Up
      </Link>
      <Link to={`/login`}>
        Log In
      </Link>
    </Nav> */}
    {/* <Nav>Log In Auth0</Nav> */}
  </Navbar>
)

export default navbarInstance
