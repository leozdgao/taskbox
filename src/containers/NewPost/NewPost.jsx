import React, { Component, PropTypes as T } from 'react'
import { Link, Lifecycle, History } from 'react-router'
import { connect } from 'react-redux'
import reactMixin from 'react-mixin'
import { FullScreenPanel, Spinner, EditPostForm, ConfirmLeaveModal } from '../../components'
import { autobind } from '../../utils'
import { PostActions } from '../../redux/modules'
import './newpost.less'

@connect(
  ({ post, form }) => ({ post, form }),
  { publishPost: PostActions.publish }
)
@reactMixin.decorate(Lifecycle)
@reactMixin.decorate(History)
@reactMixin.decorate(autobind([ 'routerWillLeave' ]))
class NewPost extends Component {

  static propTypes = {
    form: T.object,
    post: T.object,
    publishPost: T.func
  }

  static contextTypes = {
    currentUser: T.object
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      editorLoading: true,
      editorLoadFailed: false,
      postPublishing: false,
      postPublishError: false,
      modalShowed: false
      // confirmToLeave: false
    }
  }

  routerWillLeave () {
    const { form: { editPost } } = this.props
    const cantLeave = editPost.isDirty && !this._confirmToLeave
    if (cantLeave) {
      this.setState({
        modalShowed: true
      })
    }

    return !cantLeave
  }

  componentWillReceiveProps (nextProps) {
    const { post: { isPublishing } } = this.props
    const { post: nextPost } = nextProps

    if (isPublishing && !nextPost.isPublishing) { // finish publish
      if (nextPost.lastPublishingError) {
        this.setState({
          postPublishing: false,
          postPublishError: true
        })
      }
      else {
        // go to view the new post
        const postId = nextPost.lastPublishedPostId
        if (postId) {
          this._confirmToLeave = true
          this.history.pushState(null, `/doc/p/${postId}`)
        }
      }
    }
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
              <div>
                <EditPostForm ref="form" isRequesting={this.state.postPublishing}
                  onSubmit={::this._handlePublish} onLoad={::this._editorLoaded}
                  onError={::this._editorError} />
                {this.state.postPublishError && (
                  <div className="block text-danger pbt-10">Publish failed, please try again later.</div>
                )}
              </div>
            )}
            {this.state.editorLoading && <Spinner />}
          </div>
        </div>
        <ConfirmLeaveModal isShowed={this.state.modalShowed}
          onHide={() => this.setState({ modalShowed: false })}
          onSubmit={::this._confirmLeave} />
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
    this.setState({
      postPublishing: true,
      postPublishError: false
    })

    if (!this.state.postPublishing) {
      const { currentUser } = this.context
      body.author = currentUser._id // populate author to current user
      this.props.publishPost(body)
    }
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

  _confirmLeave () {
    this._confirmToLeave = true
    this.history.goBack()
  }
}

export default NewPost
