import React, { Component } from 'react'
import { Router, Route } from 'react-router-dom'
// import jwt from 'jsonwebtoken'
import { connect } from 'react-redux'
// import { graphql, compose } from 'react-apollo'
import { ClipLoader } from 'react-spinners'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import { generateCloudStorageToken } from '../actions/cloudStorageActions'

import HomePage from './HomePage'
import ItineraryPage from './itinerary/ItineraryPage'
import PlannerPage from './PlannerPage'
import ReadPage from './read/ReadPage'
import BlogEditorPage from './read/editor/BlogEditorPage'
import Navbar from './Navbar'
import MapPlannerPage from './mapPlanner/MapPlannerPage'
import UserProfilePage from './user/UserProfilePage'

import PasswordChanged from './Auth0/PasswordChanged'

import history from './Auth0/history'
import Lock from './Auth0/lock'
const lock = new Lock()

class App extends Component {
  componentDidMount () {
    this.props.generateCloudStorageToken()
  }

  render () {
    return (
      <Router history={history}>
        <div style={{backgroundColor: '#FFFFFF'}}>
          <Navbar lock={lock} />
          <div style={{marginTop: '60px'}}>
            <Route exact path='/' render={(props) => (
              <HomePage lock={lock} {...props} />
            )} />
            {/* <Route path='/callback' render={(props) => {
              return <Callback {...props} handleAuthentication={() => handleAuthentication(props)} />
            }} /> */}
            <Route path='/passwordChanged' component={PasswordChanged} />
            <Route path='/user' render={(props) => (
              <UserProfilePage lock={lock} {...props} />
            )} />
            <Route path='/itineraries' render={(props) => (
              <ItineraryPage lock={lock} {...props} />
            )} />
            <Route path='/planner/:itineraryId' component={PlannerPage} />
            <Route path='/map/:itineraryId' component={MapPlannerPage} />
            <Route path='/blog/:blogId' component={ReadPage} />
            <Route path='/blogeditor/:blogId' component={BlogEditorPage} />
          </div>
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
    cloudStorageToken: state.cloudStorageToken,
    showSpinner: state.showSpinner
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    generateCloudStorageToken: () => {
      dispatch(generateCloudStorageToken())
    }
  }
}

export default DragDropContext(HTML5Backend)(connect(mapStateToProps, mapDispatchToProps)(App))
