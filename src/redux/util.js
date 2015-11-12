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
