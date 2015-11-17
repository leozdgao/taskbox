import React, { Component, PropTypes as T } from 'react'
import scriptLoader from '../ScriptLoader/ScriptLoader'
import { newScript, loadAllScript } from '../../utils'
import './bootstrap-markdown.min.css'

const noop = () => {}

@scriptLoader([
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.5/marked.min.js'
], '/assets/bootstrap-markdown.js')
class Editor extends Component {

  static propTypes = {
    isScriptLoaded: T.bool,
    isScriptLoadSucceed: T.bool,
    onLoad: T.func,
    onError: T.func
  }

  static defaultProps = {
    onLoad: noop,
    onError: noop
  }

  get value () {
    return this.refs.editor.value
  }

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) {
      if (isScriptLoadSucceed) {
        this.initEditor()
      }
      else this.props.onError()
    }
  }

  componentDidMount () {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props
    if (isScriptLoaded && isScriptLoadSucceed) {
      this.initEditor()
    }
  }

  render () {
    return (
      <textarea ref='editor' name="content" data-provide="markdown" rows="15"></textarea>
    )
  }

  initEditor () {
    this.$editor = window.jQuery(this.refs.editor)

    if (this.$editor.data('markdown')) {
      this.$editor.data('markdown').showEditor()
      this.props.onLoad()
      return
    }

    this.$editor.markdown({
      onShow: this.props.onLoad
    })
  }
}

export default Editor
