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
import './postview.less'

const { PostModule } = Request
const { actionCreators: PostActionCreators } = PostModule

const mapDep = (props) => {
  const { params: { docId } } = props

  return {
    post: {
      state: 'request.post.load',
      key: docId,
      action: PostActionCreators.loadOne,
      args: [ docId ],
      mapVal: ({ storage: { post } }) => {
        const { data } = post
        return data[docId]
      }
    }
  }
}

const decorate = compose(
  scriptLoader(
    'https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.5/marked.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.9.1/highlight.min.js'
  ),
  dataDependence(mapDep),
  reactMixin.decorate(History)
)

@decorate
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
    const { isScriptLoadSucceed } = this.props
    const { isScriptLoadSucceed: nextScriptLoadSucceed } = nextProps

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

  render () {
    const resourceInfo = this.context.resourceInfo
    // const post = this.state.data
    const { post } = this.props
    const isLoaded = post != null
    const author = isLoaded && findWhere(resourceInfo, { _id: post.author }) || {}

    return (
      <FullScreenPanel className="postview">
        {(isLoaded && this.state.depLoaded) ? (
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
