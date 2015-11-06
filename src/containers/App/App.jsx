import React, { Component, PropTypes as T } from 'react'
import IO from 'socket.io-client'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ResourceActions } from '../../redux/modules'
import { Navbar, Sidebar, ScrollPanel } from '../../components'

import './app.less'
import './btn.less'

const msgNum = 3
const socket = IO()
socket.on('error', (e) => {
  console.log('socket error')
})

@connect(
  state => ({
    user: state.user,
    resource: state.resource
  }),
  dispatch => ({
    ...bindActionCreators({
      loadResource: ResourceActions.load
    }, dispatch)
  })
)
export default class Main extends Component {

  // define global state
  static childContextTypes = {
    socket: T.object,
    currentUser: T.object,
    resourceInfo: T.array,
    isAdmin: T.bool,
    isLeader: T.bool
  }

  getChildContext () {
    const resourceInfo = Array.isArray(this.props.resource.data) ?
      this.props.resource.data.sort((a, b) => a.resourceId - b.resourceId) : [] // return empty array if error

    return {
      socket,
      currentUser: this.props.user,
      isLeader: this.props.user.role > 1,
      isAdmin: this.props.user.role < 0,
      resourceInfo
    }
  }

  static propTypes = {
    children: T.any.isRequired,
    user: T.object,
    loadResource: T.func,
    resource: T.object
  }

  componentDidMount () {
    this.props.loadResource()
  }

  render () {
    return (
      <div id='page-container'>
        <Navbar user={this.props.user} msgNum={msgNum} />
        <Sidebar user={this.props.user} />
        <ScrollPanel id='content'>
          {React.cloneElement(this.props.children, { ...this.props })}
        </ScrollPanel>
      </div>
    )
  }
}
