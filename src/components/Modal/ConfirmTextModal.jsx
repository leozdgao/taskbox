import React, { Component, PropTypes as T } from 'react'
import ModalWrapper from './ModalWrapper'

class ConfirmTextModal extends Component {
  static propTypes = {
    isShowed: T.bool,
    onHide: T.func,
    onSubmit: T.func,
    keyText: T.string.isRequired,
    children: T.any
  }

  static defaultProps = {
    isShowed: false,
    onHide: () => {},
    onSubmit: () => {}
  }

  state = {
    isMatch: false
  }

  render () {
    const { isShowed, onHide, onSubmit } = this.props

    return (
      <ModalWrapper isShowed={isShowed}>
        <ModalWrapper.Header>
          <h4 className="modal-title"><i className="fa fa-exclamation-triangle text-warning"></i> Confrim</h4>
        </ModalWrapper.Header>
        <ModalWrapper.Content>
          <p>{this.props.children}</p>
          <input className="form-control" onChange={::this._handleChange} />
        </ModalWrapper.Content>
        <ModalWrapper.Footer>
          <button type="button" className="btn btn-sm btn-white" onClick={onHide}>No</button>
          <button type="button" className="btn btn-sm btn-success"
            onClick={onSubmit} disabled={!this.state.isMatch}>Confirm</button>
        </ModalWrapper.Footer>
      </ModalWrapper>
    )
  }

  _handleChange (e) {
    const keyText = this.props.keyText
    let isMatch = false
    if (e.target.value === keyText) {
      isMatch = true
    }

    this.setState({ isMatch })
  }
}

export default ConfirmTextModal
