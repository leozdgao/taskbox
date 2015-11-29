import update from 'react-addons-update'
import createReducer from '../../createReducer'
import { ProjectModule } from '../request'

const {
  actionCreators: projectActionCreators,
  actionTypes: { loadProjectUnderCompany }
} = ProjectModule

// Constants
const NEXT_STEP = "@@newTaskModal/NEXT_STEP"
const PREV_STEP = "@@newTaskModal/PREV_STEP"
const SELECT_COMPANY = "@@newTaskModal/SELECT_COMPANY"
const SELECT_PROJECT = "@@newTaskModal/SELECT_PROJECT"
const RESET = "@@newTaskModal/RESET"

export const actionTypes = {
  NEXT_STEP, PREV_STEP, SELECT_PROJECT, SELECT_COMPANY, RESET
}

const initState = {
  step: 0,
  currentCompany: null,
  projectOptions: [],
  currentProject: null
}

const actionMap = {
  [NEXT_STEP] (state, action) {
    return update(state, {
      step: { $apply: val => val + 1 }
    })
  },
  [PREV_STEP] (state, action) {
    return update(state, {
      step: { $apply: val => val - 1 }
    })
  },
  [SELECT_COMPANY] (state, { payload }) {
    return update(state, {
      currentCompany: { $set: payload }
    })
  },
  [SELECT_PROJECT] (state, { payload }) {
    return update(state, {
      currentProject: { $set: payload }
    })
  },
  [loadProjectUnderCompany.fulfilled] (state, { payload: { body } }) {
    if (Array.isArray(body)) {
      const { currentCompany } = state
      return update(state, {
        projectOptions: { $set: body.filter(p => p.companyId === currentCompany._id) }
      })
    }
  },
  [RESET] (state, action) {
    return initState
  }
}

export default createReducer(actionMap, initState)

export const actionCreators = {
  nextStep, prevStep, selectCompany, selectProject, reset
}

function selectCompany (company) {
  return {
    type: SELECT_COMPANY,
    payload: company,
    next: [
      projectActionCreators.loadProjectUnderCompany(company)
    ]
  }
}

function selectProject (project) {
  return {
    type: SELECT_PROJECT,
    payload: project
  }
}

function nextStep () {
  return {
    type: NEXT_STEP
  }
}

function prevStep () {
  return {
    type: PREV_STEP
  }
}

function reset () {
  return {
    type: RESET
  }
}
