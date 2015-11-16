import React, { Component, PropTypes as T } from 'react'
import cNames from 'classnames'
import './fullscreen.less'

class FullScreenPanel extends Component {
  static propTypes = {
    className: T.string,
    onHide: T.func,
    children: T.any
  }

  contructor (props, context) {
    super(props, context)
  }

  render () {
    return (
      <div {...this.props} className={cNames([ 'fullscreen', this.props.className ])}>
        {this.props.children}
      </div>
    )
  }
}

export default FullScreenPanel
