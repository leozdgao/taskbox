import update from 'react-addons-update'
import findIndex from 'lodash/array/findIndex'
import createReducer from '../../createReducer'
import { ProjectModule } from '../request'

const { actionTypes: { loadProjectUnderCompany } }  = ProjectModule

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
  }
}

export default createReducer(actionMap, { data: {} })
