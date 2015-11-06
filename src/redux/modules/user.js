import update from 'react-addons-update'
import { json as request } from 'lgutil/common/ajax'

const RESOURCE_API_URL = '/api/rest/resource'

const UPDATE_PROFILE = 'UPDATE_PROFILE'

// initState is from _initData_
export default (state = {}, action) => {
  // set default avatar
  return state
}

export function updateProfile () {
  return {
    type: UPDATE_PROFILE
  }
}

export function changePassword (oldPassword, newPassword) {

}
