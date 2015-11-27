import { combineReducers } from 'redux'
import { createActionReducer } from '../dataFetch'
import { constructAsyncActionTypes } from '../createAction'

const POST_API_URL = '/api/rest/article'
const LOAD_POST = '@@post/POST_LOAD'
const loadAsyncActions = constructAsyncActionTypes(LOAD_POST)
const postLoadReducer = createActionReducer(loadAsyncActions)

// const SEND_MESSAGE = 'SEND_MESSAGE'
// const RECIEVE_MESSAGE = 'RECIEVE_MESSAGE'

export default combineReducers({
  load: postLoadReducer
})

export function loadOne (id) {
  return {
    type: LOAD_POST,
    endPoint: `${POST_API_URL}/${id}`,
    cacheKey: `LOAD_POST_${id}`,
    cacheTimeout: 5000,
    meta: { id } // for dataDependence track the request state
  }
}

// export default function (state = [], action) {
//   switch (action.type) {
//   case SEND_MESSAGE: {
//     return [
//       ...state,
//       { from: '$$me', msg: action.payload }
//     ]
//   }
//   case RECIEVE_MESSAGE: {
//     return [
//       ...state,
//       { from: 'other', msg: action.payload }
//     ]
//   }
//   default: return state
//   }
// }

// export function receiveMessage (msg) {
//   return {
//     type: RECIEVE_MESSAGE,
//     payload: msg
//   }
// }
//
// export function sendMessage (msg) {
//   return {
//     type: SEND_MESSAGE,
//     payload: msg
//   }
// }
