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
import Navbar from './Navbar'
import MapPlannerPage from './mapPlanner/MapPlannerPage'
import UserProfilePage from './user/UserProfilePage'

import history from './Auth0/history'
import Callback from './Auth0/Callback'
import Auth from './Auth0/Auth'
const auth = new Auth()
// import lock from './Auth0/lock'


const handleAuthentication = ({location}) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication()
  }
}

class App extends Component {
  componentDidMount () {
    this.props.generateCloudStorageToken()
  }

  render () {
    return (
      <Router history={history}>
        <div style={{backgroundColor: '#FFFFFF'}}>
          <Navbar auth={auth} />
          <div style={{marginTop: '60px'}}>
            <Route exact path='/' render={(props) => (
              <HomePage auth={auth} {...props} />
            )} />
            <Route path='/callback' render={(props) => {
              return <Callback {...props} handleAuthentication={() => handleAuthentication(props)} />
            }} />
            <Route path='/user' render={(props) => (
              <UserProfilePage auth={auth} {...props}/>
            )} />
            <Route path='/itineraries' render={(props) => (
              <ItineraryPage auth={auth} {...props} />
            )} />
            <Route path='/planner/:itineraryId' component={PlannerPage} />
            <Route path='/map/:itineraryId' component={MapPlannerPage} />
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
