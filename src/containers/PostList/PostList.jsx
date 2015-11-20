import React, { Component, PropTypes as T } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { PostActions } from '../../redux/modules'
import { isDefined, resolveProp } from '../../utils'

@connect(
  ({ post }) => ({ post }),
  {
    loadPostByPage: PostActions.loadByPage
  }
)
class PostList extends Component {

  static propTypes = {
    params: T.object,
    post: T.object,
    loadPostByPage: T.func
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      pageLoading: true,
      postList: []
    }
  }

  componentWillReceiveProps (nextProps) {
    const { params } = this.props
    const { params: nextParams } = nextProps
    const currentPage = Number(params.page || 1)
    const nextPage = Number(nextParams.page || 1)

    if (isNaN(currentPage) || isNaN(nextPage)) return

    // page updated, need reload post
    if (currentPage !== nextPage) {
      this.props.loadPostByPage(nextPage)
    }
    else { // page not change, load state change
      const { post } = this.props
      const { post: nextPost } = nextProps

      if (post.isLoading && !nextPost.isLoading) {
        const { data: postData, page: postPageMap } = nextPost
        const postIds = postPageMap[currentPage]
        this.setState({
          pageLoading: false,
          postList: postIds.map(resolveProp(postData))
        })
      }
      if (!post.isLoading && nextPost.isLoading) {
        this.setState({
          pageLoading: true,
          postList: []
        })
      }
    }
  }

  componentDidMount () {
    const { params } = this.props
    this.props.loadPostByPage(params.page || 1)
  }

  render () {
    return (
      <div>
        {this.state.postList.map((post, i) => {
          return (
            <div key={i}><Link to={`/doc/p/${post._id}`}>{post.title}</Link></div>
          )
        })}
      </div>
    )
  }
}

export default PostList
