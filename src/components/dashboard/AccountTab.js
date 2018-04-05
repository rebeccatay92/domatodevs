import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'

import { allCountries } from '../../apollo/country'
import { updateUserProfile } from '../../apollo/user'
import { setUserProfile } from '../../actions/userActions'

const focusedTabStyle = {paddingLeft: '10px', borderLeft: '5px solid gray', margin: '20px 0 20px 0', cursor: 'pointer'}
const unfocusedTabStyle = {paddingLeft: '10px', borderLeft: '5px solid transparent', margin: '20px 0 20px 0', cursor: 'pointer'}

class AccountTab extends Component {
  constructor (props) {
    super(props)
    this.state = {
      focusedTab: 'profile',
      fullName: '',
      CountryId: ''
    }
  }

  selectCountry (e) {
    // console.log('value', e.target.value)
    this.setState({
      CountryId: e.target.value
    })
  }

  handleChange (e, field) {
    this.setState({
      [field]: e.target.value
    })
  }

  componentDidMount () {
    // console.log('userProfile', this.props.userProfile)
    this.setState({
      fullName: this.props.userProfile.fullName || '',
      CountryId: this.props.userProfile.CountryId || ''
    })
  }

  // componentWillReceiveProps (nextProps) {
  //
  // }

  // profilePic and bio r edited in parent component
  updateProfile () {
    console.log('state', this.state)
    // send backend req to update fullName, countryId. then update redux state
    this.props.updateUserProfile({
      variables: {
        fullName: this.state.fullName,
        CountryId: this.state.CountryId
      }
    })
      .then(returning => {
        // console.log('returning json', returning)
        let userProfile = returning.data.updateUserProfile
        this.props.setUserProfile(userProfile)
      })
  }

  render () {
    if (this.props.data.loading) return <h1>Loading</h1>
    let profile = this.props.userProfile
    let allCountries = this.props.data.allCountries
    // console.log('allCountries', allCountries)
    return (
      <div style={{width: '100%', minHeight: 'calc(100vh - 360px)', padding: '15px 0 15px 0', border: '1px solid red', boxSizing: 'border-box'}}>

        <div style={{display: 'inline-block', verticalAlign: 'top', width: '20%', minHeight: 'calc(100vh - 375px)', borderRight: '2px solid gray', paddingRight: '10px'}}>
          <h4 style={this.state.focusedTab === 'profile' ? focusedTabStyle : unfocusedTabStyle} onClick={() => this.setState({focusedTab: 'profile'})}>Profile Information</h4>
          <h4 style={this.state.focusedTab === 'security' ? focusedTabStyle : unfocusedTabStyle} onClick={() => this.setState({focusedTab: 'security'})}>Security</h4>
        </div>

        <div style={{display: 'inline-block', verticalAlign: 'top', width: '80%', boxSizing: 'border-box', paddingLeft: '20px'}}>
          {this.state.focusedTab === 'profile' &&
            <React.Fragment>
              <h4>Username: {profile.username}</h4>
              <h4>Email: {profile.email}</h4>
              <h4>Name: </h4>
              <input type='text' value={this.state.fullName} placeholder={`What's your name?`} onChange={e => this.handleChange(e, 'fullName')} style={{width: '300px', height: '30px', fontSize: '16px'}} />
              <h4>Country:</h4>
              <select onChange={e => this.selectCountry(e)} value={this.state.CountryId} style={{background: 'white', height: '30px', border: 'none', outline: '1px solid rgb(172, 172, 172)'}}>
                <option value={''}>Select a country</option>
                {allCountries.map((country, i) => {
                  return (
                    <option key={i} value={country.id}>{country.name}</option>
                  )
                })}
              </select>
              <button style={{display: 'block'}} onClick={() => this.updateProfile()}>Save changes</button>
            </React.Fragment>
          }
          {this.state.focusedTab === 'security' &&
            <React.Fragment>
              <h4>Change password</h4>
              <button onClick={() => this.props.lock.changePassword()} style={{background: `rgb(211, 247, 183)`, border: 'none', outline: '1px solid gray', height: '50px'}}>Click here to change your password</button>

              <h4>Delete account</h4>
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

const mapDispatchToProps = (dispatch) => {
  return {
    setUserProfile: (userProfile) => {
      dispatch(setUserProfile(userProfile))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(allCountries),
  graphql(updateUserProfile, {name: 'updateUserProfile'})
)(AccountTab))
