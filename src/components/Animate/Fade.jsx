import React, { Component, PropTypes } from 'react'
// import TimeoutTransitionGroup from 'timeout-transition-group'
import TimeoutTransitionGroup from './TimeoutTransitionGroup'

export default class Fade extends Component {

  static propTypes = {
    enterTimeout: PropTypes.number,
    leaveTimeout: PropTypes.number,
    children: PropTypes.any
  }

  static defaultProps = {
    enterTimeout: 500,
    leaveTimeout: 500
  }

  render () {
    return (
      <TimeoutTransitionGroup
        enterTimeout={this.props.enterTimeout}
        leaveTimeout={this.props.leaveTimeout}
        transitionName='fade'>
        {this.props.children}
      </TimeoutTransitionGroup>
    )
  }
}
