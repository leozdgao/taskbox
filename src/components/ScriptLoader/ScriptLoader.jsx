import React, { Component, PropTypes as T } from 'react'
import hoistStatics from 'hoist-non-react-statics'
import { newScript, loadAllScript, series } from '../../utils'

const loadedScript = []

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
        isScriptLoaded: false,
        isScriptLoadSucceed: false
      }
    }

    componentDidMount () {
      // sequence load
      const loadNewScript = (src) => {
        if (loadedScript.indexOf(src) < 0) return newScript(src)
      }
      const tasks = scripts.map(src => {
        if (Array.isArray(src)) {
          return src.map(loadNewScript)
        }
        else return loadNewScript(src)
      })

      series(...tasks)(src => {
        const addCache = (entry) => {
          if (loadedScript.indexOf(entry) < 0) {
            loadedScript.push(entry)
          }
        }
        if (Array.isArray(src)) {
          src.forEach(addCache)
        }
        else addCache(src)
      })(err => {
        this.setState({
          isScriptLoaded: true,
          isScriptLoadSucceed: !err
        }, () => {
          if (this.state.scriptLoadSucceed) {
            this.props.onScriptLoaded()
          }
        })
      })
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

  return hoistStatics(ScriptLoader, WrappedComponent)
}

export default scriptLoader
