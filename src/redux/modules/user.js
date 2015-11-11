import update from 'react-addons-update'
import { json as request } from 'lgutil/common/ajax'
import createReducer from './createReducer'
import { constructAsyncActionTypes, toKeyMirror } from './createAction'

// -- Constants
const RESOURCE_API_URL = '/api/rest/resource'
const CHANGE_PASSWORD_URL = '/api/user/cpwd'

// -- ActionTypes
const UPDATE_PROFILE = 'user/UPDATE_PROFILE'
const updateProfileActions = constructAsyncActionTypes(UPDATE_PROFILE)
const CHANGE_PASSWORD = 'user/CHANGE_PASSWORD'
const changePasswordActions = constructAsyncActionTypes(CHANGE_PASSWORD)

export const actionTypes = {
  ...toKeyMirror(updateProfileActions),
  ...toKeyMirror(changePasswordActions)
}

const actionMap = {
  [updateProfileActions.fulfilled] (state, action) {
    const { key, value } = action.meta || {}
    if (key && value) {
      return update(state, {
        data: { [key]: { $set: value } }
      })
    }
  },
  [changePasswordActions.pending] (state, action) {
    return update(state, {
      changePasswordPending: { $set: true },
      lastChangePasswordError: { $set: null }
    })
  },
  [changePasswordActions.fulfilled] (state, action) {
    // const { error, payload } = action
    return update(state, {
      changePasswordPending: { $set: false },
      lastChangePasswordError: { $set: null }
    })
  },
  [changePasswordActions.rejected] (state, action) {
    return update(state, {
      changePasswordPending: { $set: false },
      lastChangePasswordError: { $set: action.payload }
    })
  }
}

// -- InitState
const initState =  {
  data: (window.__initData__ && window.__initData__.user),
  changePasswordPending: false,
  lastChangePasswordError: null,
  // updateProfilePending: false,
  lastUpdateProfileError: null,
  loadActivitiesPending: false,
  lastGetActivitiesError: null
}

// -- Reducer
export default createReducer(actionMap, initState)

// -- Action Creaters
export function updateProfile (key, value) {
  const id = initState.data._id // use _id from initState
  const url = `${RESOURCE_API_URL}/${id}`
  const body = {
    update: { [key]: value }
  }
  return {
    type: UPDATE_PROFILE,
    payload: {
      promise: request.put(url, body)
    },
    meta: { key, value }
  }
}

export function changePassword (oldPassword, newPassword) {
  const body = {
    _id: initState.data._id,
    oldpwd: oldPassword,
    newpwd: newPassword
  }

  return {
    type: CHANGE_PASSWORD,
    payload: {
      promise: request.post(CHANGE_PASSWORD_URL, body)
    }
  }
}

export function loadActivities () {
  // const { resourceId } = initState.data
  // const query = {
  //   conditions: {
  //     assignee: !isLeader(role) ? resourceId : void 0,
  //     startDate: {
  //       $lte: getToday().toString()
  //     },
  //     endDate: {
  //       $exists: false
  //     }
  //   }
  // }
}
