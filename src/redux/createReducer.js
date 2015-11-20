const createReducer = (actionMap, initState) => {
  return (state = initState, action) => {
    const plan = actionMap[action.type]
    if (plan) return plan(state, action) || state
    else return state
  }
}

export default createReducer
