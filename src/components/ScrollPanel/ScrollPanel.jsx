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
      top: 0, left: 0
    }
  }

  render () {
    const { scrollpanel } = Styles

    return (
      <div className={cNames(scrollpanel, this.props.className)} onWheel={this._handleWheel.bind(this)}>
        <div ref='content' style={this.state}>
          {this.props.children}
        </div>
      </div>
    )
  }

  getContentHeight () {

  }

  getPanelHeight () {

  }

  _handleWheel (e) {
    console.log('wheel')
    console.log(e.deltaX)
    console.log(e.deltaY)
    console.log(e.deltaZ)
    console.log(e.deltaMode)

    // need scrollbar
    if (e.deltaY && this.getContentHeight() > this.getPanelHeight()) {
      this.setState({ top: this.state.top + e.deltaY, left: this.state.left })
    }
  }
}
