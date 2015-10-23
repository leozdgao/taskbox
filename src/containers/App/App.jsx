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
    user: state.user
  }),
  dispatch => ({
    ...bindActionCreators({
      loadResource: ResourceActions.load
    }, dispatch)
  })
)
export default class Main extends Component {

  static propTypes = {
    children: PropTypes.any.isRequired,
    user: PropTypes.object,
    loadResource: PropTypes.func
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
