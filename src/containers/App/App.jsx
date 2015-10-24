import React, { Component, PropTypes } from 'react'
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
    currentUser: PropTypes.object,
    resourceInfo: PropTypes.array
  }

  getChildContext () {
    return {
      currentUser: this.props.user,
      resourceInfo: Array.isArray(this.props.resource) ? this.props.resource : [] // may error obj
    }
  }

  static propTypes = {
    children: PropTypes.any.isRequired,
    user: PropTypes.object,
    loadResource: PropTypes.func,
    resource: PropTypes.array
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
