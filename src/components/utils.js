import assign from 'object-assign'

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
  },
  loadAllScript (asyncList, callback, final) {
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
  },
  newScript (src, onload, onerror) {
    const script = document.createElement('script')
    script.src = src
    script.addEventListener('load', onload)
    script.addEventListener('error', onerror)
    document.body.appendChild(script)
    return script
  }
}
