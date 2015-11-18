import React, { Component, PropTypes as T } from 'react'
import { Link, Lifecycle } from 'react-router'
import { connect } from 'react-redux'
import reactMixin from 'react-mixin'
import { FullScreenPanel, Spinner, EditPostForm } from '../../components'
import { autobind } from '../../utils'
import { PostActions } from '../../redux/modules'
import './newpost.less'

@connect(
  ({ post, form }) => ({ post, form })
)
@reactMixin.decorate(Lifecycle)
@reactMixin.decorate(autobind([ 'routerWillLeave' ]))
class NewPost extends Component {
  static propTypes = {
    form: T.object,
    post: T.object
  }

  static contextTypes = {
    currentUser: T.object
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      editorLoading: true,
      editorLoadFailed: false
    }
  }

  routerWillLeave () {
    const { form: { editPost } } = this.props
    return !editPost.isDirty
  }

  render () {
    const { currentUser: { avatar, name } } = this.context

    return (
      <FullScreenPanel className="newpost">
        <Link to="/doc" className="close"><i className="fa fa-times"></i></Link>
        <div className="container content">
          <div className="profile">
            <div className="circle-img sm-img inline-block"><img src={avatar} /></div>
            <span>
              <b>{name}</b> is writing...
            </span>
          </div>
          <div className="form">
            {this.state.editorLoadFailed ? this._getFailedContent() : (
              <EditPostForm ref="form" onSubmit={::this._handlePublish} onLoad={::this._editorLoaded} onError={::this._editorError} onChange={() => console.log('change')} />
            )}
            {this.state.editorLoading && <Spinner />}
          </div>
        </div>
      </FullScreenPanel>
    )
  }

  _getFailedContent () {
    return (
      <div>
        <a className="btn btn-success" onClick={::this._reload}>Reload</a>
      </div>
    )
  }

  _handlePublish (body) {
    console.log(body)
    // console.log(this.refs.editor.value)
  }

  _editorLoaded () {
    this.setState({
      editorLoading: false,
      editorLoadFailed: false
    })
  }

  _editorError () {
    this.setState({
      editorLoading: false,
      editorLoadFailed: true
    })
  }

  _reload () {
    this.setState({
      editorLoading: true,
      editorLoadFailed: false
    })
  }
}

export default NewPost
