const isPromise = (maybe) => {
  return typeof maybe === 'object' && typeof maybe.then === 'function'
}

export default ({ dispatch, getState }) => next => action => {
  if (Array.isArray(action.then)) {
    const { payload, then } = action
    const thenable = (payload) => {
      then.forEach((func) => {
        if (typeof func === 'function') {
          const ret = func(payload)
          if (ret.type && ret.payload) dispatch(ret)
        }
      })
    }
    if (isPromise(payload)) {
      payload.then((ret) => {
        dispatch({ type: action.type, payload: ret })
        thenable(ret)
      }, (e) => {
        dispatch({ type: action.type, payload: e, error: true })
      })
    }
    else {
      dispatch({ type: action.type, payload })
      thenable(payload)
    }
  }
  else next(action)
}
