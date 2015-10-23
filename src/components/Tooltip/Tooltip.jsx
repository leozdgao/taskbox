import React, { Component, PropTypes as T } from 'react'
import './tooltip.less'

export default class Tooltip extends Component {

  static propTypes = {
    title: T.string,
    component: T.string,
    placement: T.oneOf([ 'left', 'top', 'right', 'bottom' ]),
    children: T.any
  }

  static defaultProps = {
    component: 'span'
  }

  render () {
    const tooltip = this.props.title
      ? <div className='tooltip'>{this.props.title}</div>
      : null

    return React.createElement(
      this.props.component,
      { className: 'tooltip-container' },
      React.Children.only(this.props.children),
      tooltip
    )
  }
}
