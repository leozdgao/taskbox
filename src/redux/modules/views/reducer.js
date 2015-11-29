import { combineReducers } from 'redux'
import newTaskModalReducer from './newTaskModal'

export default combineReducers({
  newTaskModal: newTaskModalReducer
})
