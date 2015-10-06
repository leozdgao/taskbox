/**
 * The CSSTransitionGroup component uses the 'transitionend' event, which
 * browsers will not send for any number of reasons, including the
 * transitioning node not being painted or in an unfocused tab.
 *
 * This TimeoutTransitionGroup instead uses a user-defined timeout to determine
 * when it is a good time to remove the component. Currently there is only one
 * timeout specified, but in the future it would be nice to be able to specify
 * separate timeouts for enter and leave, in case the timeouts for those
 * animations differ. Even nicer would be some sort of inspection of the CSS to
 * automatically determine the duration of the animation or transition.
 *
 * This is adapted from Facebook's CSSTransitionGroup which is in the React
 * addons and under the Apache 2.0 License.
 */

import React, { Component, PropTypes as T } from 'react'
import { findDOMNode } from 'react-dom'
import ReactTransitionGroup from 'react-addons-transition-group'

const TICK = 17

/**
 * EVENT_NAME_MAP is used to determine which event fired when a
 * transition/animation ends, based on the style property used to
 * define that event.
 */
const EVENT_NAME_MAP = {
  transitionend: {
    'transition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'mozTransitionEnd',
    'OTransition': 'oTransitionEnd',
    'msTransition': 'MSTransitionEnd'
  },
  animationend: {
    'animation': 'animationend',
    'WebkitAnimation': 'webkitAnimationEnd',
    'MozAnimation': 'mozAnimationEnd',
    'OAnimation': 'oAnimationEnd',
    'msAnimation': 'MSAnimationEnd'
  }
}

const endEvents = []

;(function detectEvents () {
  if (typeof window === 'undefined') {
    return
  }

  const testEl = document.createElement('div')
  const style = testEl.style

  // On some platforms, in particular some releases of Android 4.x, the
  // un-prefixed "animation" and "transition" properties are defined on the
  // style object but the events that fire will still be prefixed, so we need
  // to check if the un-prefixed events are useable, and if not remove them
  // from the map
  if (!('AnimationEvent' in window)) {
    delete EVENT_NAME_MAP.animationend.animation
  }

  if (!('TransitionEvent' in window)) {
    delete EVENT_NAME_MAP.transitionend.transition
  }

  for (const baseEventName in EVENT_NAME_MAP) {
    if (EVENT_NAME_MAP.hasOwnProperty(baseEventName)) {
      const baseEvents = EVENT_NAME_MAP[baseEventName]
      for (const styleName in baseEvents) {
        if (styleName in style) {
          endEvents.push(baseEvents[styleName])
          break
        }
      }
    }
  }
}())

function animationSupported () {
  return endEvents.length !== 0
}

/*
 * Functions for element class management to replace dependency on jQuery
 * addClass, removeClass and hasClass
 */
function addClass (element, className) {
  if (element.classList) {
    element.classList.add(className)
  } else if (!hasClass(element, className)) {
    element.className = element.className + ' ' + className
  }
  return element
}

function removeClass (element, className) {
  if (hasClass(className)) {
    if (element.classList) {
      element.classList.remove(className)
    } else {
      element.className = (' ' + element.className + ' ')
          .replace(' ' + className + ' ', ' ').trim()
    }
  }
  return element
}

function hasClass (element, className) {
  if (element.classList) {
    return element.classList.contains(className)
  } else {
    return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1
  }
}

class TimeoutTransitionGroupChild extends Component {

  static displayName = 'TimeoutTransitionGroupChild'

  transition (animationType, finishCallback) {
    const node = findDOMNode(this)
    const className = this.props.name + '-' + animationType
    const activeClassName = className + '-active'

    function endListener () {
      removeClass(node, className)
      removeClass(node, activeClassName)

      // Usually this optional callback is used for informing an owner of
      // a leave animation and telling it to remove the child.
      if (finishCallback) {
        finishCallback()
      }
    }

    if (!animationSupported()) {
      endListener()
    } else if (animationType === 'appear') {
      this.animationTimeout = setTimeout(endListener, this.props.appearTimeout)
    } else if (animationType === 'enter') {
      this.animationTimeout = setTimeout(endListener, this.props.enterTimeout)
    } else if (animationType === 'leave') {
      this.animationTimeout = setTimeout(endListener, this.props.leaveTimeout)
    }

    addClass(node, className)

    // Need to do this to actually trigger a transition.
    this.queueClass(activeClassName)
  }

  queueClass (className) {
    this.classNameQueue.push(className)

    if (!this.timeout) {
      this.timeout = setTimeout(::this.flushClassNameQueue, TICK)
    }
  }

  flushClassNameQueue () {
    if (this._mounted) {
      this.classNameQueue.forEach((name) => {
        addClass(findDOMNode(this), name)
      })
    }
    this.classNameQueue.length = 0
    this.timeout = null
  }

  componentWillMount () {
    this.classNameQueue = []
  }

  componentDidMount () {
    this._mounted = true
  }

  componentWillUnmount () {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout)
    }

    this._mounted = false
  }

  componentWillAppear (done) {
    if (this.props.appear) {
      this.transition('appear', done)
    } else {
      done()
    }
  }

  componentWillEnter (done) {
    if (this.props.enter) {
      this.transition('enter', done)
    } else {
      done()
    }
  }

  componentWillLeave (done) {
    if (this.props.leave) {
      this.transition('leave', done)
    } else {
      done()
    }
  }

  render () {
    return React.Children.only(this.props.children)
  }
}

class TimeoutTransitionGroup extends Component {
  static displayName = 'TimeoutTransitionGroup'

  static propTypes = {
    enterTimeout: T.number.isRequired,
    leaveTimeout: T.number.isRequired,
    appearTimeout: T.number,
    transitionName: T.string.isRequired,
    transitionEnter: T.bool,
    transitionLeave: T.bool,
    transitionAppear: T.bool
  }

  static defaultProps = {
    transitionEnter: true,
    transitionLeave: true,
    transitionAppear: false
  }

  _wrapChild (child) {
    return (
      <TimeoutTransitionGroupChild
        appearTimeout={this.props.appearTimeout}
        enterTimeout={this.props.enterTimeout}
        leaveTimeout={this.props.leaveTimeout}
        name={this.props.transitionName}
        enter={this.props.transitionEnter}
        leave={this.props.transitionLeave}
        appear={this.props.transitionAppear}>
        {child}
      </TimeoutTransitionGroupChild>
    )
  }

  render () {
    return (
      <ReactTransitionGroup childFactory={::this._wrapChild} {...this.props} />
    )
  }
}

export default TimeoutTransitionGroup
