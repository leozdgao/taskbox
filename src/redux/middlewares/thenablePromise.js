const isPromise = (maybe) => {
  return typeof maybe === 'object' && typeof maybe.then === 'function'
}

export default ({ dispatch, getState }) => next => action => {
  if (Array.isArray(action.then)) {
    const { payload, then } = action
    const thenable = (payload) => {
      then.forEach((func) => {
        if (typeof func === 'function') func(payload)
      })
    }
    if (isPromise(payload)) {
      payload.then((ret) => {
        dispatch({ ...action, payload: ret })
        thenable(ret)
      }, (e) => {
        dispatch({ ...action, payload: e, error: true })
      })
    }
    else thenable(payload)
  }
  else next(action)
}
