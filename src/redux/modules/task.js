import update from 'react-addons-update'
import { json as request } from 'lgutil/common/ajax'

const TASK_LOAD_API_URL = '/api/task'

// const LOAD_TASK_PENDING = 'LOAD_TASK_PENDING'
// const LOAD_TASK_FETCHED = 'LOAD_TASK_FETCHED'
// const LOAD_TASK_FAILED = 'LOAD_TASK_FAILED'

const LOAD_TASK = 'LOAD_TASK'

const NEW_TASK = 'NEW_TASK'
const UPDATE_TASK = 'UPDATE_TASK'

// - abortable
// - cacheable

const initState = {
  data: [],
  // loading: true,
  error: null
}

let requests = []
const cacheRequest = promise => requests.push(promise)

export default function (state = initState, action) {
  switch (action.type) {
  // case LOAD_TASK_PENDING: {
  //   return update(state, {
  //     loading: { $set: true },
  //     error: { $set: null }
  //   })
  // }
  // case LOAD_TASK_FETCHED: {
  //   const { payload = {} } = action
  //   return update(state, {
  //     loading: { $set: false },
  //     data: { $set: payload.body || [] },
  //     error: { $set: null }
  //   })
  // }
  // case LOAD_TASK_FAILED:
  //   return update(state, {
  //     loading: { $set: false },
  //     error: { $set: action.payload }
  //   })
  case LOAD_TASK: {
    const field = action.error ? 'error' : 'data'
    return update(state, {
      [field]: { $set: action.payload.body },
      loading: { $set: false }
    })
  }
  default:
    return state
  }
}

// action for load task
export function load () {
  // const pending = smartRequest(TASK_LOAD_API_URL)
  return {
    // types: [ LOAD_TASK_PENDING, LOAD_TASK_FETCHED, LOAD_TASK_FAILED ],
    type: LOAD_TASK,
    cacheable: true,
    payload: {
      promiseCreator: request.get,
      args: [ TASK_LOAD_API_URL ]
    },
    timeout: 5000,
    onPromised: cacheRequest
  }
}

export function dispose () {
  requests.forEach(r => r.abort())
  requests = []
}
