import update from 'react-addons-update'
import { json as request } from 'lgutil/common/ajax'

const TASK_LOAD_API_URL = '/api/task'

// const LOAD_TASK_PENDING = 'LOAD_TASK_PENDING'
// const LOAD_TASK_FETCHED = 'LOAD_TASK_FETCHED'
// const LOAD_TASK_FAILED = 'LOAD_TASK_FAILED'

const LOAD_TASK = 'LOAD_TASK'
const TASK_CHECK_ENTRY = 'TASK_CHECK_ENTRY'

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
  case LOAD_TASK: {
    const field = action.error ? 'error' : 'data'
    return update(state, {
      [field]: { $set: action.payload.body },
      loading: { $set: false }
    })
  }
  case TASK_CHECK_ENTRY: {
    const { taskIndex, listName, itemIndex } = action.payload

    return update(state, {
      data: { [taskIndex]: { checklist: { [listName]: { [itemIndex]: { checked: { $apply: (val) => !val } } } } } }
    })
  }
  default:
    return state
  }
}

// action for load task
export function load () {
  return {
    type: LOAD_TASK,
    cacheable: true,
    payload: {
      promiseCreator: request.get,
      args: [ TASK_LOAD_API_URL ]
    },
    timeout: 5000, // cache timeout
    onPromised: cacheRequest
  }
}

export function checkEntry (taskIndex, listName, itemIndex) {
  return {
    type: TASK_CHECK_ENTRY,
    payload: {
      taskIndex, listName, itemIndex
    }
  }
}

export function dispose () {
  requests.forEach(r => r.abort())
  requests = []
}
