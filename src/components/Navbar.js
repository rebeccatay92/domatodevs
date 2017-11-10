import { Navbar, FormGroup, FormControl, InputGroup, Button } from 'react-bootstrap'
import React from 'react'
import { Link } from 'react-router-dom'

const dropdownIconStyle = {
  lineHeight: '54px',
  left: '2vw',
  position: 'absolute',
  color: '#EDB5BF'
}

const searchIconStyle = {
  fontSize: '18px'
}

const bucketLogoStyle = {
  lineHeight: '54px',
  fontSize: '36px',
  // marginLeft: '1vw',
  color: '#EDB5BF'
}

const navbarInstance = (
  <Navbar style={{backgroundColor: 'white', boxShadow: '2px 2px 20px 0px rgba(0, 0, 0, .2)'}}>
    <Navbar.Header>
      <i style={dropdownIconStyle} className='material-icons'>menu</i>
      <i style={bucketLogoStyle} className='material-icons'>delete</i>
    </Navbar.Header>
    <Navbar.Form style={{margin: '10px 0', marginLeft: '89px', paddingLeft: '0'}}>
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
    {/* <Link to='/'>Home</Link>
    <Link to='/itineraries'>Itineraries</Link> */}
  </Navbar>
)

export default navbarInstance
