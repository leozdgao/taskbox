import React, { Component, PropTypes as T } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'
import findWhere from 'lodash/collection/findWhere'
import { Tag, Pagination } from '../../components'
import { PostActions } from '../../redux/modules'
import { isDefined, resolveProp } from '../../utils'
import './postlist.less'

@connect(
  ({ post }) => ({ post }),
  {
    loadPostByPage: PostActions.loadByPage,
    loadPostCount: PostActions.count
  }
)
class PostList extends Component {

  static contextTypes = {
    resourceInfo: T.array
  }

  static propTypes = {
    params: T.object,
    post: T.object,
    loadPostByPage: T.func,
    loadPostCount: T.func
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      pageLoading: true,
      postList: [],
      postCount: 1
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
      if (post.count !== nextPost.count) {
        this.setState({
          postCount: nextPost.count
        })
      }
    }
  }

  componentDidMount () {
    const { params } = this.props
    this.props.loadPostByPage(params.page || 1)
    this.props.loadPostCount()
  }

  render () {
    const { resourceInfo } = this.context
    const { params: { page = 1 } } = this.props

    const currentPage = Number(page)
    const pageCount = Math.floor(this.state.postCount / PostActions.PAGE_LIMIT) + 1

    return (
      <div>
        <Pagination currentPage={currentPage} pageCount={pageCount}
          pageLimit={10} mapLink={(i) => <Link to={`/doc/${i}`}>{i}</Link>} />
        {this.state.postList.map((post, i) => {
          const author = findWhere(resourceInfo, { _id: post.author }) || {}
          return (
            <div className="post-item" key={i}>
              <div className="post-title">
                <Link to={`/doc/p/${post._id}`}>{post.title}</Link>
                {post.tags.map((tag, i) => <Tag key={i}>{tag}</Tag>)}
              </div>
              <div className="post-info">
                <img className="circle-img xs-img" src={author.avatar} />
                <b>{author.name}</b> published on <b>{moment(post.date).format('YYYY-MM-DD')}</b>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default PostList
