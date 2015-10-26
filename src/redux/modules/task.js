import update from 'react-addons-update'
import { json as request } from 'lgutil/common/ajax'

const TASK_LOAD_API_URL = '/api/task'

const LOAD_TASK = 'LOAD_TASK'

const TASK_CHECK_ENTRY = 'TASK_CHECK_ENTRY'
const TASK_ADD_ENTRY = 'TASK_ADD_ENTRY'
const TASK_REMOVE_ENTRY = 'TASK_REMOVE_ENTRY'

const TASK_ADD_CHECKLIST = 'TASK_ADD_CHECKLIST'
const TASK_REMOVE_CHECKLIST = 'TASK_REMOVE_CHECKLIST'

const NEW_TASK = 'NEW_TASK'
const UPDATE_TASK = 'UPDATE_TASK'

// - abortable
// - cacheable

const initState = {
  data: [],
  loading: true,
  error: null
}

let requests = []
const cacheRequest = promise => requests.push(promise)

export default function (state = initState, action) {
  switch (action.type) {
  case LOAD_TASK: {
    const field = action.error ? 'error' : 'data'
    return update(state, {
      [field]: { $set: action.payload.body },
      loading: { $set: false }
    })
  }
  case TASK_CHECK_ENTRY: {
    const { taskIndex, listName, itemIndex } = action.payload
    return update(state, {
      data: { [taskIndex]: { checklist: { [listName]: { [itemIndex]: { checked: { $apply: (val) => !val } } } } } }
    })
  }
  case TASK_ADD_ENTRY: {
    const { taskIndex, listName, val } = action.payload
    return update(state, {
      data: { [taskIndex]: { checklist: { [listName]: { $push: [ { checked: false, title: val } ] } } } }
    })
  }
  case TASK_REMOVE_ENTRY: {
    const { taskIndex, listName, itemIndex } = action.payload
    return update(state, {
      data: { [taskIndex]: { checklist: { [listName]: { $apply: (list) => { list.splice(itemIndex, 1); return list } } } } }
    })
  }
  case TASK_ADD_CHECKLIST: {
    const { taskIndex, newList } = action.payload
    return update(state, {
      data: { [taskIndex]: { checklist: { [newList]: { $set: [] } } } }
    })
  }
  case TASK_REMOVE_CHECKLIST: {
    const { taskIndex, listName } = action.payload
    return update(state, {
      data: { [taskIndex]: { checklist: { $apply: (list) => {
        const ret = {}
        for (const key in list) {
          if (!list.hasOwnProperty(key) || key === listName) continue
          ret[key] = list[key]
        }
        return ret
      } } } }
    })
  }
  default:
    return state
  }
}

// action for load task
export function load () {
  return {
    type: LOAD_TASK,
    cacheable: true,
    payload: {
      promiseCreator: request.get,
      args: [ TASK_LOAD_API_URL ]
    },
    timeout: 5000, // cache timeout
    onPromised: cacheRequest
  }
}


// actions for task entry
export function checkEntry (taskIndex, listName, itemIndex) {
  return {
    type: TASK_CHECK_ENTRY,
    payload: {
      taskIndex, listName, itemIndex
    }
  }
}

export function addEntry (taskIndex, listName, val) {
  return {
    type: TASK_ADD_ENTRY,
    payload: {
      taskIndex, listName, val
    }
  }
}

export function removeEntry (taskIndex, listName, itemIndex) {
  return {
    type: TASK_REMOVE_ENTRY,
    payload: {
      taskIndex, listName, itemIndex
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

export function removeCheckList (taskIndex, listName) {
  return {
    type: TASK_REMOVE_CHECKLIST,
    payload: {
      taskIndex, listName
    }
  }
}


export function dispose () {
  requests.forEach(r => r.abort())
  requests = []
}
