import React, { Component, PropTypes as T } from 'react'
import { isDefined, has } from '../../utils'

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

const storeShape = T.shape({
  subscribe: T.func.isRequired,
  dispatch: T.func.isRequired,
  getState: T.func.isRequired
})

const dataDependence = mapFetchConfig => WrappedComponent => {

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

      this.config = mapFetchConfig(props, this.store.getState)
      this.state = Object.keys(this.config).reduce((ret, propName) => {
        const config = this.config[propName]

        if (Array.isArray(config)) ret[propName] = []
        else ret[propName] = null

        return ret
      }, {})
    }

    componentWillReceiveProps (nextProps) {
      this.config = mapFetchConfig(props, this.store.getState) // recalculate config

      this.ensureDataFetch(nextProps)
    }

    componentDidMount () {
      this.trySubscribe()

      this.ensureDataFetch(this.props)
    }

    componentWillUnmount () {
      this.tryUnsubscribe()
    }

    ensureDataFetch (props) {
      const { dispatch } = this.store
      Object.keys(this.config).forEach(propName => {
        const { action, args, key, state: statePath } = this.config[propName]
        const requestState = this.getRequestState(statePath)
        if (!isPending(requestState, key)) dispatch(action.apply(null, args))
      })
    }

    handleChange () {
      Object.keys(this.config).forEach(propName => {
        const { state: statePath, key, mapVal } = this.config[propName]
        const requestState = this.getRequestState(statePath)
        if (isRejected(requestState, key)) {
          this.setState({
            [propName]: { error: true }
          })
        }
        if (isFulfilled(requestState, key)) {
          const val = mapVal(this.store.getState())
          this.setState({
            [propName]: val
          })
        }
        if (isPending(requestState, key)) {
          this.setState({
            [propName]: null
          })
        }
      })
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
