import update from 'react-addons-update'
import { json as request } from 'lgutil/common/ajax'

const TASK_LOAD_API_URL = '/api/task'

const LOAD_TASK_PENDING = 'LOAD_TASK_PENDING'
const LOAD_TASK_FETCHED = 'LOAD_TASK_FETCHED'
const LOAD_TASK_FAILED = 'LOAD_TASK_FAILED'
const NEW_TASK = 'NEW_TASK'
const UPDATE_TASK = 'UPDATE_TASK'

// - abortable
// - cacheable

const initState = {
  data: [],
  loading: true,
  error: null
}

let requests = []

// function createDispoableReducer (init, actionHandler) {
//   let requests = []
//
//   return (state = init, action) => {
//     actionHandler(action)
//   }
// }
//

const middleware = ({ dispatch, getState }) => next => action => {

}

const cachableRequest = (promiseCreator, timeout, promised) => {
  // cache last time result, omit it if promise rejected
  let lastResolve

  return (...args) => {
    if (lastResolve) return Promise.resolve(lastResolve)
    else {
      const promise = promiseCreator.apply(promiseCreator, args)
      promised.call(promised, promise)
      return promise.then((body) => {
        lastResolve = body

        // clear cache
        setTimeout(() => {
          lastResolve = null
        }, timeout)

        return body
      })
    }
  }
}
const cacheRequest = promise => requests.push(promise)
const loadTask =  cachableRequest(request.get, 5000, cacheRequest)

export default function (state = initState, action) {
  switch (action.type) {
  case LOAD_TASK_PENDING: {
    return update(state, {
      loading: { $set: true },
      error: { $set: null }
    })
  }
  case LOAD_TASK_FETCHED: {
    const { payload = {} } = action
    return update(state, {
      loading: { $set: false },
      data: { $set: payload.body || [] },
      error: { $set: null }
    })
  }
  case LOAD_TASK_FAILED:
    return update(state, {
      loading: { $set: false },
      error: { $set: action.payload }
    })
  default:
    return state
  }
}

// action for load task
export function load () {
  // const pending = request.get(TASK_LOAD_API_URL)
  const pending  = loadTask(TASK_LOAD_API_URL)
  return {
    types: [ LOAD_TASK_PENDING, LOAD_TASK_FETCHED, LOAD_TASK_FAILED ],
    payload: {
      promise: pending,
      data: pending
    }
  }
}

export function dispose () {
  requests.forEach(r => r.abort())
  requests = []
}
