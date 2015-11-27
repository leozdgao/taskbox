import { combineReducers } from 'redux'
import { routerStateReducer } from 'redux-router'
import chat from './chat'
import task from './task'
import post from './post'
import resource from './resource'
import company from './company'
import project from './project'
import user from './user'
import form from './form'

import requestReducer from './request/reducer'
import storageReducer from './storage/reducer'

const rootReducer = combineReducers({
  router: routerStateReducer,
  user, task, resource, company, project,
  form, post,
  chat,
  request: requestReducer,
  storage: storageReducer
})

export default rootReducer
