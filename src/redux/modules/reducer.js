import { combineReducers } from 'redux'
import chats from './chat'
import task from './task'


const rootReducer = combineReducers({
  // just hold the state
  user: (state = {}, action) => {
    // set default avatar
    if (!state.avatar) state.avatar = 'http://semantic-ui.com/images/avatar2/small/matthew.png'
    return state
  },
  task
})


export default rootReducer
