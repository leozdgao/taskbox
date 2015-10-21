import update from 'react-addons-update'
import { json as request } from 'lgutil/common/ajax'

const RESOURCE_LOAD_API_URL = '/api/task'

const LOAD_RESOURCE = 'LOAD_RESOURCE'

const LOAD_RESOURCE_PENDING = 'LOAD_RESOURCE_PENDING'
const LOAD_RESOURCE_FETCHED = 'LOAD_RESOURCE_FETCHED'
const LOAD_RESOURCE_FAILED = 'LOAD_RESOURCE_FAILED'

const initState = {
  data: [],
  loading: true,
  error: null
}

export default (state = initState, action) => {
  switch (action.type) {
  case LOAD_RESOURCE_PENDING:
    return update({
      loading: { $set: true },
      error: { $set: null }
    })
  case LOAD_RESOURCE_FETCHED:
    const { payload = {} } = action
    return update({
      loading: { $set: false },
      data: { $set: payload.body || [] },
      error: { $set: null }
    })
  case LOAD_RESOURCE_FAILED:
    return update({
      loading: { $set: false },
      error: { $set: action.payload }
    })
  case LOAD_RESOURCE:
    if (action.error) {
      return {
        data: [],
        error: action.payload
      }
    }
    else {
      return {
        data: action.payload,
        error: null
      }
    }
  default:
    return state
  }
}

// function actionCreator (opts) {
//   const { isAsync, ...others } = opts
//   if (isAsync) {
//     return function () {
//       return {
//
//       }
//     }
//   }
// }

// action for load task
export async function load () {

  const action = {
    type: LOAD_RESOURCE
  }

  try {
    const body = await request.get(RESOURCE_LOAD_API_URL)
    action.payload = body
  } catch (e) {
    action.payload = e
    action.error = true
  }

  return action

  // return {
  //   types: [ LOAD_RESOURCE_PENDING, LOAD_RESOURCE_FETCHED, LOAD_RESOURCE_FAILED ],
  //   cacheable: true,
  //   payload: {
  //     promiseCreator: request.get,
  //     args: [ RESOURCE_LOAD_API_URL ]
  //   },
  //   timeout: 5000,
  //   onPromised: cacheRequest
  // }
}
