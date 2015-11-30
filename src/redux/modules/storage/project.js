import update from 'react-addons-update'
import findIndex from 'lodash/array/findIndex'
import createReducer from '../../createReducer'
import { ProjectModule } from '../request'

const { actionTypes: { loadProjectUnderCompany, loadOne } }  = ProjectModule

// {
//   data: {}
// }

const actionMap = {
  [loadProjectUnderCompany.fulfilled] (state, { payload: { body } }) {
    const data = body.reduce((ret, project) => {
      ret[project._id] = { $set: project }
      return ret
    }, {})

    return update(state, {
      data
    })
  },
  [loadOne.fulfilled] (state, { payload: { body } }) {
    return update(state, {
      data: { [body._id]: { $set: body } }
    })
  }
}

export default createReducer(actionMap, { data: {} })
