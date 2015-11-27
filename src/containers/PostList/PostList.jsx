import React, { Component, PropTypes as T } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'
import findWhere from 'lodash/collection/findWhere'
import { Tag, Pagination, dataDependence } from '../../components'
import { Request } from '../../redux/modules'
import { isDefined, resolveProp } from '../../utils'
import './postlist.less'

const { PostModule } = Request
const { actionCreators: PostActionCreators } = PostModule

const mapDep = (props, getState) => {
  const { params } = props
  const page = params.page || 1

  return {
    postList: {
      state: 'request.post.loadPage',
      key: page,
      action: PostActionCreators.loadByPage,
      args: [ page ],
      mapVal: ({ storage: { post } }) => {
        const { page: pageMap, data } = post
        return pageMap[page].map(resolveProp(data))
      }
    },
    count: {
      state: 'request.post.count',
      action: PostActionCreators.count,
      args: [],
      mapVal: ({ storage: { post: { count } } }) => count
    }
  }
}

@dataDependence(mapDep)
class PostList extends Component {

  static contextTypes = {
    resourceInfo: T.array
  }

  static propTypes = {
    params: T.object,
    postList: T.array,
    count: T.number
  }

  state = { // hold count state
    count: 0
  }

  componentWillReceiveProps ({ count }) {
    if (count) this.setState({ count })
  }

  render () {
    const { resourceInfo } = this.context
    const { params: { page = 1 } } = this.props
    const { count } = this.state
    const currentPage = Number(page)
    const pageCount = count && Math.floor(count / PostModule.PAGE_LIMIT) + 1

    const postList = this.props.postList || []

    return (
      <div>
        <Pagination currentPage={currentPage} pageCount={pageCount}
          pageLimit={10} mapLink={(i) => <Link to={`/doc/${i}`}>{i}</Link>} />
        {postList.map((post, i) => {
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
