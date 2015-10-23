import update from 'react-addons-update'
import { json as request } from 'lgutil/common/ajax'

const RESOURCE_LOAD_API_URL = '/api/rest/resource'

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
  case LOAD_RESOURCE: {
    const field = action.error ? 'error' : 'data'
    return update(state, {
      [field]: { $set: JSON.parse(action.payload.body) },
      loading: { $set: false }
    })
  }
  default:
    return state
  }
}

// action for load task
export function load () {
  return {
    type: LOAD_RESOURCE,
    payload: request.get(RESOURCE_LOAD_API_URL)
  }
}
