import update from 'react-addons-update'
import createReducer from '../../createReducer'
import { PostModule } from '../request'

const { actionTypes: { load, loadPage, create, count } }  = PostModule

// State:
//   {
//     data: {},
//     page: {},
//     count,
//     lastPublishedPostId
//   }
//

const actionMap = {
  [load.fulfilled] (state, { payload, meta }) {
    const ret = payload.body
    return update(state, {
      data: { [ret._id]: { $set: ret } }
    })
  },
  [loadPage.fulfilled] (state, { payload, meta }) {
    const ret = payload.body
    const ids = []
    const dataUpdate = ret.reduce((acc, post) => {
      acc[post._id] = { $set: post }
      ids.push(post._id)
      return acc
    }, {})

    return update(state, {
      data: dataUpdate,
      page: { [meta.page]: { $set: ids } }
    })
  },
  [create.fulfilled] (state, { payload }) {
    const ret = payload.body
    return update(state, {
      data: { [ret._id]: { $set: ret } },
      lastPublishedPostId: { $set: ret._id }
    })
  },
  [count.fulfilled] (state, { payload }) {
    return {
      ...state,
      count: payload.body.count
    }
  }
}

export default createReducer(actionMap, { data: {}, page: {} })
