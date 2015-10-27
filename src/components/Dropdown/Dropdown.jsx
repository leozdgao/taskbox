import React, { Component, PropTypes as T } from 'react'
import Animate from '../Animate/Animate'

export default class Dropdown extends Component {

  static propTypes = {
    open: T.bool,
    onHide: T.func,
    animateName: T.string,
    leaveTimeout: T.number,
    enterTimeout: T.number,
    transitionTimeout: T.number,
    children: T.any
  }

  static defaultProps = {
    open: false,
    onHide: () => {}
  }

  componentDidMount () {
    this._handler = ::this._handleClick
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.open && !this.props.open) document.addEventListener('click', this._handler)
    if (!nextProps.open && this.props.open) document.removeEventListener('click', this._handler)
  }

  render () {
    const child = this.props.open ? this.props.children : null
    const { animateName, enterTimeout, leaveTimeout, transitionTimeout } = this.props

    if (animateName) {
      return (
        <Animate name={animateName}
          enterTimeout={enterTimeout || transitionTimeout}
          leaveTimeout={leaveTimeout || transitionTimeout}>
          {child}
        </Animate>
      )
    }
    else return child
  }

  _handleClick () {
    if (this.props.open) this.props.onHide()
  }
}
