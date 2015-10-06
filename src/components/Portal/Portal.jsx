import React, { Component, PropTypes as T } from 'react'
import { findDOMNode, unmountComponentAtNode, render } from 'react-dom'
import mountable from './mountable'

const ownerDocument = (ele) => {
  const node = findDOMNode(ele)
  return node && node.ownerDocument || document
}

const getContainer = (container, defaultContainer) => {
  container = typeof container === 'function' ? container() : container
  return findDOMNode(container) || defaultContainer
}

export default class Portal extends Component {
  static propTypes = {
    container: T.oneOfType([
      mountable,
      T.func
    ]),
    children: T.any
  }

  componentDidMount () {
    this._renderOverlay()
  }

  componentDidUpdate () {
    this._renderOverlay()
  }

  componentWillUnmount () {
    this._unrenderOverlay()
    this._unmountOverlayTarget()
  }

  _mountOverlayTarget () {
    if (!this._overlayTarget) {
      this._overlayTarget = document.createElement('div')
      this.getContainerDOMNode().appendChild(this._overlayTarget)
    }
  }

  _unmountOverlayTarget () {
    if (this._overlayTarget) {
      this.getContainerDOMNode().removeChild(this._overlayTarget)
      this._overlayTarget = null
    }
  }

  _renderOverlay () {

    const overlay = !this.props.children
      ? null
      : React.Children.only(this.props.children)

    // Save reference for future access.
    if (overlay !== null) {
      this._mountOverlayTarget()
      this._overlayInstance = render(overlay, this._overlayTarget)
    } else {
      // Unrender if the component is null for transitions to null
      this._unrenderOverlay()
      this._unmountOverlayTarget()
    }
  }

  _unrenderOverlay () {
    if (this._overlayTarget) {
      unmountComponentAtNode(this._overlayTarget)
      this._overlayInstance = null
    }
  }

  render () {
    return null
  }

  getMountNode () {
    return this._overlayTarget
  }

  getOverlayDOMNode () {
    if (!this.isMounted()) {
      throw new Error('getOverlayDOMNode(): A component must be mounted to have a DOM node.')
    }

    if (this._overlayInstance) {
      if (this._overlayInstance.getWrappedDOMNode) {
        return this._overlayInstance.getWrappedDOMNode()
      } else {
        return findDOMNode(this._overlayInstance)
      }
    }

    return null
  }

  getContainerDOMNode () {
    return getContainer(this.props.container, ownerDocument(this).body)
  }
}
