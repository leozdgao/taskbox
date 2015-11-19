import React, { Component, PropTypes as T } from 'react'
import cNames from 'classnames'
import ModalWrapper from './ModalWrapper'

class ChangeAvatarModal extends Component {

  static propTypes = {
    isShowed: T.bool,
    onHide: T.func,
    onSubmit: T.func,
    items: T.array,
    defaultValue: T.string
  }

  static defaultProps = {
    isShowed: false,
    onHide: () => {},
    onSubmit: () => {}
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      currentIndex: this.props.items.indexOf(this.props.defaultValue)
    }
  }

  render () {
    return (
      <ModalWrapper isShowed={this.props.isShowed} className='change-avatar'>
        <ModalWrapper.Header>
          <button type="button" className="close" onClick={this.props.onHide}>
            <span aria-hidden="true">×</span>
          </button>
          <h4 className="modal-title">Change avatar</h4>
        </ModalWrapper.Header>
        <ModalWrapper.Content>
          <div className="clearfix">
            {this.props.items.map((src, i) => {
              return (
                <div key={i} className={cNames([ "circle-img sm-img img", { "active": this.state.currentIndex === i } ])}>
                  <img src={src} onClick={this._select.bind(this, i)} />
                </div>
              )
            })}
          </div>
        </ModalWrapper.Content>
        <ModalWrapper.Footer>
          <button type="button" className="btn btn-sm btn-white" onClick={this.props.onHide}>Cancel</button>
          <button type="button" className="btn btn-sm btn-success" onClick={::this._onClick}>Apply</button>
        </ModalWrapper.Footer>
      </ModalWrapper>
    )
  }

  _select (i) {
    this.setState({
      currentIndex: i
    })
  }

  _onClick () {
    const { onSubmit, items } = this.props
    const { currentIndex } = this.state

    onSubmit(items[currentIndex])
  }
}

export default ChangeAvatarModal
