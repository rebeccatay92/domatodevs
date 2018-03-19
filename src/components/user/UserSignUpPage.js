import React, { Component } from 'react'

class UserSignUpPage extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <div style={{marginTop: '60px'}}>
        Sign up
        <div>
          Email address:
          First name:
          Last name:
          Password
          Submit button
        </div>
      </div>
    )
  }
}

export default UserSignUpPage
