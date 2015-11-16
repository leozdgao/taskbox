import React, { Component, PropTypes as T } from 'react'
import hoistStatics from 'hoist-non-react-statics'

const scriptLoader = (...scripts) => (WrappedComponent) => {
  class ScriptLoader extends Component {
    static propTypes = {
      onScriptLoaded: T.func
    }

    static defaultProps = {
      onScriptLoaded: () => {}
    }

    constructor (props, context) {
      super(props, context)

      this.state = {
        scriptLoaded: false
      }
    }

    render () {
      const props = {
        ...this.props,
        scriptLoaded: this.state.scriptLoaded
      }

      return (
        <WrappedComponent {...this.props} />
      )
    }
  }

  return hoistStatics(ScriptLoader, WrappedComponent)
}

export default scriptLoader
