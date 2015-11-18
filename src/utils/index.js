export const isDefined = val => val != null
export const resolveProp = obj => prop => obj[prop]
export const prop = prop => obj => obj[prop]

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

export const isFunction = val => {
  return typeof val === 'function'
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

export const isOneOf = (one, of) => {
  if (Array.isArray(of)) {
    return of.indexOf(one) > -1
  }
  return one === of
}

export const createChainedFunction = (...funcs) => {
  return funcs.filter((f) => {
    return f != null
  }).reduce((acc, f) => {
    if (acc === null) {
      return f
    }

    return (...args) => {
      acc.apply(null, args)
      f.apply(null, args)
    }
  }, null)
}

export const newScript = (src) => (cb) => {
  const script = document.createElement('script')
  script.src = src
  script.addEventListener('load', () => cb(null, src))
  script.addEventListener('error', () => cb(true, src))
  document.body.appendChild(script)
  return script
}

const keyIterator = (cols) => {
  const keys = Object.keys(cols)
  let i = -1
  return {
    next () {
      i++ // inc
      if (i >= keys.length) return null
      else return keys[i]
    }
  }
}

// tasks should be a collection of thunk
export const parallel = (...tasks) => (each) => (cb) => {
  let hasError = false
  let successed = 0
  const ret = []
  tasks = tasks.filter(isFunction)

  if (tasks.length <= 0) cb(null)
  else {
    tasks.forEach((task, i) => {
      const thunk = task
      thunk((err, ...args) => {
        if (err) hasError = true
        else {
          // collect result
          if (args.length <= 1) args = args[0]

          ret[i] = args
          successed ++
        }

        if (isFunction(each)) each.call(null, err, args, i)

        if (hasError) cb(true)
        else if (tasks.length === successed) {
          cb(null, ret)
        }
      })
    })
  }
}

// tasks should be a collection of thunk
export const series = (...tasks) => (each) => (cb) => {
  tasks = tasks.filter(val => val != null)
  const nextKey = keyIterator(tasks)
  const nextThunk = () => {
    const key = nextKey.next()
    let thunk = tasks[key]
    if (Array.isArray(thunk)) thunk = parallel.apply(null, thunk).call(null, each)
    return [ key, thunk ]
  }
  let key, thunk
  let next = nextThunk()
  key = next[0]
  thunk = next[1]
  if (thunk == null) return cb(null)

  const ret = []
  const iterator = () => {
    thunk((err, ...args) => {
      if (args.length <= 1) args = args[0]
      if (isFunction(each)) each.call(null, err, args, key)

      if (err) cb(err)
      else {
        // collect result
        ret.push(args)

        next = nextThunk()
        key = next[0]
        thunk = next[1]
        if (thunk == null) return cb(null, ret) // finished
        else iterator()
      }
    })
  }
  iterator()
}

export const autobind = (methodNames) => {
  return {
    componentWillMount () {
      methodNames.forEach((name) => {
        this[name] = this[name].bind(this)
      })
    }
  }
}
