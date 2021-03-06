const creatorcache = []
const cacheMap = {}

function generateCacheKey (promiseCreator, args) {
  let index = creatorcache.indexOf(promiseCreator)
  if (index < 0) {
    index = creatorcache.push(promiseCreator) - 1
  }
  return index + 'ARGS' + JSON.stringify(args)
}

const cachableRequest = (promiseCreator, timeout, onPromised) => {
  // cache last time result, omit it if promise rejected
  return (...args) => {
    const cacheKey = generateCacheKey(promiseCreator, args)
    if (cacheMap[cacheKey]) return Promise.resolve(cacheMap[cacheKey])
    else {
      const promise = promiseCreator.apply(promiseCreator, args)
      onPromised.call(onPromised, promise)
      return promise.then((body) => {
        cacheMap[cacheKey] = body

        // clear cache
        if (timeout > 0) {
          setTimeout(() => {
            delete cacheMap[cacheKey]
          }, timeout) // default to 5s
        }

        return body
      })
    }
  }
}

export default ({ dispatch, getState }) => next => action => {
  const { cacheable, timeout, onPromised, ...others } = action
  if (cacheable) {
    const { promiseCreator, args } = action.payload || {}
    if (typeof promiseCreator === 'function') {
      const smartRequest = cachableRequest(promiseCreator, timeout, onPromised)
      const promise = smartRequest.apply(null, args)

      promise.then((val) => {
        next({
          ...others,
          payload: val
        })
      }).catch((e) => {
        next({
          ...others,
          payload: e,
          error: true
        })
      })
    }
    else next(action)
  }
  else next(action)
}
