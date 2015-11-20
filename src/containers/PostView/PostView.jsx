import React, { Component, PropTypes as T } from 'react'
import { Link, Lifecycle, History } from 'react-router'
import { connect } from 'react-redux'
import reactMixin from 'react-mixin'
import findWhere from 'lodash/collection/findWhere'
import moment from 'moment'
import scriptLoader from 'react-async-script-loader'
import { FullScreenPanel, Spinner, Tag, ScrollPanel } from '../../components'
import { PostActions } from '../../redux/modules'
import './postview.less'

@scriptLoader(
  'https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.5/marked.min.js'
)
@connect(
  ({ post }) => ({ post }),
  {
    loadPost: PostActions.loadOne
  }
)
@reactMixin.decorate(History)
class PostView extends Component {

  static contextTypes = {
    resourceInfo: T.array
  }

  static propTypes = {
    params: T.object,
    post: T.object,
    loadPost: T.func,
    isScriptLoadSucceed: T.bool
  }

  constructor (props, context) {
    super(props, context)

    const { params, post: { data: postData } } = this.props
    const id = params.docId
    const data = postData[id]

    this.state = {
      depLoaded: false,
      data: data || {},
      isLoading: data == null // load post if it not exist in store
    }
  }

  componentWillReceiveProps (nextProps) {
    const { post, params: { docId } } = this.props
    const { post: nextPost } = nextProps

    if (post.isLoading && !nextPost.isLoading) {
      const { data: postData } = nextPost
      this.setState({
        isLoading: false,
        data: postData[docId]
      })
    }
    if (!post.isLoading && nextPost.isLoading) {
      this.setState({
        isLoading: true,
        data: {}
      })
    }

    const { isScriptLoadSucceed } = this.props
    const { isScriptLoadSucceed: nextScriptLoadSucceed } = nextProps

    if (!isScriptLoadSucceed && nextScriptLoadSucceed) {
      this.setState({
        depLoaded: true
      })
    }
  }

  componentDidMount () {
    const { loadPost, params } = this.props

    if (this.state.isLoading) {
      loadPost(params.docId)
    }
  }

  render () {
    const resourceInfo = this.context.resourceInfo
    const post = this.state.data
    const author = findWhere(resourceInfo, { _id: post.author }) || {}

    return (
      <FullScreenPanel className="postview">
        <a className="close" onClick={::this.history.goBack}><i className="fa fa-times"></i></a>
        {(!this.state.isLoading && this.state.depLoaded) ? (
          // render post here
          <ScrollPanel>
            <div className="container">
              <header className="post-header">
                <h1>{post.title}</h1>
                <section className="tag-set">
                  {post.tags.map((tag, i) => <Tag key={i}>{tag}</Tag>)}
                </section>
                <section>
                  <img className="circle-img xs-img" src={author.avatar} />
                  <b>{author.name}</b> write on <b>{moment(post.date).format('YYYY-MM-DD')}</b>
                </section>
              </header>
              <section dangerouslySetInnerHTML={{ __html: marked(post.content) }}></section>
            </div>
          </ScrollPanel>
        ) : <Spinner />}
      </FullScreenPanel>
    )
  }
}

export default PostView
