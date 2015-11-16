import React, { Component, PropTypes as T } from 'react'
import ReactDOM from 'react-dom'
import { Overlay, Transition } from 'react-overlays'
import contains from 'dom-helpers/query/contains'
import { isOneOf, createChainedFunction } from '../../utils'

// react-overlays animation
export const Fade = (props) => {
  const timeout = props.timeout || 300

  return (
    <Transition
      {...props}
      timeout={timeout}
      className="fade"
      enteredClassName="in"
      enteringClassName="in"
      unmountOnExit={false}
      transitionAppear
      in={props.in}
    >
      {props.children}
    </Transition>
  )
}

export default class OverlayTrigger extends Component {
  static propTypes = {
    event: T.oneOf([ 'click', 'hover', 'focus' ]),
    overlay: T.object
  }

  constructor (props) {
    super(props)

    this.handleMouseOver = this.handleMouseOverOut.bind(this, this.handleDelayedShow)
    this.handleMouseOut = this.handleMouseOverOut.bind(this, this.handleDelayedHide)

    this.state = {
      isOverlayShowed: false
    }
  }

  componentDidUpdate () {
    if (this._mountNode) {
      this.renderOverlay()
    }
  }

  componentDidMount () {
    this._mountNode = document.createElement('div')
    this.renderOverlay()
  }

  componentWillUnmount () {
    ReactDOM.unmountComponentAtNode(this._mountNode)
    this._mountNode = null
  }

  render () {
    const { event } = this.props
    const trigger = React.Children.only(this.props.children)
    const triggerProps = trigger.props
    const props = {}

    this._overlay = this._getOverlay()

    props.onClick = createChainedFunction(triggerProps.onClick, this.props.onClick)

    if (isOneOf(event, 'click')) {
      props.onClick = createChainedFunction(this.toggle, props.onClick)
    }

    if (isOneOf(event, 'hover')) {
      props.onMouseOver = createChainedFunction(this.handleMouseOver, this.props.onMouseOver, triggerProps.onMouseOver)
      props.onMouseOut = createChainedFunction(this.handleMouseOut, this.props.onMouseOut, triggerProps.onMouseOut)
    }

    if (isOneOf(event, 'focus')) {
      props.onFocus = createChainedFunction(this.handleDelayedShow, this.props.onFocus, triggerProps.onFocus)
      props.onBlur = createChainedFunction(this.handleDelayedHide, this.props.onBlur, triggerProps.onBlur)
    }

    return React.cloneElement(
      trigger,
      ...props
    )
  }

  renderOverlay () {
    ReactDOM.unstable_renderSubtreeIntoContainer(
      this, this._overlay, this._mountNode
    )
  }

  show () {
    this.setState({ isOverlayShowed: true })
  }

  hide () {
    this.setState({ isOverlayShowed: false })
  }

  toggle () {
    this.setState({ isOverlayShowed: !this.state.isOverlayShowed })
  }

  handleDelayedShow (e, com) {
    if (com.state.isOverlayShowed) return

    com.show()
  }

  handleDelayedHide (e, com) {
    if (!com.state.isOverlayShowed) return

    com.hide()
  }

  _getOverlay () {
    const overlayProps = {
      show: this.state.isOverlayShowed,
      onHide: this.hide,
      target: () => ReactDOM.findDOMNode(this),
      onExit: this.props.onExit,
      onExiting: this.props.onExiting,
      onExited: this.props.onExited,
      onEnter: this.props.onEnter,
      onEntering: this.props.onEntering,
      onEntered: this.props.onEntered,
      in: this.state.isOverlayShowed,

      placement: this.props.placement,
      container: this.props.container,

      transition: Fade
    }

    const overlay = React.cloneElement(this.props.overlay, {
      placement: overlayProps.placement,
      container: overlayProps.container
    })

    return (
      <Overlay {...overlayProps}>
        {this.props.overlay}
      </Overlay>
    )
  }

  // Simple implementation of mouseEnter and mouseLeave.
  // React's built version is broken: https://github.com/facebook/react/issues/4251
  // for cases when the trigger is disabled and mouseOut/Over can cause flicker moving
  // from one child element to another.
  handleMouseOverOut (handler, e) {
    const target = e.currentTarget
    const related = e.relatedTarget || e.nativeEvent.toElement

    if (!related || related !== target && !contains(target, related)) {
      handler(e, this)
    }
  }
}
