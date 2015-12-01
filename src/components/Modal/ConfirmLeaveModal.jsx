import React, { Component, PropTypes as T } from 'react'
import ModalWrapper from './ModalWrapper'

class ConfirmLeaveModal extends Component {
  static propTypes = {
    isShowed: T.bool,
    onHide: T.func,
    onSubmit: T.func
  }

  static defaultProps = {
    isShowed: false,
    onHide: () => {},
    onSubmit: () => {}
  }

  render () {
    return (
      <ModalWrapper isShowed={this.props.isShowed}>
        <ModalWrapper.Header>
          <h4 className="modal-title"><i className="fa fa-exclamation-triangle text-warning"></i> Confrim</h4>
        </ModalWrapper.Header>
        <ModalWrapper.Content>
          <p>Are you sure to leave this page? <b>Unsaved content might be lost.</b></p>
        </ModalWrapper.Content>
        <ModalWrapper.Footer>
          <button type="button" className="btn btn-sm btn-white" onClick={this.props.onHide}>No</button>
          <button type="button" className="btn btn-sm btn-success" onClick={this.props.onSubmit}>Confirm</button>
        </ModalWrapper.Footer>
      </ModalWrapper>
    )
  }
}

export default ConfirmLeaveModal
