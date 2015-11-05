const isPromise = (maybe) => {
  return typeof maybe === 'object' && typeof maybe.then === 'function'
}

export default ({ dispatch, getState }) => next => action => {
  if (Array.isArray(action.then)) {
    const { payload, then, ...others } = action
    const thenable = (payload) => {
      then.forEach((func) => {
        if (typeof func === 'function') {
          const ret = func(payload)
          if (ret && ret.type && ret.payload) dispatch(ret)
        }
      })
    }
    if (isPromise(payload)) {
      payload.then((ret) => {
        dispatch({ ...others, payload: ret })
        thenable(ret)
      }, (e) => {
        dispatch({ ...others, payload: e, error: true })
      })
    }
    else {
      dispatch({ ...others, payload })
      thenable(payload)
    }
  }
  else next(action)
}
