export function constructAsyncActionTypes (type, config) {
  const [ PENDING, FULFILLED, REJECTED ] = config || [ 'PENDING', 'FULFILLED', 'REJECTED' ]
  return {
    pending: `${type}_${PENDING}`,
    fulfilled: `${type}_${FULFILLED}`,
    rejected: `${type}_${REJECTED}`
  }
}

export function toKeyMirror (obj) {
  return Object.keys(obj).reduce((ret, key) => {
    const val = obj[key]
    ret[val] = val
    return ret
  }, {})
}
