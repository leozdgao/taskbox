import React, { Component, PropTypes as T } from 'react'
import { PageHeading, Editor } from '../../components'

class Document extends Component {
  render () {
    return (
      <div>
        <PageHeading title="Documents" breadcrumb={[
          { title: 'Home', link: '/' },
          { title: 'Documents', link: '/doc' }
        ]}/>
        <Editor onLoad={this._editorLoaded} onError={this._editorError} />
      </div>
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
