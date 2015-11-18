import { reducer as formReducer } from 'redux-form'
import { actionTypes as userActionTypes } from './user'
import createReducer from './createReducer'

const actionMap = {
  [userActionTypes["user/CHANGE_PASSWORD_REJECTED"]]: (state, action) => {
    return {
      ...state,
      oldpwd: {} // set old password to empty if error
    }
  }
}
const editPostActionMap = {
  "redux-form/CHANGE" ( state, action ) {
    return {
      ...state,
      isDirty: true
    }
  }
}

const reducer = formReducer.plugin({
  changePassword: createReducer(actionMap),
  editPost: createReducer(editPostActionMap)
})

export default reducer
