import { combineReducers } from 'redux'

import chats from './chat'
import task from './task'
import post from './post'
import resource from './resource'
import company from './company'
import project from './project'
import user from './user'
import form from './form'

const rootReducer = combineReducers({
  // just hold the state
  user, task, resource, company, project,
  form, post
})

export default rootReducer
