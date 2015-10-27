import update from 'react-addons-update'
import find from 'lodash/collection/find'
import qs from 'qs'
import { json as request } from 'lgutil/common/ajax'

const TASK_API_URL = '/api/rest/task'

const LOAD_TASK = 'LOAD_TASK'
const NEW_TASK = 'NEW_TASK'
const UPDATE_TASK = 'UPDATE_TASK'
const SYNC_TASK = 'SYNC_TASK'

const TASK_CHECK_ENTRY = 'TASK_CHECK_ENTRY'
const TASK_ADD_ENTRY = 'TASK_ADD_ENTRY'
const TASK_REMOVE_ENTRY = 'TASK_REMOVE_ENTRY'

const TASK_ADD_CHECKLIST = 'TASK_ADD_CHECKLIST'
const TASK_REMOVE_CHECKLIST = 'TASK_REMOVE_CHECKLIST'

// - abortable
// - cacheable

const initState = {
  data: [],
  loading: true,
  error: null
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

export default function (state = initState, action) {
  switch (action.type) {
  case LOAD_TASK: {
    const field = action.error ? 'error' : 'data'
    return update(state, {
      [field]: { $set: action.payload.body },
      loading: { $set: false }
    })
  }
  case SYNC_TASK: {
    const { task } = action.payload
    let taskIndex = -1
    for (let i = 0; i < state.data.length; i++) {
      const old = state.data[i]
      if (old._id === task._id) {
        taskIndex = i; break
      }
    }

    return update(state, {
      data: { [taskIndex]: { $set: task } }
    })
  }
  case TASK_CHECK_ENTRY: {
    const { taskIndex, listIndex, itemIndex } = action.payload
    return update(state, {
      data: { [taskIndex]: { checklist: { [listIndex]: { items: { [itemIndex]: { checked: { $apply: (val) => !val } } } } } } }
    })
  }
  case TASK_ADD_ENTRY: {
    const { taskIndex, listIndex, val } = action.payload
    return update(state, {
      data: { [taskIndex]: { checklist: { [listIndex]: { items: { $push: [ { checked: false, title: val } ] } } } } }
    })
  }
  case TASK_REMOVE_ENTRY: {
    const { taskIndex, listIndex, itemIndex } = action.payload
    return update(state, {
      data: { [taskIndex]: { checklist: { [listIndex]: { items: { $apply: (list) => { list.splice(itemIndex, 1); return list } } } } } }
    })
  }
  case TASK_ADD_CHECKLIST: {
    const { taskIndex, newList } = action.payload
    return update(state, {
      data: { [taskIndex]: { checklist: { $push: [ { name: newList, items: [] } ] } } }
    })
  }
  case TASK_REMOVE_CHECKLIST: {
    const { taskIndex, listIndex } = action.payload
    return update(state, {
      data: { [taskIndex]: { checklist: { $apply: (list) => {
        list.splice(listIndex, 1)
        return list
      } } } }
    })
  }
  default:
    return state
  }
}

// action for load task
export function load (resourceId) {
  const query = {
    conditions: {
      assignee: resourceId,
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

export function syncTask (task) {
  return {
    type: SYNC_TASK,
    payload: {
      task
    }
  }
}

// actions for task entry
export function checkEntry (taskIndex, listIndex, itemIndex) {
  return {
    type: TASK_CHECK_ENTRY,
    payload: {
      taskIndex, listIndex, itemIndex
    }
  }
}

export function addEntry (taskIndex, listIndex, val) {
  return {
    type: TASK_ADD_ENTRY,
    payload: {
      taskIndex, listIndex, val
    }
  }
}

export function removeEntry (taskIndex, listIndex, itemIndex) {
  return {
    type: TASK_REMOVE_ENTRY,
    payload: {
      taskIndex, listIndex, itemIndex
    }
  }
}

// actions for checklist
export function addCheckList (taskIndex, newList) {
  return {
    type: TASK_ADD_CHECKLIST,
    payload: {
      taskIndex, newList
    }
  }
}

export function removeCheckList (taskIndex, listIndex) {
  return {
    type: TASK_REMOVE_CHECKLIST,
    payload: {
      taskIndex, listIndex
    }
  }
}

export function dispose () {
  requests.forEach(r => r.abort())
  requests = []
}
