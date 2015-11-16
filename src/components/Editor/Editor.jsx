import React, { Component, PropTypes as T } from 'react'
import { newScript, loadAllScript } from '../../utils'
import './bootstrap-markdown.min.css'

const noop = () => {}
let vendorLoaded  = false

class Editor extends Component {

  static propTypes = {
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

  componentDidMount () {
    if (!vendorLoaded) this.loadVendorScript(this.configEditor)
    else {
      this.$editor = window.jQuery(this.refs.editor)
      this.initEditor()
    }
  }

  render () {
    return (
      <textarea ref='editor' name="content" data-provide="markdown" rows="15"></textarea>
    )
  }

  initEditor () {
    if (vendorLoaded && this.$editor != null) {
      if (this.$editor.data('markdown')) {
        this.$editor.data('markdown').showEditor()
        return
      }

      this.configEditor(this.$editor)
    }
  }

  loadVendorScript (callback) {
    loadAllScript([
      newScript(
        'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js'
      ),
      newScript(
        'https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.5/marked.min.js'
      )
    ], () => {
      newScript('/assets/bootstrap-markdown.js', () => {
        vendorLoaded = true
        callback.bind(this)(window.jQuery(this.refs.editor))
      })
    }, (isSucceed) => {
      if (!isSucceed) this.props.onError()
    })
  }

  configEditor ($editor) {
    const { props } = this
    $editor.markdown({
      onShow: props.onLoad
    })
  }
}

export default Editor
