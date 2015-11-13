export const isOneOf = (one, of) => {
  if (Array.isArray(of)) {
    return of.indexOf(one) > -1
  }
  return one === of
}

export const createChainedFunction = (target, ...funcs) => {
  return funcs.filter((f) => {
    return f != null
  }).reduce((acc, f) => {
    if (acc === null) {
      return f.bind(target)
    }

    return (...args) => {
      args.apply(target, args)
      f.apply(target, args)
    }
  }, null)
}

export const loadAllScript = (asyncList, callback, final) => {
  const taskSum = asyncList.length
  let finished = 0
  let successed = 0
  asyncList.forEach((task) => {
    task.addEventListener('load', () => {
      finished ++
      successed ++

      if (taskSum === finished) {
        if (taskSum === successed) callback.call(this)

        final.call(this, taskSum === successed)
      }
    })
    task.addEventListener('error', () => {
      finished ++

      if (taskSum === finished) {
        final.call(this, taskSum === successed)
      }
    })
  })
}

export const newScript = (src, onload, onerror) => {
  const script = document.createElement('script')
  script.src = src
  script.addEventListener('load', onload)
  script.addEventListener('error', onerror)
  document.body.appendChild(script)
  return script
}

export const isDefined = val => val != null
export const resolveProp = obj => prop => obj[prop]

export const hasSameKey = (a, b) => {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)

  if (aKeys.length !== bKeys.length) return false
  else {
    for (let i = 0; i < aKeys.length; i++) {
      if (bKeys.indexOf(aKeys[i]) < 0) return false
    }

    return true
  }
}

export const isInRange = (from, to) => (num) => {
  return from <= num && to >= num
}

export const isInGroup = (from, to) => (text) => {
  from = from.charCodeAt(0)
  to = to.charCodeAt(0)

  const lead = text[0].toUpperCase().charCodeAt(0)
  return isInRange(from, to)(lead)
}

const safeInvoke = (pred) => (action) => (obj, ...args) => {
  if (pred(obj)) {
    return action.apply(null, [ obj, ...args ])
  }
}
const safeArrayInvoke = safeInvoke(Array.isArray)

export const safePush = safeArrayInvoke((arr, sth) => {
  return [ ...arr, sth ]
})

export const safeIndexOf = safeArrayInvoke((arr, sth) => {
  return arr.indexOf(sth)
})

export const defaultValue = (d) => (v) => {
  return v || d
}

export const noop = () => {}
export const always = val => () => {
  return val
}
