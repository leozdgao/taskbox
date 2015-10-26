import React, { Component, PropTypes as T } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ResourceActions } from '../../redux/modules'
import { Navbar, Sidebar, ScrollPanel } from '../../components'

import './app.less'
import './btn.less'

const msgNum = 3

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
    currentUser: T.object,
    resourceInfo: T.array
  }

  getChildContext () {
    return {
      currentUser: this.props.user,
      resourceInfo: Array.isArray(this.props.resource.data) ? this.props.resource.data : [] // return empty array if error
    }
  }

  static propTypes = {
    children: T.any.isRequired,
    user: T.object,
    loadResource: T.func,
    resource: T.array
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
