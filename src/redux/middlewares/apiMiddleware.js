import { json as request } from 'lgutil/common/ajax'
import qs from 'qs'
import { devLog } from '../../utils'

const isApiRequest = action => action.type && action.endPoint
const getRequestOptions = ({
  type, payload, meta, data, // need not these FSA property
  cacheKey, cacheTimeout, // for cache
  endPoint, method = 'GET', query = '',
  body, headers, ...opts }) => {
  if (typeof query == 'object') {
    query = qs.stringify(query)
  }

  if (query) endPoint = `${endPoint}?${query}`

  return {
    endPoint, method, body, headers, opts
  }
}

const cache = {}

export default ({ dispatch, getState }) => next => action => {
  if (isApiRequest(action)) {
    const option = getRequestOptions(action)
    const method = option.method.toLowerCase()
    const invoker = request[method]
    let args
    if (invoker) {

      devLog(`Api call [${option.method}], endPoint: [${option.endPoint}]`)

      if (method === 'get') args = [ option.endPoint, option.headers, option.opts ]
      else args = [ option.endPoint, option.body, option.headers, option.opts ]

      const { type, meta, data, cacheKey, cacheTimeout } = action
      let promise
      if (cacheKey && cache[cacheKey]) {
        devLog(`Api call resolve from cache [${cacheKey}]`)

        promise = Promise.resolve(cache[cacheKey])
      }
      else {
        devLog(`Api call request send`)
        // attach promise for cache, don't cache if error occurred
        promise = invoker.apply(null, args).then(ret => {
          // need cache
          if (cacheTimeout != null) {
            cache[cacheKey] = ret

            // if cache time is 0, always use cached result
            if (cacheTimeout !== 0) {
              setTimeout(() => { // remove cache after cache timeout
                devLog(`Api call cache expires [${cacheKey}]`)

                delete cache[cacheKey]
              }, cacheTimeout)
            }
          }

          return ret // pass result to next promise
        })
      }

      // dispatch this action to promiseMiddleware
      dispatch({
        type, meta, data,
        payload: {
          promise
        }
      })
    }
    else next(action)
  }
  else next(action)
}
