import update from 'react-addons-update'
import qs from 'qs'
import { json as request } from 'lgutil/common/ajax'
import createReducer from '../createReducer'
import { constructAsyncActionTypes, toKeyMirror } from '../createAction'

// -- Constants
const POST_API_URL = '/api/rest/article'
const PAGE_LIMIT = 15

// -- ActionTypes
const LOAD_POST = 'post/LOAD_POST'
const PUBLISH_POST = 'post/PUBLISH_POST'
const loadPostAction = constructAsyncActionTypes(LOAD_POST)
const publishPostAction = constructAsyncActionTypes(PUBLISH_POST)
// const UPDATE_RESOURCE = 'UPDATE_RESOURCE'

export const actionTypes = {
  ...toKeyMirror(loadPostAction),
  ...toKeyMirror(publishPostAction)
}

// -- InitState
const initState = {
  data: {},
  page: {},
  isLoading: false,
  lastLoadingError: null,
  isPublishing: false,
  lastPublishedPostId: null,
  lastPublishingError: null
}

const actionMap = {
  [loadPostAction.pending] (state, action) {
    return update(state, {
      isLoading: { $set: true },
      lastLoadingError: { $set: null }
    })
  },
  [loadPostAction.fulfilled] (state, { payload, meta }) {
    const updateBody = {
      isLoading: { $set: false }
    }
    let { body } = payload
    if (!Array.isArray(body)) body = [ body ]
    const dataUpdate = body.reduce((ret, post) => {
      ret[post._id] = { $set: post }
      return ret
    }, {})
    updateBody.data = dataUpdate
    // cache page loading
    let pageUpdate
    if (meta && meta.page) {
      pageUpdate = { [meta.page]: { $set: body.map(post => post._id) } }
      updateBody.page = pageUpdate
    }

    return update(state, updateBody)
  },
  [loadPostAction.rejected] (state, action) {
    return update(state, {
      isLoading: { $set: false },
      lastLoadingError: { $set: action.payload.body }
    })
  },
  [publishPostAction.pending] (state, action) {
    return update(state, {
      isPublishing: { $set: true },
      lastPublishingError: { $set: null }
    })
  },
  [publishPostAction.fulfilled] (state, { payload }) {
    const newPostId = payload.body._id
    return update(state, {
      isPublishing: { $set: false },
      lastPublishingError: { $set: null },
      lastPublishedPostId: { $set: newPostId },
      data: { [newPostId]: { $set: payload.body } }
    })
  },
  [publishPostAction.rejected] (state, { payload }) {
    return update(state, {
      isPublishing: { $set: false },
      lastPublishingError: { $set: payload }
    })
  }
}

// -- Reducer
export default createReducer(actionMap, initState)

// -- Action Creaters
export function publish (body) {
  return {
    type: PUBLISH_POST,
    payload: {
      promise: request.post(POST_API_URL, body)
    }
  }
}

export function loadOne (id) {
  return {
    type: LOAD_POST,
    payload: {
      promise: request.get(`${POST_API_URL}/${id}`)
    }
  }
}

export function loadByPage (page) {
  //
  // TODO: add query
  //
  const query  = {
    options: {
      limit: PAGE_LIMIT,
      skip: PAGE_LIMIT * (page - 1),
      sort: {
        priority: -1,
        date: -1
      }
    }
  }

  return {
    type: LOAD_POST,
    payload: {
      promise: request.get(`${POST_API_URL}?${qs.stringify(query)}`)
    },
    meta: { page }
  }
}

export function load () {
  return {
    type: LOAD_POST,
    payload: {
      promise: request.get(POST_API_URL)
    }
  }
}
