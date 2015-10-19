import { combineReducers } from 'redux'
import chats from './chat'
import task from './task'


const rootReducer = combineReducers({
  // just hold the state
  user: (state = {}, action) => {
    // set default avatar
    if (!state.avatar) state.avatar = '/assets/avatar.png'
    return state
  },
  task
})


export default rootReducer
