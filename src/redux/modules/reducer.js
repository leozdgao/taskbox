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

const rootReducer = combineReducers({
  router: routerStateReducer,
  user, task, resource, company, project,
  form, post,
  chat
})

export default rootReducer
