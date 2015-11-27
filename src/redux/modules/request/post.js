import { combineReducers } from 'redux'
import { createActionReducer } from '../../dataFetch'
import { constructAsyncActionTypes } from '../../createAction'

// -- Constants
const POST_API_URL = '/api/rest/article'
export const PAGE_LIMIT = 15

const LOAD_POST = '@@post/POST_LOAD'
const loadAsyncActions = constructAsyncActionTypes(LOAD_POST)
const postLoadReducer = createActionReducer(loadAsyncActions)

const LOAD_POST_PAGE = '@@post/LOAD_POST_PAGE'
const loadPageAsyncActions = constructAsyncActionTypes(LOAD_POST_PAGE)
const loadPageReducer = createActionReducer(loadPageAsyncActions)

const PUBLISH_POST = '@@post/PUBLISH_POST'
const publishAsyncActions = constructAsyncActionTypes(PUBLISH_POST)
const postPublishReducer = createActionReducer(publishAsyncActions)

const COUNT_POST = '@@post/COUNT_POST'
const countPostAsyncActions = constructAsyncActionTypes(COUNT_POST)
const countPostReducer = createActionReducer(countPostAsyncActions)

//
// Action Types
export const actionTypes = {
  load: loadAsyncActions,
  loadPage: loadPageAsyncActions,
  create: publishAsyncActions,
  count: countPostAsyncActions
}

//
// Reducer
export default combineReducers({
  load: postLoadReducer,
  loadPage: loadPageReducer,
  create: postPublishReducer,
  count: countPostReducer
})

//
// Action Creators
export const actionCreators = {
  loadOne, loadByPage, publish, count
}

function loadOne (id) {
  return {
    type: LOAD_POST,
    endPoint: `${POST_API_URL}/${id}`,
    cacheKey: `LOAD_POST_${id}`,
    cacheTimeout: 5000,
    meta: { id } // for dataDependence track the request state
  }
}

function loadByPage (page) {
  const query  = {
    options: {
      limit: PAGE_LIMIT,
      skip: PAGE_LIMIT * (page - 1),
      sort: {
        priority: -1,
        date: -1
      }
    },
    fields: { content: 0 }
  }

  return {
    type: LOAD_POST_PAGE,
    meta: { page, id: page },
    endPoint: POST_API_URL,
    query,
    cacheKey: `POST_PAGE_${page}`,
    cacheTimeout: 5000
  }
}

function publish (body) {
  return {
    type: PUBLISH_POST,
    endPoint: POST_API_URL,
    method: 'POST',
    body
  }
}

function count () {
  return {
    type: COUNT_POST,
    endPoint: `${POST_API_URL}/count`,
    cacheKey: 'COUNT_POST',
    cacheTimeout: 5000
  }
}
