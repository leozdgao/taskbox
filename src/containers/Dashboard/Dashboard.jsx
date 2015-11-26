import React, { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'
import { dataDependence } from '../../components'
import { ChatActions } from '../../redux/modules'
import { isDefined } from '../../utils'

@dataDependence((props, getState) => {
  // const postId = props.params.pid
  const postId = "5650379082b6427c0bd84fdd"
  // const { post: { data } } = state
  return {
    post: {
      state: 'chat.load',
      key: postId,
      action: ChatActions.loadOne,
      args: [ postId ],
      mapVal: ({ post: { data } }) => ({ name: 'OK' })
    }
  }
})
export default class Dashboard extends Component {

  componentDidMount () {
    // console.log('mount');
    // this.props.load('123')
  }

  render () {
    const { post } = this.props
    const loaded = isDefined(post)
    const error = loaded && post.error

    return (
      <div className="page-header">
        Dashboard
        <p>{error && 'Error'}</p>
        <p>{loaded && !error && post.name}</p>
      </div>
    )
  }
}
