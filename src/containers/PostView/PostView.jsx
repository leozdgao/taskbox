import React, { Component, PropTypes as T } from 'react'
import { compose } from 'redux'
import ReactDom from 'react-dom'
import { Link, Lifecycle, History } from 'react-router'
import { connect } from 'react-redux'
import reactMixin from 'react-mixin'
import findWhere from 'lodash/collection/findWhere'
import moment from 'moment'
import scriptLoader from 'react-async-script-loader'
import { FullScreenPanel, Spinner, Tag, ScrollPanel, dataDependence } from '../../components'
import { Request } from '../../redux/modules'
import { spreadStatus } from '../../redux/dataFetch'
import { resolvePropByPath } from '../../utils'
import './postview.less'

const { PostModule } = Request
const { actionCreators: PostActionCreators } = PostModule

const mapStateToProps = (state, props) => {
  const { params: { docId } } = props
  const resolveState = resolvePropByPath(state)
  const reqStatus = resolveState('request.post.load')
  const postData = resolveState('storage.post.data')

  return {
    post: {
      val: postData[docId],
      ...spreadStatus(reqStatus, docId)
    }
  }
}

@scriptLoader(
  'https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.5/marked.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.9.1/highlight.min.js'
)
@connect(mapStateToProps, {
  loadPost: PostActionCreators.loadOne
})
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

  state = {
    depLoaded: false
  }

  componentWillReceiveProps (nextProps) {
    const { isScriptLoadSucceed, params: { docId } } = this.props
    const { isScriptLoadSucceed: nextScriptLoadSucceed, params: { docId: nextDocId }  } = nextProps

    if (docId !== nextDocId) {
      this.props.loadPost(nextDocId)
    }

    if (!isScriptLoadSucceed && nextScriptLoadSucceed) {
      this.setState({
        depLoaded: true
      }, () => {
        // after dependencies loaded, hightlight the code
        const codeDomList = ReactDom.findDOMNode(this).querySelectorAll('pre code')
        const codes = Array.prototype.slice.apply(codeDomList)
        codes.forEach((block) => {
          if (window.hljs) { // hightlight.js should already be loaded
            hljs.highlightBlock(block)
          }
        })
      })
    }
  }

  componentDidMount () {
    const { params: { docId } } = this.props
    this.props.loadPost(docId)
  }

  render () {
    const resourceInfo = this.context.resourceInfo
    const { post: postVector } = this.props
    const post = postVector.val
    const author = postVector.fulfilled && post &&
      findWhere(resourceInfo, { _id: post.author }) || {}

    if (postVector.isRejected) {
      return (
        <FullScreenPanel className="postview">
          <h2>Error</h2>
        </FullScreenPanel>
      )
    }

    return (
      <FullScreenPanel className="postview">
        {(postVector.isFulfilled && this.state.depLoaded) ? (
          // render post here
          <ScrollPanel>
            <div className="container">
              <header className="post-header">
                <h1>{post.title}</h1>
                <section className="tag-set">
                  {post.tags.map((tag, i) => <Tag key={i}>{tag}</Tag>)}
                </section>
                <section className="post-info">
                  <img className="circle-img xs-img" src={author.avatar} />
                  <b>{author.name}</b> write on <b>{moment(post.date).format('YYYY-MM-DD')}</b>
                </section>
              </header>
              <section className="post-content" dangerouslySetInnerHTML={{ __html: marked(post.content) }}></section>
            </div>
          </ScrollPanel>
        ) : <Spinner />}
        <a className="close" onClick={::this.history.goBack}><i className="fa fa-times"></i></a>
      </FullScreenPanel>
    )
  }
}

export default PostView
