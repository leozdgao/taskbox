import React, { Component, PropTypes as T } from 'react'
import cNames from 'classnames'
import Modal from './Modal'

class ModalWrapper extends Component {
  static propTypes = {
    isShowed: T.bool,
    className: T.string,
    children: T.any
  }

  render () {
    return (
      <Modal isShowed={this.props.isShowed}
        animateName='modalFade' transitionTimeout={500}
        dimmerClassName='modal-dimmer' modalClassName={cNames([ 'modal-dialog', this.props.className ])}>
        <div className="modal-content">
          {this.props.children}
        </div>
      </Modal>
    )
  }
}

ModalWrapper.Header = (props) => <div {...props} className={cNames([ "modal-header", props.className ])} />
ModalWrapper.Content = (props) => <div {...props} className={cNames([ "modal-body", props.className ])} />
ModalWrapper.Footer = (props) => <div {...props} className={cNames([ "modal-footer", props.className ])} />

export default ModalWrapper
