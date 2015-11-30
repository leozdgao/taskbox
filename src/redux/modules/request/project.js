import { combineReducers } from 'redux'
import qs from 'qs'
import { createActionReducer } from '../../dataFetch'
import { constructAsyncActionTypes } from '../../createAction'

// -- Constants
const PROJECT_API_URL = '/api/rest/project'

const LOAD_PROJECTS_UNDER_COMPANY = '@@project/LOAD_PROJECTS_UNDER_COMPANY'
const loadProjectsUnderCompanyAsyncActions = constructAsyncActionTypes(LOAD_PROJECTS_UNDER_COMPANY)
const loadProjectsUnderCompanyReducer = createActionReducer(loadProjectsUnderCompanyAsyncActions)

const LOAD_ONE_PROJECT = '@@project/LOAD_ONE_PROJECT'
const loadProjectAsyncActions = constructAsyncActionTypes(LOAD_ONE_PROJECT)
const loadProjectReducer = createActionReducer(loadProjectAsyncActions)

//
// Action Types
export const actionTypes = {
  loadProjectUnderCompany: loadProjectsUnderCompanyAsyncActions,
  loadOne: loadProjectAsyncActions
}

//
// Reducer
export default combineReducers({
  loadProjectUnderCompany: loadProjectsUnderCompanyReducer,
  loadOne: loadProjectReducer
})

//
// Action Creators
export const actionCreators = {
  loadProjectUnderCompany, loadOne
}

function loadProjectUnderCompany ({ _id, projects }) {
  const query = {
    conditions: {
      _id: {
        $in: [].concat(projects)
      }
    }
  }

  return {
    type: LOAD_PROJECTS_UNDER_COMPANY,
    meta: { companyId: _id, id: _id },
    endPoint: PROJECT_API_URL,
    query,
    cacheKey: `LOAD_PROJECT_FOR_COMPANY_${_id}`,
    cacheTimeout: 10000 // 10s cache
  }
}

function loadOne (pid) {
  const url = `${PROJECT_API_URL}/${pid}`
  return {
    type: LOAD_ONE_PROJECT,
    meta: { id: pid },
    endPoint: url,
    cacheKey: `LOAD_ONE_PROJECT_${pid}`,
    cacheTimeout: 10000 // 10s cache
  }
}
