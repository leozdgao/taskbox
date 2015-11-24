import update from 'react-addons-update'
import qs from 'qs'
import { json as request } from 'lgutil/common/ajax'
import findIndex from 'lodash/array/findIndex'
import createReducer from '../createReducer'
import { constructAsyncActionTypes, toKeyMirror } from '../createAction'
import { hasSameKey, isInGroup, safePush, safeIndexOf, defaultValue } from '../../utils'

// -- Constants
const COMPANY_API_URL = '/api/rest/company'
export const companyGroup = [
  { from: '0', to: '9', key: '0$9' },
  { from: 'A', to: 'E', key: 'a$e' },
  { from: 'F', to: 'K', key: 'f$k' },
  { from: 'L', to: 'N', key: 'l$n' },
  { from: 'O', to: 'R', key: 'o$r' },
  { from: 'S', to: 'Z', key: 's$z' }
]
let requests = []
const cacheRequest = promise => requests.push(promise)
const arrayDefault = defaultValue([])
const groupCompany = (ret = {}, company) => {
  const groupIndex = findIndex(companyGroup, ({ from, to }) => {
    return isInGroup(from, to)(company.name)
  })
  const { key } = companyGroup[groupIndex]

  ret[key] = arrayDefault(ret[key])

  if (safeIndexOf(ret[key], company._id) < 0) {
    ret[key] = safePush(ret[key], company._id)
  }

  return ret
}

// -- ActionTypes
const LOAD_ALL_COMPANY = 'company/LOAD_ALL_COMPANY'
const LOAD_COMPANY_GROUP = 'company/LOAD_COMPANY_GROUP'
const loadCompanyGroupActions = constructAsyncActionTypes(LOAD_COMPANY_GROUP)

export const actionTypes = {
  ...toKeyMirror(loadCompanyGroupActions)
}

const actionMap = {
  [LOAD_ALL_COMPANY] (state, action) {
    if (action.error) {
      return update(state, {
        lastRError: { $set: true },
        loading: { $set: false }
      })
    }
    else {
      let { ...group } = state.group
      const data = action.payload.body.reduce((ret, company) => {
        group = groupCompany(group, company)
        ret[company._id] = company
        return ret
      }, {})

      if (hasSameKey(data, state.data)) return state
      else {
        return update(state, {
          data: { $set: data },
          group: { $set: group },
          lastRError: { $set: false },
          loading: { $set: false }
        })
      }
    }
  },
  [loadCompanyGroupActions.pending] (state, action) {
    const { key } =  action.meta
    return update(state, {
      pendingGroup: { $push: [ key ] }
    })
  },
  [loadCompanyGroupActions.fulfilled] (state, action) {
    const { key } =  action.meta
    const { body: companies } = action.payload
    const i = state.pendingGroup.indexOf(key)
    const { ...data } = state.data
    let { ...group } = state.group

    companies.forEach((company) => {
      group = groupCompany(group, company)
      data[company._id] = company
    })

    return update(state, {
      data: { $set: data },
      group: { $set: group },
      pendingGroup: { $splice: [ [ i, 1 ] ] }
    })
  },
  [loadCompanyGroupActions.rejected] (state, action) {
    // only remove the pending key
    const { key } =  action.meta
    const i = state.pendingGroup.indexOf(key)
    return update(state, {
      pendingGroup: { $splice: [ i, 1 ] }
    })
  }
}

// -- InitState
const initGroup = companyGroup.reduce((ret, { key }) => {
  ret[key] = []
  return ret
}, {})
const initState = {
  data: {},
  group: initGroup,
  loading: true,
  pendingGroup: [],
  lastCError: false,
  lastUError: false,
  lastRError: false,
  lasdDError: false
}

// -- Reducer
export default createReducer(actionMap, initState)

// -- ActionCreators
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

export function loadOne (id) {
  const url = `${COMPANY_API_URL}/${id}`
  return {
    type: LOAD_COMPANY,
    payload: {
      promise: request.get(url)
    }
  }
}

export function loadCompanyGroup (group) {
  const { from, to, key } = group
  const query = {
    conditions: {
      name: {
        $regex: `^[${from}-${to}]`,
        $options: 'i'
      }
    }
  }
  const url = `${COMPANY_API_URL}?${qs.stringify(query)}`
  return {
    type: LOAD_COMPANY_GROUP,
    cacheKey: `${LOAD_COMPANY_GROUP}$${from}$${to}`,
    payload: {
      promise: request.get(url)
    },
    meta: group
  }
}

export function dispose () {
  requests.forEach(r => r.abort())
  requests = []
}
