import React, { Component } from 'react'
import { connect } from 'react-redux'

const focusedTabStyle = {paddingLeft: '10px', borderLeft: '5px solid gray', margin: '20px 0 20px 0'}
const unfocusedTabStyle = {paddingLeft: '10px', borderLeft: '5px solid transparent', margin: '20px 0 20px 0'}

class AccountTab extends Component {
  constructor (props) {
    super(props)
    this.state = {
      focusedTab: 'profile'
    }
  }

  render () {
    var profile = this.props.userProfile
    return (
      <div style={{width: '100%', height: '100%'}}>
        <div style={{display: 'inline-block', verticalAlign: 'top', width: '20%', height: '100%', borderRight: '2px solid gray', paddingRight: '10px'}}>
          <h4 style={this.state.focusedTab === 'profile' ? focusedTabStyle : unfocusedTabStyle} onClick={() => this.setState({focusedTab: 'profile'})}>Profile Information</h4>
          <h4 style={this.state.focusedTab === 'security' ? focusedTabStyle : unfocusedTabStyle} onClick={() => this.setState({focusedTab: 'security'})}>Security</h4>
        </div>
        <div style={{display: 'inline-block', verticalAlign: 'top', width: '80%', boxSizing: 'border-box', paddingLeft: '20px'}}>
          {this.state.focusedTab === 'profile' &&
            <React.Fragment>
              <h4>Username: {profile.username}</h4>
              <h4>Email: {profile.email}</h4>
              <h4>Name: </h4>
              <input type='text' placeholder={profile.fullName} style={{width: '300px', height: '30px', fontSize: '16px'}} />
              <h4>Country: {profile.country}</h4>
              <select>
                <option>Use country dropdown here</option>
              </select>
            </React.Fragment>
          }
          {this.state.focusedTab === 'security' &&
            <React.Fragment>
              <div>security</div>
            </React.Fragment>
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

export default connect(mapStateToProps)(AccountTab)

{/* <h3>Email address: {profile.email}</h3>
<h3>Full Name: {profile.fullName}</h3>
<button onClick={() => this.props.lock.changePassword()}>Change password</button> */}
