import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'

import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

import { plannerReducer } from './reducers/plannerReducer'
import { bucketReducer } from './reducers/bucketReducer'
import { userReducer } from './reducers/userReducer'
import { plannerColumnReducer } from './reducers/plannerColumnReducer'
import { plannerTimelineReducer } from './reducers/plannerTimelineReducer'
import { plannerTimelineDayReducer } from './reducers/plannerTimelineDayReducer'
import { cloudStorageReducer } from './reducers/cloudStorageReducer'
import { spinnerReducer } from './reducers/spinnerReducer'
import { mapPlannerCurrentFocusReducer } from './reducers/mapPlannerCurrentFocusReducer'
import { mapPlannerDaysFilterReducer } from './reducers/mapPlannerDaysFilterReducer'
import { mapPlannerOpenCreateFormReducer } from './reducers/mapPlannerOpenCreateFormReducer'
import { mapPlannerSearchReducer } from './reducers/mapPlannerSearchReducer'

import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo'

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:3001/graphql'
})

networkInterface.use([{
  applyMiddleware (req, next) {
    if (!req.options.headers) {
      req.options.headers = {
        authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    next()
  }
}])

const client = new ApolloClient({
  networkInterface: networkInterface
})

const store = createStore(combineReducers({
  plannerActivities: plannerReducer,
  bucketList: bucketReducer,
  plannerColumns: plannerColumnReducer,
  plannerTimeline: plannerTimelineReducer,
  plannerTimelineDay: plannerTimelineDayReducer,
  token: userReducer,
  cloudStorageToken: cloudStorageReducer,
  showSpinner: spinnerReducer,
  currentlyFocusedEvent: mapPlannerCurrentFocusReducer,
  mapPlannerDaysFilterArr: mapPlannerDaysFilterReducer,
  openCreateFormParams: mapPlannerOpenCreateFormReducer,
  mapPlannerSearch: mapPlannerSearchReducer,
  apollo: client.reducer()
}),
{},
compose(applyMiddleware(client.middleware()))
)

ReactDOM.render(
  <ApolloProvider store={store} client={client}>
    <App />
  </ApolloProvider>
  , document.getElementById('root'))
registerServiceWorker()
