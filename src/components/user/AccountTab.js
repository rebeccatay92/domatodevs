import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'

import { allCountries } from '../../apollo/country'

const focusedTabStyle = {paddingLeft: '10px', borderLeft: '5px solid gray', margin: '20px 0 20px 0'}
const unfocusedTabStyle = {paddingLeft: '10px', borderLeft: '5px solid transparent', margin: '20px 0 20px 0'}

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
    console.log('userProfile', this.props.userProfile)
    this.setState({
      fullName: this.props.userProfile.fullName,
      CountryId: this.props.userProfile.CountryId || ''
    })
  }

  // componentWillReceiveProps (nextProps) {
  //
  // }

  updateProfile () {
    // send backend req to update fullName, countryId.
    console.log('state', this.state)
  }
  render () {
    if (this.props.data.loading) return <h1>Loading</h1>
    let profile = this.props.userProfile
    let allCountries = this.props.data.allCountries
    // console.log('allCountries', allCountries)
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
              <button onClick={() => this.props.lock.changePassword()}>Change password</button>
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

export default connect(mapStateToProps)(compose(
  graphql(allCountries)
)(AccountTab))
