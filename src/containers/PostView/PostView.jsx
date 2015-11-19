import React, { Component, PropTypes as T } from 'react'
import { Link, Lifecycle, History } from 'react-router'
import { connect } from 'react-redux'
import reactMixin from 'react-mixin'
import { FullScreenPanel, Spinner } from '../../components'
import { PostActions } from '../../redux/modules'

@connect(
  ({ post }) => ({ post }),
  {
    loadPost: PostActions.loadOne
  }
)
@reactMixin.decorate(History)
class PostView extends Component {

  static propTypes = {
    params: T.object,
    post: T.object,
    loadPost: T.func
  }

  constructor (props, context) {
    super(props, context)

    const { params, post: { data: postData } } = this.props
    const id = params.docId
    const data = postData[id]

    this.state = {
      data: data || {},
      isLoading: data == null // load post if it not exist in store
    }
  }

  componentDidMount () {
    const { loadPost, params } = this.props

    if (this.state.isLoading) {
      loadPost(params.docId)
    }
  }

  render () {
    return (
      <FullScreenPanel className="postview">
        <a className="close" onClick={::this.history.goBack}><i className="fa fa-times"></i></a>
        {this.state.isLoading ? <Spinner /> : (
          // render post here
          <div></div>
        )}
      </FullScreenPanel>
    )
  }
}

export default PostView
