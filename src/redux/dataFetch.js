import { combineReducers } from 'redux'
import createReducer from './createReducer'
import { constructAsyncActionTypes } from './createAction'
import { removeFromArray } from '../utils'

// Use:
//
// const LOAD_COMPANY = '@@company/COMPANY_LOAD'
// const loadAsyncActions = constructAsyncTypes(LOAD_COMPANY)
// const companyLoadReducer = createActionReducer(loadAsyncActions)
//
// export default combineReducers({
//   load: companyLoadReducer
// })

export const defaultKey = '_ONLY_'

const getActionMap = (asyncAction) => {
  const transferId = (state, id, key) => {
    const { pending, fulfilled, rejected } = state
    const removeId = removeFromArray(id)

    return {
      pending: key === 'pending' ? [ ...pending, id ]: removeId(pending),
      fulfilled: key === 'fulfilled' ? [ ...fulfilled, id ]: removeId(fulfilled),
      rejected: key === 'rejected' ? [ ...rejected, id ] : removeId(rejected)
    }
  }
  const getId = action => {
    return (action.meta && action.meta.id) || defaultKey
  }

  return {
    [asyncAction.pending] (state, action) {
      const id = getId(action)

      return transferId(state, id, 'pending')
    },
    [asyncAction.fulfilled] (state, action) {
      const id = getId(action)

      return transferId(state, id, 'fulfilled')
    },
    [asyncAction.rejected] (state, action) {
      const id = getId(action)

      return transferId(state, id, 'rejected')
    }
  }
}

export const createActionReducer = (action) => {
  const initState = { pending: [], fulfilled: [], rejected: [] }
  return createReducer(getActionMap(action), initState)
}
