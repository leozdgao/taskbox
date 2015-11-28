import { combineReducers } from 'redux'
import postReducer from './post'
import companyReducer from './company'
import projectReducer from './project'

export default combineReducers({
  post: postReducer,
  company: companyReducer,
  project: projectReducer
})
