import { reducer as formReducer } from 'redux-form'
import { actionTypes as userActionTypes } from './user'
import createReducer from './createReducer'

const actionMap = {
  [userActionTypes.CHANGE_PASSWORD]: (state, action) => {
    if (action.error) {
      return {
        ...state,
        oldpwd: {} // set old password to empty if error
      }
    }
  }
}

const reducer = formReducer.plugin({
  changePassword: createReducer(actionMap)
})

export default reducer
