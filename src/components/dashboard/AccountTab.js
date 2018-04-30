import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'

import { allCountries } from '../../apollo/country'
import { updateUserProfile } from '../../apollo/user'
import { setUserProfile } from '../../actions/userActions'

import { AccountTabStyles as styles } from '../../Styles/AccountTabStyles'

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

        {/* LEFT COLUMN CONTAINER */}
        <div style={styles.leftColumnContainer}>
          {/* LEFT COLUMN DIV WITH BORDER RIGHT */}
          <div style={styles.leftColumnRightBorderDiv}>
            <h4 style={this.state.focusedTab === 'profile' ? styles.clickedTab : styles.unclickedTab} onClick={() => this.setState({focusedTab: 'profile'})}>Profile Information</h4>
            <h4 style={this.state.focusedTab === 'security' ? styles.clickedTab : styles.unclickedTab} onClick={() => this.setState({focusedTab: 'security'})}>Security</h4>
          </div>
        </div>

        <div style={styles.rightColumnContainer}>
          {this.state.focusedTab === 'profile' &&
            <React.Fragment>
              <h4 style={styles.headerText}>Username: {profile.username}</h4>
              <h4 style={styles.headerText}>Email: {profile.email}</h4>
              <h4 style={styles.headerText}>Name: </h4>
              <input type='text' value={this.state.fullName} placeholder={`What's your name?`} onChange={e => this.handleChange(e, 'fullName')} style={styles.nameInputField} />
              <h4 style={styles.headerText}>Country:</h4>
              <select onChange={e => this.selectCountry(e)} value={this.state.CountryId} style={styles.countryDropdown}>
                <option value={''}>Select a country</option>
                {allCountries.map((country, i) => {
                  return (
                    <option key={i} value={country.id}>{country.name}</option>
                  )
                })}
              </select>
              <button style={styles.saveButton} onClick={() => this.updateProfile()}>Save changes</button>
            </React.Fragment>
          }
          {this.state.focusedTab === 'security' &&
            <React.Fragment>
              <h4 style={styles.headerText}>Change password</h4>
              <button onClick={() => this.props.lock.changePassword()} style={styles.changePasswordButton}>Click here to change your password</button>
              <button style={styles.deleteButton}>Delete account</button>
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
