import React, { Component, PropTypes as T } from 'react'
import { Modal } from '../../components'

class ChangeAvatarModal extends Component {

  static propTypes = {
    isShowed: T.bool,
    onHide: T.func
  }

  static defaultProps = {
    isShowed: false,
    onHide: () => {}
  }

  render () {
    return (
      <Modal isShowed={this.props.isShowed}
        animateName='modalFade' transitionTimeout={500}
        dimmerClassName='modal-dimmer' modalClassName='modal-dialog'>
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" onClick={this.props.onHide}>
              <span aria-hidden="true">×</span>
            </button>
            <h4 className="modal-title">Change avatar</h4>
          </div>
          <div className="modal-body">

          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-sm btn-white" onClick={this.props.onHide}>Cancel</button>
          </div>
        </div>
      </Modal>
    )
  }
}

export default ChangeAvatarModal
