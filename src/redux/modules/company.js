import update from 'react-addons-update'
import { json as request } from 'lgutil/common/ajax'
import createReducer from './createReducer'

const COMPANY_API_URL = '/api/rest/company'

const LOAD_ALL_COMPANY = 'company/LOAD_ALL_COMPANY'
const LOAD_COMPANY_GROUP = 'company/LOAD_COMPANY_GROUP'

const initState = {
  data: {},
  loading: true,
  lastCError: false,
  lastUError: false,
  lastRError: false,
  lasdDError: false
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
  [LOAD_ALL_COMPANY] (state, action) {
    if (action.error) {
      return update(state, {
        lastRError: { $set: true },
        loading: { $set: false }
      })
    }
    else {
      const data = action.payload.body.reduce((ret, company) => {
        ret[company._id] = company
        return ret
      }, {})
      if (hasSameKey(data, state.data)) return state
      else {
        return update(state, {
          data: { $set: data },
          lastRError: { $set: false },
          loading: { $set: false }
        })
      }
    }
  },
  [LOAD_COMPANY_GROUP] (state, action) {

  }
}

export default createReducer(actionMap, initState)

export function loadCompany () {
  const url = COMPANY_API_URL
  return {
    type: LOAD_ALL_COMPANY,
    cacheable: true,
    payload: {
      promiseCreator: request.get,
      args: [ url ]
    },
    timeout: 5000, // cache timeout, company do not need cache
    onPromised: cacheRequest
  }
}

export function loadCompanyGroup (from, to) {
  const query = {
    conditions: {

    }
  }
  return {
    type: LOAD_COMPANY_GROUP,
    cacheKey: `${LOAD_COMPANY_GROUP}$${from}$${to}`,
    payload: {
      promise: request.get(url)
    }
  }
}

export function dispose () {
  requests.forEach(r => r.abort())
  requests = []
}
