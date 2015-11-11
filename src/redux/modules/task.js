import update from 'react-addons-update'
import find from 'lodash/collection/find'
import forEach from 'lodash/collection/forEach'
import qs from 'qs'
import merge from 'deep-extend'
import { json as request } from 'lgutil/common/ajax'
import { isLeader, isAdmin } from '../../auth'

const TASK_API_URL = '/api/rest/task'

const LOAD_TASK = 'task/LOAD_TASK'
const NEW_TASK = 'task/NEW_TASK'
const PUBLISH_TASK = 'task/PUBLISH_TASK'
const UPDATE_TASK = 'task/UPDATE_TASK'
const SYNC_TASK = 'task/SYNC_TASK'

const TASK_MODIFY = 'task/TASK_MODIFY'

// - abortable
// - cacheable

const initState = {
  data: {},
  loading: true,
  error: null, // for loading
  addNewTaskError: null
}

let requests = []
const cacheRequest = promise => requests.push(promise)
const getToday = () => {
  const d = new Date()
  d.setMinutes(0)
  d.setSeconds(0)
  d.setHours(0)
  d.setMilliseconds(0)
  return d
}
const setDefault = (target) => (key, defaultValue) => {
  if (target[key] == null) target[key] = defaultValue

  return target
}

// ======================== actions for task entry===========================
const applyFunc = {
  nor: (val) => !val
}
const replaceApplyFunc = function replaceApplyFunc (body) {
  for (const key in body) {
    if (!body.hasOwnProperty(key)) continue

    const val = body[key]
    if (typeof val === 'object') body[key] = replaceApplyFunc(val)
    else {
      if (key === '$apply') body[key] = applyFunc[val]
    }
  }

  return body
}
export const updateBodyMap = {
  checkEntry: (taskIndex, listIndex, itemIndex, checked) => ({ [taskIndex]: { checklist: { [listIndex]: { items: { [itemIndex]: { checked: { $set: !checked } } } } } } }),
  addEntry: (taskIndex, listIndex, val) => ({ [taskIndex]: { checklist: { [listIndex]: { items: { $push: [ { checked: false, title: val } ] } } } } }),
  removeEntry: (taskIndex, listIndex, itemIndex) => ({ [taskIndex]: { checklist: { [listIndex]: { items: { $splice: [ [ itemIndex, 1 ] ] } } } } }),
  addCheckList: (taskIndex, newList) => ({ [taskIndex]: { checklist: { $push: [ { name: newList, items: [] } ] } } }),
  removeCheckList: (taskIndex, listIndex) => ({ [taskIndex]: { checklist: { $splice: [ [ listIndex, 1 ] ] } } })
}
const taskActionBuilder = (actions, type) => {
  return actions.reduce((ret, actionName) => {
    const bodyBuilder = updateBodyMap[actionName]
    if (typeof bodyBuilder === 'function') {
      ret[actionName] = (...args) => {
        const body = bodyBuilder.apply(null, args)
        return {
          type,
          payload: body
        }
      }
    }
    return ret
  }, {})
}

const isActionModifyEntry = (actionName) => {
  return [ 'checkEntry', 'addEntry', 'removeEntry' ].indexOf(actionName) >= 0
}

export const mergeActions = (ret = {}, actionName, args, updateBody) => {
  ret[actionName] || (ret[actionName] = [])

  const [ taskIndex, listIndex, itemIndex ] = args
  const taskKey = `${taskIndex}$${listIndex}`

  // do not merge if the checklist has been ready for removing
  if (isActionModifyEntry(actionName)) {
    if (ret['removeCheckList'] && ret['removeCheckList'].length > 0) {
      const existedTask = find(ret['removeCheckList'], ({ key }) => {
        return key === taskKey
      })

      if (existedTask) return
    }
  }

  // push action, ready to merge
  ret[actionName].push({
    key: taskKey,
    body: updateBody
  })

  return ret
}

export const extractUpdateObject = (actions) => {
  let finalUploadObject = {}
  forEach(actions, (val, key) => {
    forEach(actions[key], ({ body }) => {
      finalUploadObject = merge(finalUploadObject, body)
    })
  })

  return finalUploadObject
}

export const taskModifyActionCreators = taskActionBuilder(Object.keys(updateBodyMap), TASK_MODIFY)

export default function (state = initState, action) {
  switch (action.type) {
  case LOAD_TASK: {
    if (action.error) {
      return update(state, {
        error: { $set: true },
        loading: { $set: false }
      })
    }
    else {
      const data = action.payload.body.reduce((ret, task) => {
        ret[task._id] = task
        return ret
      }, {})
      return update(state, {
        data: { $set: data },
        loading: { $set: false }
      })
    }
  }
  case NEW_TASK: {
    const { payload } = action
    return update(state, {
      data: { [payload._id]: { $set: payload } }
    })
  }
  case TASK_MODIFY: {
    const body = action.payload
    const updatedTaskIds = Object.keys(body)
    const currentTaskIds = Object.keys(state.data)
    // filter the tasks that need to be updated
    updatedTaskIds.forEach((tid) => {
      if (currentTaskIds.indexOf(tid) < 0) {
        delete body[tid]
      }
    })

    return update(state, {
      data: body
    })
  }
  default:
    return state
  }
}

// action for load task
export function load (resource) {
  const { resourceId, role } = resource
  const query = {
    conditions: {
      assignee: !isLeader(role) ? resourceId : void 0,
      startDate: {
        $lte: getToday().toString()
      },
      endDate: {
        $exists: false
      }
    }
  }

  const url = `${TASK_API_URL}?${qs.stringify(query)}`
  return {
    type: LOAD_TASK,
    cacheable: true,
    payload: {
      promiseCreator: request.get,
      args: [ url ]
    },
    timeout: 5000, // cache timeout
    onPromised: cacheRequest
  }
}

export function addTask (body) {
  return {
    type: NEW_TASK,
    payload: body
  }
}

export function publishNewTask (body, ...then) {
  const url = `${TASK_API_URL}`
  const setBodyDefault = setDefault(body)
  // set default
  setBodyDefault('startDate', new Date())
  setBodyDefault('sealed', false)
  setBodyDefault('checklist', [])

  return {
    type: PUBLISH_TASK,
    payload: request.post(url, body),
    then
  }
}

export function updateCheckList (taskId, checklist, ...then) {
  const body = {
    update: {
      checklist
    }
  }
  const url = `${TASK_API_URL}/${taskId}`

  return {
    type: UPDATE_TASK,
    payload: request.put(url, body),
    then
  }
}

export function syncTask (updateBody) {
  return {
    type: TASK_MODIFY,
    payload: updateBody
  }
}

export function dispose () {
  requests.forEach(r => r.abort())
  requests = []
}
