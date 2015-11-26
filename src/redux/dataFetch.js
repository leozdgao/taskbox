import { combineReducers } from 'redux'
import createReducer from './createReducer'
import { constructAsyncActionTypes } from './createAction'

// Use:
//
// const LOAD_COMPANY = '@@company/COMPANY_LOAD'
// const loadAsyncActions = constructAsyncTypes(LOAD_COMPANY)
// const companyLoadReducer = createActionReducer(loadAsyncActions)
//
// export default combineReducers({
//   load: companyLoadReducer
// })


// const createActionTypes = prefix => key => {
//   if (!key) key = prefix
//   const pre = `${prefix}/${key.toUpperCase()}`
//
//   const keyForLoad = `${pre}_LOAD`
//   const keyForCreate = `${pre}_CREATE`
//   const keyForUpdate = `${pre}_UPDATE`
//   const keyForRemove = `${pre}_REMOVE`
//
//   return {
//     loadAction: constructAsyncActionTypes(keyForLoad),
//     createAction: constructAsyncActionTypes(keyForCreate),
//     updateAction: constructAsyncActionTypes(keyForUpdate),
//     removeAction: constructAsyncActionTypes(keyForRemove)
//   }
// }

const getActionMap = (asyncAction) => {
  // const onlyOneCollContain = (col, ...others) => (val) => {
  //   others.forEach(removeFromArray(val))
  //   col.push(val)
  // }

  return {
    [asyncAction.pending] (state, action) {
      const { pending, fulfilled, rejected } = state
      const { meta: { id } } = action
      const removeId = removeFromArray(id)

      return {
        pending: [ ...pending, id ],
        fulfilled: removeId(fulfilled),
        rejected: removeId(rejected)
      }
    },
    [asyncAction.fulfilled] (state, action) {
      const { pending, fulfilled, rejected } = state
      const { meta: { id } } = action

      return {
        pending: removeId(pending),
        fulfilled: [ ...fulfilled, id ],
        rejected: removeId(rejected)
      }
    },
    [asyncAction.rejected] (state, action) {
      const { pending, fulfilled, rejected } = state
      const { meta: { id } } = action

      return {
        pending: removeId(pending),
        fulfilled: removeId(fulfilled),
        rejected: [ ...rejected, id ]
      }
    }
  }
}

const createActionReducer = (action) => {
  return createReducer(getActionMap(action), initState)
}

// const createAsyncAction = createActionTypes('company')
// const combindAsyncDataReducer = (asyncActions) => {
//   const { loadAction, createAction, updateAction, removeAction } = asyncActions
//   const initState = { pending: [], fulfilled: [], rejected: [] }
//
//
//   return combineReducers({
//     load: createActionReducer(loadAction),
//     create: createActionReducer(createAction),
//     update: createActionReducer(updateAction),
//     remove: createActionReducer(removeAction)
//   })
// }



// const loadReducer = createReducer(getActionMap(companyActions.loadAction), {
//   pending: [], fulfilled: [], rejected: []
// })

// const box = (mapId) => {
//   const pendingCol = []
//   const fulfillCol = []
//   const rejectCol = []
//
//
//
//   const checkColContain = col => val => {
//     return has(col, val)
//   }
//
//   return {
//     isPending: checkColContain(pendingCol),
//     isFulfilled: checkColContain(fulfillCol),
//     isRejected: checkColContain(rejectCol),
//     pending: onlyOneCollContain(pendingCol, fulfillCol, rejectCol),
//     fulfill: onlyOneCollContain(fulfillCol, pendingCol, rejectCol),
//     reject: onlyOneCollContain(rejectCol, pendingCol, fulfillCol)
//   }
// }

// const generateStateForKey = (key) => {
//   const keyForLoad = `${key}_LOAD`
//   const keyForCreate = `${key}_CREATE`
//   const keyForUpdate = `${key}_UPDATE`
//   const keyForRemove = `${key}_REMOVE`
//
//   const boxes = {
//     [keyForLoad]: box(),
//     [keyForCreate]: box(),
//     [keyForUpdate]: box(),
//     [keyForRemove]: box()
//   }
//
//   return {
//     ...generateCollection(keyForLoad),
//   }
// }

const createDataFetchState = (...keys) => (initState) => {
  const state = {
    ...initState
  }

  return {
    getState () {
      // return a plain object
      return state
    },
    isLoading (key, id) {

    }
  }
}


const reducer = (state, action) => {

}
