import React, { Component, PropTypes } from 'react'
import cNames from 'classnames'
import Styles from './scrollpanel.less'

export default class ScrollPanel extends Component {

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.any
  }

  constructor (props) {
    super(props)

    this.state = {
      position: {
        top: 0, left: 0
      }
    }
  }

  render () {
    const { scrollpanel } = Styles

    return (
      <div className={cNames(scrollpanel, this.props.className)} onWheel={this._handleWheel.bind(this)}>
        <div style={this.state.position}>
          {this.props.children}
        </div>
      </div>
    )
  }

  _handleWheel (e) {
    console.log('wheel')
    console.log(e.deltaX)
    console.log(e.deltaY)
    console.log(e.deltaZ)
    console.log(e.deltaMode)
  }
}
