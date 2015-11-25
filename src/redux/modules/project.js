import update from 'react-addons-update'
import qs from 'qs'
import { json as request } from 'lgutil/common/ajax'
import createReducer from '../createReducer'
import { constructAsyncActionTypes, toKeyMirror } from '../createAction'
import { removeFromArray } from '../../utils'

// -- Constants
const PROJECT_API_URL = '/api/rest/project'

// -- ActionTypes
const LOAD_PROJECT_FOR_COMPANY = 'project/LOAD_PROJECT_FOR_COMPANY'
const loadProjectForCompanyAction = constructAsyncActionTypes(LOAD_PROJECT_FOR_COMPANY)

export const actionTypes = {
  ...toKeyMirror(loadProjectForCompanyAction)
}

const initState = {
  data: {},
  companyProjectsLoading: [], // some companyIds
  companyProjectsLoaded: [], // some companyIds
  companyProjectsLoadFailed: [] // need not reason for now
}
const hasSameKey = (a, b) => {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)

  if (aKeys.length !== bKeys.length) return false
  else {
    for (let i = 0; i < aKeys.length; i++) {
      if (bKeys.indexOf(aKeys[i]) < 0) return false
    }

    return true
  }
}
let requests = []
const cacheRequest = promise => requests.push(promise)

const actionMap = {
  [loadProjectForCompanyAction.pending] (state, { payload, meta: { companyId } }) {
    return update(state, {
      companyProjectsLoading: { $push: [ companyId ] },
      companyProjectsLoaded: { $apply: removeFromArray(companyId) },
      companyProjectsLoadFailed: { $apply: removeFromArray(companyId) }
    })
  },
  [loadProjectForCompanyAction.fulfilled] (state, { payload, meta: { companyId } }) {
    const data = payload.body.reduce((ret, project) => {
      ret[project._id] = { $set: project }
      return ret
    }, {})

    return update(state, {
      data,
      companyProjectsLoading: { $apply: removeFromArray(companyId) },
      companyProjectsLoaded: { $push: [ companyId ] },
      companyProjectsLoadFailed: { $apply: removeFromArray(companyId) }
    })
  },
  [loadProjectForCompanyAction.rejected] (state, { meta: { companyId } }) {
    return update(state, {
      companyProjectsLoading: { $apply: removeFromArray(companyId) },
      companyProjectsLoaded: { $apply: removeFromArray(companyId) },
      companyProjectsLoadFailed: { $push: [ companyId ] }
    })
  }
}

// CRUD
// const { initState, actionMap, actions } =
//   createReduxModule('project', [
//     { type: 'PROJECTS_FOR_COMPANY', async: true },
//     { type: 'PROJECT', async: true }
//   ])


// A redux module
//
function createReduxModule (name, deps, otherState) {
  // generate ActionTypes
  const LOAD = `@@${name}`
  const CREATE = ``
  const UPDATE = ``
  const REMOVE = ``


  // reducer how to update data

  // try to pass action type to action creators
}

// -- Reducer
export default createReducer(actionMap, initState)

// -- Action Creaters
export function loadProjectForCompany ({ _id, projects }) {
  const query = {
    conditions: {
      _id: {
        $in: [].concat(projects)
      }
    }
  }

  return {
    type: LOAD_PROJECT_FOR_COMPANY,
    meta: { companyId: _id },
    endPoint: PROJECT_API_URL,
    query,
    cacheKey: `LOAD_PROJECT_FOR_COMPANY_${_id}`,
    cacheTimeout: 10000 // 10s cache
  }
}

export function dispose () {
  requests.forEach(r => r.abort())
  requests = []
}
