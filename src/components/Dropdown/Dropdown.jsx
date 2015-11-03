import React, { Component, PropTypes as T } from 'react'
import ReactDOM from 'react-dom'
import contains from 'dom-helpers/query/contains'
import Animate from '../Animate/Animate'

export default class Dropdown extends Component {

  static propTypes = {
    open: T.bool,
    onHide: T.func,
    animateName: T.string,
    leaveTimeout: T.number,
    enterTimeout: T.number,
    transitionTimeout: T.number,
    children: T.any,
    notHideIfClickEntry: T.bool
  }

  static defaultProps = {
    open: false,
    onHide: () => {},
    notHideIfClickEntry: false
  }

  componentDidMount () {
    this._handler = ::this._handleClick
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.open && !this.props.open) document.addEventListener('click', this._handler, true)
    if (!nextProps.open && this.props.open) document.removeEventListener('click', this._handler, true)
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

  _handleClick (e) {
    if (this.props.open) {
      const dropdown = ReactDOM.findDOMNode(this)

      if (this.props.notHideIfClickEntry &&
        contains(dropdown, e.target)) {
        return
      }

      this.props.onHide()
    }
  }

  _collectOnClickHandler (children, ret = []) {
    React.Children.forEach(children, (child) => {
      if (child.props.children) ret = this._collectOnClickHandler(child.props.children, ret)

      if (child.props.onClick) ret.push(child.props.onClick)
    })

    return ret
  }
}
