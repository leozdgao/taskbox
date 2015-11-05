import update from 'react-addons-update'
import qs from 'qs'
import { json as request } from 'lgutil/common/ajax'

const PROJECT_API_URL = '/api/rest/project'

const LOAD_PROJECT = 'LOAD_PROJECT'

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
  case LOAD_PROJECT: {
    if (action.error) {
      return update(state, {
        lastRError: { $set: true },
        loading: { $set: false }
      })
    }
    else {
      const data = action.payload.body.reduce((ret, project) => {
        ret[project._id] = { $set: project }
        return ret
      }, {})
      // if (hasSameKey(data, state.data)) return state
      // else {
      return update(state, {
        data,
        lastRError: { $set: false },
        loading: { $set: false }
      })
      // }
    }
  }
  default: return state
  }
}

export function loadProjectByIds (ids, ...then) {
  const query = {
    conditions: {
      _id: {
        $in: [].concat(ids)
      }
    }
  }
  const url = `${PROJECT_API_URL}?${qs.stringify(query)}`

  return {
    type: LOAD_PROJECT,
    cacheable: true,
    payload: {
      promiseCreator: request.get,
      args: [ url ]
    },
    timeout: 5000, // cache timeout, company do not need cache
    onPromised: cacheRequest,
    then
  }
}

export function dispose () {
  requests.forEach(r => r.abort())
  requests = []
}
