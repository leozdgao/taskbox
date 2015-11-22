import React, { Component, PropTypes as T } from 'react'
// import scriptLoader from '../ScriptLoader/ScriptLoader'
import scriptLoader from 'react-async-script-loader'
import { newScript, loadAllScript } from '../../utils'
import './bootstrap-markdown.min.css'
import './editor.less'

const noop = () => {}

@scriptLoader([
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.5/marked.min.js'
], '/assets/bootstrap-markdown.js')
class Editor extends Component {

  static propTypes = {
    isScriptLoaded: T.bool,
    isScriptLoadSucceed: T.bool,
    onChange: T.func,
    onBlur: T.func,
    onLoad: T.func,
    onError: T.func
  }

  static defaultProps = {
    onChange: noop,
    onBlur: noop,
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
      <textarea {...this.props} ref='editor' name="content"
        data-provide="markdown" data-iconlibrary="fa"
        rows="15" onBlur={::this.handleBlur}></textarea>
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
      iconlibrary: 'fa',
      onShow: this.props.onLoad,
      onChange: (e) => {
        this.props.onChange(e.getContent())
      }
    })
  }

  handleBlur (e) {
    this.props.onBlur(e.target.value) // handle for redux-form
  }
}

export default Editor
