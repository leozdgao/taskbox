import React, { Component, PropTypes as T } from 'react'
import forEach from 'lodash/collection/forEach'
import reduce from 'lodash/collection/reduce'
import { isObject, isDefined, has } from '../../utils'
import { defaultKey } from '../../redux/dataFetch'

const resolvePropByPath = obj => path => {
  const subPaths = path.split('.')
  return subPaths.reduce((target, key) => {
    if (!isDefined(target)) return void 0
    return target[key]
  }, obj)
}

const isPending = ({ pending }, id) => {
  return has(pending, id)
}
const isFulfilled = ({ fulfilled }, id) => {
  return has(fulfilled, id)
}
const isRejected = ({ rejected }, id) => {
  return has(rejected, id)
}

const combineResult = (init, val) => {
  return {
    ...init,
    ...val
  }
}

const storeShape = T.shape({
  subscribe: T.func.isRequired,
  dispatch: T.func.isRequired,
  getState: T.func.isRequired
})

const dataDependence = mapFetchConfig => WrappedComponent => {

  const normalizeConfig = (config) => {
    return reduce(config, (acc, block, propName) => {
      if (Array.isArray(block)) { // series task
        acc[propName] = block.reduce((ret, subConfig) => {
          if (!ret.next) return { ...subConfig, next: [] }
          else {
            ret.next.push(subConfig)
            return ret
          }
        }, {})
      }
      else {
        acc[propName] = block
      }

      return acc
    }, {})
  }

  // const mergeParallelConfig = () => {
  //
  // }

  //     {
  //       name: 'post',
  //       state: 'request.post.load',
  //       action: PostActions.loadOne,
  //       args: [ postId ],
  //       mapVal: () => data[postId]
  //     }

  class Fetch extends Component {
    static contextTypes = {
      store: storeShape
    }

    static propTypes = {
      store: storeShape
    }

    constructor (props, context) {
      super(props, context)

      this.store = props.store || this.context.store
      if (!isDefined(this.store)) {
        throw new Error("Can't find redux store.")
      }

      this.config = this.calculateConfig(props)
      this.state = Object.keys(this.config).reduce((ret, propName) => {
        const config = this.config[propName]

        if (Array.isArray(config)) ret[propName] = []
        else ret[propName] = null

        return ret
      }, {})
    }

    componentWillReceiveProps (nextProps) {
      this.config = this.calculateConfig(nextProps) // recalculate config

      this.ensureDataFetch(nextProps)
    }

    componentDidMount () {
      this.trySubscribe()

      this.ensureDataFetch(this.props)
    }

    componentWillUnmount () {
      this.tryUnsubscribe()
    }

    // start data fetch here
    ensureDataFetch (props) {
      const { dispatch } = this.store

      forEach(this.config, (config, propName) => {
        if (isObject(config)) { // dispatch action by a single config block
          const { action, args, key = defaultKey, state: statePath } = config
          const requestState = this.getRequestState(statePath)
          if (!isPending(requestState, key)) dispatch(action.apply(null, args))
        }
        else {
          throw new Error('Invalid config block, it should be an array or object.')
        }
      })
    }

    handleChange () {
      const state = reduce(this.config, (state, config, propName) => {
        const val = this.updateState(config, propName)
        return combineResult(state, val)
      }, this.state)

      this.setState(state)
    }

    updateState (config, propName) {
      const { state: statePath, key = defaultKey, mapVal } = config
      const requestState = this.getRequestState(statePath)
      if (isRejected(requestState, key)) {
        return {
          [propName]: { error: true }
        }
      }
      if (isFulfilled(requestState, key)) {
        const val = mapVal(this.store.getState())
        return {
          [propName]: val
        }
      }
      if (isPending(requestState, key)) {
        return {
          [propName]: null
        }
      }
    }

    calculateConfig (props) {
      return normalizeConfig(mapFetchConfig(props, this.store.getState))
    }

    trySubscribe () {
      if (!this.unsubscribe) {
        this.unsubscribe = this.store.subscribe(::this.handleChange)
      }
    }

    tryUnsubscribe () {
      if (this.unsubscribe) {
        this.unsubscribe()
        this.unsubscribe = null
      }
    }

    getRequestState (path) {
      const state = this.store.getState()
      return resolvePropByPath(state)(path)
    }

    render () {
      const props = {
        ...this.props,
        ...this.state
      }
      return (
        <WrappedComponent {...props} />
      )
    }
  }

  return Fetch
}

export default dataDependence
