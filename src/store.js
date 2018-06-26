import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

// import { plannerReducer } from './reducers/plannerReducer'
import { userReducer } from './reducers/userReducer'
import { plannerColumnReducer } from './reducers/plannerColumnReducer'
import { plannerTimelineReducer } from './reducers/plannerTimelineReducer'
import { plannerTimelineDayReducer } from './reducers/plannerTimelineDayReducer'
import { spinnerReducer } from './reducers/spinnerReducer'
import { readReducer } from './reducers/readReducer'
import {mediaConsoleReducer} from './reducers/mediaConsoleReducer'
import { blogEditorActivePageReducer } from './reducers/blogEditorActivePageReducer'
import { userDashboardReducer } from './reducers/userDashboardReducer'
import { confirmWindowReducer } from './reducers/confirmWindowReducer'
import { googleCloudTokenReducer } from './reducers/googleCloudTokenReducer'
import { editorPostsListDragDropReducer } from './reducers/editorPostsListDragDropReducer'
import { navBarReducer } from './reducers/navBarReducer'

// Reducers for v2
import { columnsReducer } from './reducers/planner/columnsReducer'
import { eventsReducer } from './reducers/planner/eventsReducer'
import { itineraryReducer } from './reducers/planner/itineraryReducer'
import { activeEventReducer } from './reducers/planner/activeEventReducer'
import { activeFieldReducer } from './reducers/planner/activeFieldReducer'
import { plannerViewReducer } from './reducers/planner/plannerViewReducer'
import { mapboxReducer } from './reducers/planner/mapboxReducer'
import { timeCellFocusReducer } from './reducers/planner/timeCellFocusReducer'
import { sortReducer } from './reducers/planner/sortReducer'
import { bucketListReducer } from './reducers/planner/bucketListReducer'

import { ApolloClient, createNetworkInterface } from 'react-apollo'

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
  // plannerActivities: plannerReducer,
  plannerColumns: plannerColumnReducer,
  plannerTimeline: plannerTimelineReducer,
  plannerTimelineDay: plannerTimelineDayReducer,
  userProfile: userReducer,
  showSpinner: spinnerReducer,
  blogPosts: readReducer,
  mediaConsole: mediaConsoleReducer,
  blogEditorActivePage: blogEditorActivePageReducer,
  userDashboard: userDashboardReducer,
  googleCloudToken: googleCloudTokenReducer,
  confirmWindow: confirmWindowReducer,
  editorPostsListDragDrop: editorPostsListDragDropReducer,
  navBar: navBarReducer,
  columns: columnsReducer,
  events: eventsReducer,
  itineraryDetails: itineraryReducer,
  activeEventId: activeEventReducer,
  activeField: activeFieldReducer,
  plannerView: plannerViewReducer,
  mapbox: mapboxReducer,
  timeCellFocus: timeCellFocusReducer,
  sortOptions: sortReducer,
  bucketList: bucketListReducer,
  apollo: client.reducer()
}),
{},
compose(applyMiddleware(client.middleware()))
)

// redux store applied as a middleware for apollo client 1.0
export { store, client }
