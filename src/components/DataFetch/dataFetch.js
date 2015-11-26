import React, { Component, PropTypes as T } from 'react'
import { isDefined } from '../../utils'

const a = (config) => (state, props) => {
  // Q：什么时候执行这里的代码？
  // A：store内的状态改变，或者传递给Component的属性改变
  //
  // 需要Action Creator，并dispatch
  // this.context.store

  return {

  }
}

const storeShape = T.shape({
  subscribe: T.func.isRequired,
  dispatch: T.func.isRequired,
  getState: T.func.isRequired
})

const dataFetch = mapFetchConfig => WrappedComponent => {

  // {
  //   name: 'post',
  //   action: PostActions.loadOne,
  //   actionArg: [],
  //   mapVal: ({ post: { data } }) => data[props.pid]
  // }

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

      this.config = mapFetchConfig(props)
    }

    componentWillReceiveProps (nextProps) {
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

    handleChange () {

    }

    render () {
      const props = {
        ...this.props
      }
      return (
        <WrappedComponent {...props} />
      )
    }
  }

  return Fetch
}

export default dataFetch
