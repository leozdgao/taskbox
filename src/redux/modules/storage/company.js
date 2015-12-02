import update from 'react-addons-update'
import findIndex from 'lodash/array/findIndex'
import forEach from 'lodash/collection/forEach'
import createReducer from '../../createReducer'
import { CompanyModule } from '../request'
import { isInGroup, safePush, safeIndexOf } from '../../../utils'

const {
  actionTypes: {
    loadOne, loadAll, loadGroup,
    update: updateAction, add: addAction
  },
  companyGroup
}  = CompanyModule

// {
//   data: {},
//   group: {}
// }

const initGroup = companyGroup.reduce((ret, { key }) => {
  ret[key] = []
  return ret
}, {})

const initState = { data: {}, group: initGroup }

// Util function
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

const reGroupCompanies = companies => {
  let group = initGroup
  forEach(companies, company => {
    group = groupCompany(group, company)
  })

  return group
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
  },
  [updateAction.fulfilled] (state, { payload: { body } }) {
    const updated = body.new
    const { ...copy } = state.data
    copy[updated._id] = updated
    const group = reGroupCompanies(copy)

    return update(state, {
      data: { [updated._id]: { $set: updated } },
      group: { $set: group }
    })
  },
  [addAction.fulfilled] (state, { payload: { body } }) {
    const { ...copy } = state.data
    copy[body._id] = body
    const group = reGroupCompanies(copy)

    return update(state, {
      data: { [body._id]: { $set: body } },
      group: { $set: group }
    })
  }
}

export default createReducer(actionMap, initState)
