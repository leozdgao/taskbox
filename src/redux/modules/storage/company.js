import update from 'react-addons-update'
import findIndex from 'lodash/array/findIndex'
import createReducer from '../../createReducer'
import { CompanyModule } from '../request'
import { isInGroup, safePush, safeIndexOf } from '../../../utils'

const { actionTypes: { loadOne, loadAll, loadGroup }, companyGroup }  = CompanyModule

// {
//   data: {},
//   group: {}
// }

const groupCompany = (ret = {}, company) => {
  const groupIndex = findIndex(companyGroup, ({ from, to }) => {
    return isInGroup(from, to)(company.name)
  })
  const { key } = companyGroup[groupIndex]

  ret[key] || (ret[key] = [])

  if (safeIndexOf(ret[key], company._id) < 0) {
    ret[key] = safePush(ret[key], company._id)
  }

  return ret
}

const actionMap = {
  [loadOne.fulfilled] (state, { payload: { body }, meta: { id } }) {
    return update(state, {
      data: { [id]: { $set: body } }
    })
  },
  [loadAll.fulfilled] (state, action) {
    let { ...group } = state.group
    const data = action.payload.body.reduce((ret, company) => {
      group = groupCompany(group, company)
      ret[company._id] = company
      return ret
    }, {})

    return update(state, {
      data: { $set: data },
      group: { $set: group },
    })
  },
  [loadGroup.fulfilled] (state, action) {
    const { group: { key } } =  action.meta
    const { body: companies } = action.payload
    const { ...data } = state.data
    let { ...group } = state.group

    companies.forEach((company) => {
      group = groupCompany(group, company)
      data[company._id] = company
    })

    return update(state, {
      data: { $set: data },
      group: { $set: group }
    })
  }
}

const initGroup = companyGroup.reduce((ret, { key }) => {
  ret[key] = []
  return ret
}, {})

export default createReducer(actionMap, { data: {}, group: initGroup })
