import update from 'react-addons-update'
import { json as request } from 'lgutil/common/ajax'
import createReducer from './createReducer'


// -- Constants
const RESOURCE_API_URL = '/api/rest/resource'
const CHANGE_PASSWORD_URL = '/api/user/cpwd'

// -- ActionTypes
const UPDATE_PROFILE = 'user/UPDATE_PROFILE'
const CHANGE_PASSWORD = 'user/CHANGE_PASSWORD'

export const actionTypes = { UPDATE_PROFILE, CHANGE_PASSWORD }

const actionMap = {
  [UPDATE_PROFILE]: (state, action) => {
    const { key, value } = action.meta || {}
    if (key && value) {
      return update(state, {
        data: { [key]: { $set: value } }
      })
    }
  },
  [CHANGE_PASSWORD]: (state, action) => {
    const { error, payload } = action
    return update(state, {
      lastChangePasswordError: { $set: error }
    })
  }
}

// -- InitState
const initState =  {
  data: (window.__initData__ && window.__initData__.user),
  lastChangePasswordError: false,
  lastUpdateProfileError: false
}

// -- Reducer
export default createReducer(actionMap, initState)

// -- Action Creaters
export function updateProfile (key, value) {
  const id = initState.data.resourceId // use _id from initState
  const url = `${RESOURCE_API_URL}/${id}`
  const body = {
    update: { [key]: value }
  }
  return {
    type: UPDATE_PROFILE,
    payload: request.put(url, body),
    meta: { key, value }
  }
}

export function changePassword (oldPassword, newPassword) {
  return {
    type: CHANGE_PASSWORD,
    payload: request.post(CHANGE_PASSWORD_URL, {
      _id: initState.data._id,
      oldpwd: oldPassword,
      newpwd: newPassword
    })
  }
}
