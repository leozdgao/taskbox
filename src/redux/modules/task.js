import update from 'react-addons-update'
import { json as request } from 'lgutil/common/ajax'

const TASK_LOAD_API_URL = '/api/task'

const LOAD_TASK_PENDING = 'LOAD_TASK_PENDING'
const LOAD_TASK_FETCHED = 'LOAD_TASK_FETCHED'
const LOAD_TASK_FAILED = 'LOAD_TASK_FAILED'
const NEW_TASK = 'NEW_TASK'
const UPDATE_TASK = 'UPDATE_TASK'

const initState = {
  data: [],
  loading: true,
  error: null
}

export default function (state = initState, action) {
  switch (action.type) {
  case LOAD_TASK_PENDING:
    return update(state, {
      loading: { $set: true },
      error: { $set: null }
    })
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
  return {
    types: [ LOAD_TASK_PENDING, LOAD_TASK_FETCHED, LOAD_TASK_FAILED ],
    payload: {
      promise: request.get(TASK_LOAD_API_URL)
    }
  }
}
