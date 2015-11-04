import update from 'react-addons-update'
import { json as request } from 'lgutil/common/ajax'

const COMPANY_API_URL = '/api/rest/company'

const LOAD_COMPANY = 'LOAD_COMPANY'

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

export default function (state = initState, action) {
  switch (action.type) {
  case LOAD_COMPANY: {
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
  }
  default: return state
  }
}

export function loadCompany () {
  const url = COMPANY_API_URL
  return {
    type: LOAD_COMPANY,
    cacheable: true,
    payload: {
      promiseCreator: request.get,
      args: [ url ]
    },
    timeout: 5000, // cache timeout, company do not need cache
    onPromised: cacheRequest
  }
}

export function dispose () {
  requests.forEach(r => r.abort())
  requests = []
}
