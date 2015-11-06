import { combineReducers } from 'redux'
import chats from './chat'
import task from './task'
import resource from './resource'
import company from './company'
import project from './project'
import user from './user'

const rootReducer = combineReducers({
  // just hold the state
  user, task, resource, company, project
})


export default rootReducer
