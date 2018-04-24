import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

import { plannerReducer } from './reducers/plannerReducer'
import { bucketReducer } from './reducers/bucketReducer'
import { userReducer } from './reducers/userReducer'
import { plannerColumnReducer } from './reducers/plannerColumnReducer'
import { plannerTimelineReducer } from './reducers/plannerTimelineReducer'
import { plannerTimelineDayReducer } from './reducers/plannerTimelineDayReducer'
import { spinnerReducer } from './reducers/spinnerReducer'
import { mapPlannerCurrentFocusReducer } from './reducers/mapPlannerCurrentFocusReducer'
import { mapPlannerDaysFilterReducer } from './reducers/mapPlannerDaysFilterReducer'
import { readReducer } from './reducers/readReducer'
import { mapPlannerOpenCreateFormReducer } from './reducers/mapPlannerOpenCreateFormReducer'
import { mapPlannerOpenEditFormReducer } from './reducers/mapPlannerOpenEditFormReducer'
import { mapPlannerSearchReducer } from './reducers/mapPlannerSearchReducer'
import {mediaConsoleReducer} from './reducers/mediaConsoleReducer'
import { blogEditorActivePageReducer } from './reducers/blogEditorActivePageReducer'
import { userDashboardReducer } from './reducers/userDashboardReducer'
import { confirmWindowReducer } from './reducers/confirmWindowReducer'
import { googleCloudTokenReducer } from './reducers/googleCloudTokenReducer'

import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo'

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:3001/graphql'
})

networkInterface.use([{
  applyMiddleware (req, next) {
    if (!req.options.headers) {
      req.options.headers = {
        authorization: `Bearer ${window.localStorage.getItem('access_token')}`
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
  userProfile: userReducer,
  showSpinner: spinnerReducer,
  currentlyFocusedEvent: mapPlannerCurrentFocusReducer,
  mapPlannerDaysFilterArr: mapPlannerDaysFilterReducer,
  blogPosts: readReducer,
  openCreateFormParams: mapPlannerOpenCreateFormReducer,
  openEditFormParams: mapPlannerOpenEditFormReducer,
  mapPlannerSearch: mapPlannerSearchReducer,
  mediaConsole: mediaConsoleReducer,
  blogEditorActivePage: blogEditorActivePageReducer,
  userDashboard: userDashboardReducer,
  googleCloudToken: googleCloudTokenReducer,
  confirmWindow: confirmWindowReducer,
  apollo: client.reducer()
}),
{},
compose(applyMiddleware(client.middleware()))
)

export { store, client }
