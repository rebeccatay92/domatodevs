import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { ClipLoader } from 'react-spinners'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import { createToken } from '../apollo/user'

import { initializeUser, logoutUser } from '../actions/userActions'
import { generateCloudStorageToken } from '../actions/cloudStorageActions'

import HomePage from './HomePage'
import ItineraryPage from './itinerary/ItineraryPage'
import PlannerPage from './PlannerPage'
import Navbar from './Navbar'
import MapPlannerPage from './mapPlanner/MapPlannerPage'

class App extends Component {
  toggleLoginLogout () {
    if (!this.props.token) {
      console.log('logging in')
      this.props.createToken({
        variables: {
          email: 'Litzy_Hansen@gmail.com',
          password: 'password1'
        }
      })
        .then(({data}) => {
          window.localStorage.setItem('token', data.createToken)
          this.props.initializeUser()
        })
    } else {
      console.log('logging out')
      window.localStorage.removeItem('token')
      this.props.logoutUser()
    }
  }

  componentDidMount () {
    this.props.initializeUser()
    this.props.generateCloudStorageToken()
  }

  render () {
    return (
      <Router>
        <div style={{backgroundColor: '#FFFFFF'}}>
          {Navbar}
          {/* <div style={{border: '1px solid red', marginTop: '500px'}}>
            <button onClick={() => this.toggleLoginLogout()}>Fake login/logout toggle. User 1's token. change toggleLoginLogout email to your own seeded user 1's.</button>
            <h4>Token: {this.props.token}</h4>
          </div> */}
          <Route exact path='/' component={() => (
            <HomePage />
          )} />
          <Route path='/itineraries' component={() => (
            <ItineraryPage />
          )} />
          <Route path='/planner/:itineraryId' component={PlannerPage} />
          <Route path='/map/:itineraryId' component={MapPlannerPage} />
          {this.props.showSpinner && (
            <div style={{position: 'fixed', top: '0', left: '0', height: '100vh', width: '100vw', backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
              <div style={{position: 'fixed', top: 'calc(50% - 35px)', left: 'calc(50% - 35px)', height: '70px', width: '70px'}}>
                <ClipLoader
                  color={'#000000'}
                  size={70}
                  loading={this.props.showSpinner}
                />
              </div>
            </div>
          )}
        </div>
      </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token,
    cloudStorageToken: state.cloudStorageToken,
    showSpinner: state.showSpinner
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeUser: () => {
      dispatch(initializeUser())
    },
    logoutUser: () => {
      dispatch(logoutUser())
    },
    generateCloudStorageToken: () => {
      dispatch(generateCloudStorageToken())
    }
  }
}

export default DragDropContext(HTML5Backend)(connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(createToken, {name: 'createToken'})
)(App)))
