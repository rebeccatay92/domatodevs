import React, { Component } from 'react'
import { Router, Route } from 'react-router-dom'

import { connect } from 'react-redux'

import { ClipLoader } from 'react-spinners'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

// import { generateCloudStorageToken } from '../actions/cloudStorageActions'

import HomePage from './HomePage'
import ItineraryPage from './itinerary/ItineraryPage'
import PlannerPage from './PlannerPage'
import ReadPage from './read/ReadPage'
import BlogEditorPage from './read/editor/BlogEditorPage'
import Navbar from './Navbar'
import MapPlannerPage from './mapPlanner/MapPlannerPage'
import UserDashboardPage from './dashboard/UserDashboardPage'
import ConfirmWindow from './misc/ConfirmWindow'

import PasswordChanged from './Auth0/PasswordChanged'
import history from './Auth0/history'
import Lock from './Auth0/lock'

import GoogleCloudStorage from './Google/GoogleCloudStorage'
const GoogleCloudStorageInstance = new GoogleCloudStorage()

const lock = new Lock()

class App extends Component {
  // componentDidMount () {
  //   this.props.generateCloudStorageToken()
  // }

  render () {
    // var isAuthenticated = lock.isAuthenticated()
    // var userId = window.localStorage.getItem('user_id')
    return (
      <Router history={history}>
        <div style={{backgroundColor: '#FFFFFF'}}>
          <Navbar lock={lock} />

          <div style={{width: '100%', marginTop: '53px'}}>
            <Route exact path='/' render={(props) => (
              <HomePage lock={lock} {...props} />
            )} />
            <Route path='/passwordChanged' component={PasswordChanged} />
            <Route path='/user' render={(props) => (
              <UserDashboardPage lock={lock} {...props} />
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
            <div style={{position: 'fixed', top: '0', left: '0', height: '100vh', width: '100vw', backgroundColor: 'rgba(255, 255, 255, 0.5)', zIndex: '9999'}}>
              <div style={{position: 'fixed', top: 'calc(50% - 35px)', left: 'calc(50% - 35px)', height: '70px', width: '70px'}}>
                <ClipLoader
                  color={'#000000'}
                  size={70}
                  loading={this.props.showSpinner}
                />
              </div>
            </div>
          )}

          {this.props.confirmWindow.open && <ConfirmWindow />}
        </div>
      </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    // cloudStorageToken: state.cloudStorageToken,
    showSpinner: state.showSpinner,
    userProfile: state.userProfile,
    confirmWindow: state.confirmWindow
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     generateCloudStorageToken: () => {
//       dispatch(generateCloudStorageToken())
//     }
//   }
// }

export default DragDropContext(HTML5Backend)(connect(mapStateToProps)(App))
