import React, { Component, PropTypes as T } from 'react'
import cNames from 'classnames'
import './tooltip.less'

export default class Tooltip extends Component {

  static propTypes = {
    placement: T.oneOf([ 'left', 'top', 'right', 'bottom' ]),
    className: T.string,
    children: T.any,
    style: T.object
  }

  render () {
    return (
      <div style={this.props.style} className={cNames([ 'tooltip', this.props.className, this.props.placement ])}>
        <div className='tooltip-arrow'></div>
        <div className='tooltip-inner'>{this.props.children}</div>
      </div>
    )
  }
}
