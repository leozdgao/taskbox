import React, { Component, PropTypes as T } from 'react'
import { Editor } from '../../components'

class Document extends Component {
  render () {
    return (
      <Editor onLoad={this._editorLoaded} onError={this._editorError} />
    )
  }

  _editorLoaded () {
    console.log('load')
  }

  _editorError () {
    console.log('error')
  }
}

export default Document
