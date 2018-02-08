import { combineReducers } from 'redux'
import { plannerReducer } from './plannerReducer'
import { bucketReducer } from './bucketReducer'
import { userReducer } from './userReducer'
import { cloudStorageReducer } from './cloudStorageReducer'
import { spinnerReducer } from './spinnerReducer'

export const allReducers = combineReducers({
  token: userReducer,
  plannerActivities: plannerReducer,
  bucketList: bucketReducer,
  cloudStorageToken: cloudStorageReducer,
  showSpinner: spinnerReducer
})
