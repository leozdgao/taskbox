export default {
  isOneOf: (one, of) => {
    if (Array.isArray(of)) {
      return of.indexOf(one) > -1
    }
    return one === of
  },
  createChainedFunction: (target, ...funcs) => {

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
}
