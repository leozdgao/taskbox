import update from 'react-addons-update'
import { json as request } from 'lgutil/common/ajax'
import createReducer from '../createReducer'
import { constructAsyncActionTypes, toKeyMirror } from '../createAction'

// -- Constants
const RESOURCE_LOAD_API_URL = '/api/rest/resource'

// -- ActionTypes
const LOAD_RESOURCE = 'resource/LOAD_RESOURCE'
const loadResourceAction = constructAsyncActionTypes(LOAD_RESOURCE)
// const UPDATE_RESOURCE = 'UPDATE_RESOURCE'

export const actionTypes = {
  ...toKeyMirror(loadResourceAction)
}

// -- InitState
const initState = {
  data: [],
  isLoading: false,
  error: null
}

const actionMap = {
  [loadResourceAction.pending] (state, action) {
    return update(state, {
      isLoading: { $set: true },
      error: { $set: null }
    })
  },
  [loadResourceAction.fulfilled] (state, action) {
    return update(state, {
      isLoading: { $set: false },
      data: { $set: action.payload.body }
    })
  },
  [loadResourceAction.rejected] (state, action) {
    return update(state, {
      isLoading: { $set: false },
      error: { $set: action.payload.body }
    })
  }
}

// -- Reducer
export default createReducer(actionMap, initState)

// -- Action Creaters
export function load () {
  return {
    type: LOAD_RESOURCE,
    payload: {
      promise: request.get(RESOURCE_LOAD_API_URL)
    }
  }
}
