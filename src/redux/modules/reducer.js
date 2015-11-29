import { combineReducers } from 'redux'
import task from './task'
import resource from './resource'
import user from './user'
import form from './form'

import requestReducer from './request/reducer'
import storageReducer from './storage/reducer'
import viewsReducer from './views/reducer'

const rootReducer = combineReducers({
  user, task, resource,
  form,
  request: requestReducer,
  storage: storageReducer,
  views: viewsReducer
})

export default rootReducer
