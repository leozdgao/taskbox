import React, { Component, PropTypes as T } from 'react'
import IO from 'socket.io-client'
import { connect } from 'react-redux'
import { ResourceActions } from '../../redux/modules'
import { Navbar, Sidebar, ScrollPanel, Spinner } from '../../components'
import { isLeader, isAdmin } from '../../auth'

import './app.less'
import './btn.less'

const msgNum = 3
const socket = IO()
socket.on('error', (e) => {
  console.log('socket error')
})

let loadOnceGlobal = false

function mapStateToProps (state, props) {

  props.location

  const {
    user: { data: currentUser },
    resource: { data: resourceData, isLoading }
  } = state
  const resourceInfo = (resourceData || []).sort((a, b) => a.resourceId - b.resourceId)

  return {
    currentUser: state.user.data || {},
    resourceLoading: isLoading,
    resourceInfo
  }
}

@connect(
  mapStateToProps,
  {
    loadResource: ResourceActions.load
  }
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

  static propTypes = {
    children: T.any.isRequired,
    user: T.object,
    loadResource: T.func,
    resource: T.object
  }

  getChildContext () {
    const { resourceInfo, currentUser } = this.props

    return {
      socket,
      currentUser,
      isLeader: isLeader(currentUser.role),
      isAdmin: isAdmin(currentUser.role),
      resourceInfo
    }
  }

  componentWillReceiveProps (nextProps) {
    this.ensureDataFetch(nextProps)
  }

  componentDidMount () {
    this.ensureDataFetch(this.props)
  }

  render () {
    const { resourceLoading, currentUser } = this.props

    return (
      !resourceLoading ? (
        <div id='page-container'>
          <Navbar user={currentUser} msgNum={msgNum} />
          <Sidebar user={currentUser} />
          <ScrollPanel id='content'>
            {this.props.children}
          </ScrollPanel>
        </div>
      ): <Spinner className="white-bg" />
    )
  }

  ensureDataFetch (props) {
    if (!loadOnceGlobal) {
      loadOnceGlobal = true
      props.loadResource()
    }
  }
}
