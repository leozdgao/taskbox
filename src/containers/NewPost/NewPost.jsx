import React, { Component, PropTypes as T } from 'react'
import { Link, Lifecycle, History } from 'react-router'
import { connect } from 'react-redux'
import reactMixin from 'react-mixin'
import { FullScreenPanel, Spinner, EditPostForm, ConfirmLeaveModal } from '../../components'
import { autobind, resolvePropByPath } from '../../utils'
import { Request } from '../../redux/modules'
import { spreadStatus } from '../../redux/dataFetch'
import './newpost.less'

const { PostModule } = Request
const { actionCreators: PostActionCreators } = PostModule

const mapStateToProps = state => {
  const resolveState = resolvePropByPath(state)
  const reqStatus = resolveState('request.post.create')

  return {
    publishStatus: spreadStatus(reqStatus),
    editPostIsDirty: state.form.editPost.isDirty,
    lastPublishedPostId: resolveState('storage.post.lastPublishedPostId')
  }
}

@connect(
  mapStateToProps,
  {
    publishPost: PostActionCreators.publish
  }
)
@reactMixin.decorate(Lifecycle)
@reactMixin.decorate(History)
@reactMixin.decorate(autobind([ 'routerWillLeave' ]))
class NewPost extends Component {

  static propTypes = {
    publishPost: T.func,
    editPostIsDirty: T.bool,
    publishStatus: T.object
  }

  static contextTypes = {
    currentUser: T.object
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      editorLoading: true,
      editorLoadFailed: false,
      modalShowed: false
    }
  }

  routerWillLeave () {
    const { editPostIsDirty } = this.props
    const cantLeave = editPostIsDirty && !this._confirmToLeave
    if (cantLeave) {
      this.setState({
        modalShowed: true
      })
    }

    return !cantLeave
  }

  componentWillReceiveProps (nextProps) {
    const { publishStatus } = this.props
    const { publishStatus:nextPublishStatus, lastPublishedPostId } = nextProps

    if (publishStatus.isPending && nextPublishStatus.isFulfilled) {
      this._confirmToLeave = true
      this.history.pushState(null, `/doc/p/${lastPublishedPostId}`)
    }
  }

  render () {
    const { currentUser: { avatar, name } } = this.context
    const { publishStatus } = this.props

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
                <EditPostForm ref="form" isRequesting={publishStatus.isPending}
                  onSubmit={::this._handlePublish} onLoad={::this._editorLoaded}
                  onError={::this._editorError} />
                {publishStatus.isRejected && (
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
    const { publishStatus } = this.props

    if (!publishStatus.isPending) {
      const { currentUser } = this.context
      body.author = currentUser._id // populate author to current user
      this.props.publishPost(body)
    }
  }


  // handle editor load
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
