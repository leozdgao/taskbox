import React, { Component, PropTypes as T } from 'react'
import Portal from '../Portal/Portal'
import cNames from 'classnames'
import Fade from '../Animate/Fade'
import './modal.less'

export default class Modal extends Component {

  static propTypes = {
    isShowed: T.bool.isRequired,
    dimmerClassName: T.string,
    modalClassName: T.string,
    transitionTimeout: T.number,
    enterTimeout: T.number,
    leaveTimeout: T.number,
    children: T.any
  }

  render () {
    if (this._needTransition()) {
      const enterTimeout = this.props.enterTimeout || this.props.transitionTimeout
      const leaveTimeout = this.props.leaveTimeout || this.props.transitionTimeout

      return (
        <Portal>
          <Fade enterTimeout={enterTimeout} leaveTimeout={leaveTimeout}>
            {this.props.isShowed ? this._getModal() : null}
          </Fade>
        </Portal>
      )
    }
    else {
      return this.props.isShowed ? <Portal>{this._getModal()}</Portal> : null
    }
  }

  _getModal () {
    return (
      <div className={this.props.dimmerClassName}>
        <div className={this.props.modalClassName}>
          {this.props.children}
        </div>
      </div>
    )
  }

  _needTransition () {
    return !!(this.props.transitionTimeout || this.props.enterTimeout || this.props.leaveTimeout)
  }
}
