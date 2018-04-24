import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'

import { allCountries } from '../../apollo/country'
import { updateUserProfile } from '../../apollo/user'
import { setUserProfile } from '../../actions/userActions'

const unfocusedTabStyle = {fontFamily: 'EB Garamond, serif', fontSize: '18px', fontWeight: '400', lineHeight: '23px', borderLeft: '4px solid transparent', paddingLeft: '4px', color: 'rgba(60, 58, 68, 1)', cursor: 'pointer', margin: '0px 0px 24px 0px'}
const focusedTabStyle = {...unfocusedTabStyle, borderLeft: '4px solid rgba(60, 58, 68, 1)'}

const accountHeaderStyle = {fontFamily: 'EB Garamond, serif', fontSize: '18px', fontWeight: '400', color: 'rgba(60, 58, 68, 1)', margin: '24px 0 0 0'}

const accountInputFieldStyle = {height: '41px', width: '340px', padding: '8px', fontFamily: 'EB Garamond, serif', fontWeight: '400', fontSize: '18px', lineHeight: '41px', color: 'rgba(60, 58, 68, 1)', marginTop: '8px'}

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
      <div style={{width: '100%', height: 'calc(100vh - 270px)', boxSizing: 'border-box'}}>

        {/* LEFT COLUMN CONTAINER*/}
        <div style={{display: 'inline-block', width: '167px', height: 'calc(100vh - 110px)', paddingTop: '24px', paddingBottom: '24px', paddingLeft: '2px'}}>
          {/* LEFT COLUMN DIV WITH BORDER RIGHT */}
          <div style={{width: '100%', height: '100%', borderRight: '1px solid rgba(60,58,68,0.3)'}}>
            <h4 style={this.state.focusedTab === 'profile' ? focusedTabStyle : unfocusedTabStyle} onClick={() => this.setState({focusedTab: 'profile'})}>Profile Information</h4>
            <h4 style={this.state.focusedTab === 'security' ? focusedTabStyle : unfocusedTabStyle} onClick={() => this.setState({focusedTab: 'security'})}>Security</h4>
          </div>
        </div>

        <div style={{display: 'inline-block', verticalAlign: 'top', width: 'calc(100% - 167px)', height: 'calc(100vh - 110px)', boxSizing: 'border-box', paddingLeft: '24px'}}>
          {this.state.focusedTab === 'profile' &&
            <React.Fragment>
              <h4 style={accountHeaderStyle}>Username: {profile.username}</h4>
              <h4 style={accountHeaderStyle}>Email: {profile.email}</h4>
              <h4 style={accountHeaderStyle}>Name: </h4>
              <input type='text' value={this.state.fullName} placeholder={`What's your name?`} onChange={e => this.handleChange(e, 'fullName')} style={accountInputFieldStyle} />
              <h4 style={accountHeaderStyle}>Country:</h4>
              <select onChange={e => this.selectCountry(e)} value={this.state.CountryId} style={{background: 'white', width: '340px', height: '41px', border: 'none', outline: '1px solid rgba(60, 58, 68, 0.3)', padding: '8px', fontFamily: 'EB Garamond, serif', fontWeight: '400', fontSize: '18px', lineHeight: '41px', marginTop: '8px'}}>
                <option value={''}>Select a country</option>
                {allCountries.map((country, i) => {
                  return (
                    <option key={i} value={country.id}>{country.name}</option>
                  )
                })}
              </select>
              <button style={{display: 'block', marginTop: '24px', background: 'white', fontFamily: 'EB Garamond, serif', fontWeight: '400', fontSize: '18px'}} onClick={() => this.updateProfile()}>Save changes</button>
            </React.Fragment>
          }
          {this.state.focusedTab === 'security' &&
            <React.Fragment>
              <h4 style={accountHeaderStyle}>Change password</h4>
              <button onClick={() => this.props.lock.changePassword()} style={{background: `rgb(211, 247, 183)`, border: 'none', outline: '1px solid rgba(60, 58, 68, 0.3)', height: '41px', fontFamily: 'EB Garamond, serif', fontWeight: '400', fontSize: '18px', lineHeight: '41px', marginTop: '8px'}}>Click here to change your password</button>
              <button style={{display: 'block', marginTop: '24px', background: 'white', fontFamily: 'EB Garamond, serif', fontWeight: '400', fontSize: '18px'}}>Delete account</button>
            </React.Fragment>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
    userDashboard: state.userDashboard
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
