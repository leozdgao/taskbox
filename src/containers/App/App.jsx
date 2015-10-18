import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Navbar, Sidebar, ScrollPanel } from '../../components'

import './app.less'

const msgNum = 3

@connect(
  state => ({
    user: state.user
  })
)
export default class Main extends Component {

  static propTypes = {
    children: PropTypes.any.isRequired,
    user: PropTypes.object
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
