import { combineReducers } from 'redux'
import qs from 'qs'
import { createActionReducer } from '../../dataFetch'
import { constructAsyncActionTypes } from '../../createAction'

// -- Constants
const PROJECT_API_URL = '/api/rest/project'

const LOAD_PROJECTS_UNDER_COMPANY = '@@project/LOAD_PROJECTS_UNDER_COMPANY'
const loadProjectsUnderCompanyAsyncActions = constructAsyncActionTypes(LOAD_PROJECTS_UNDER_COMPANY)
const loadProjectsUnderCompanyReducer = createActionReducer(loadProjectsUnderCompanyAsyncActions)

//
// Action Types
export const actionTypes = {
  loadProjectUnderCompany: loadProjectsUnderCompanyAsyncActions
}

//
// Reducer
export default combineReducers({
  loadProjectUnderCompany: loadProjectsUnderCompanyReducer
})

//
// Action Creators
export const actionCreators = {
  loadProjectUnderCompany
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
