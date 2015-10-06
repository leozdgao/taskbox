import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Modal } from '../../components'
import './app.less'

@connect(
  state => ({})
)
export default class Main extends Component {

  static propTypes = {
    children: PropTypes.any.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      isModalShowed: false
    }
  }

  render () {
    return (
      <div className='ui grid cb-container'>
        <div className='four wide column'>
          <div className='ui basic button' onClick={::this._showModal}>Create new topic</div>
          <div className='ui secondary vertical pointing fluid menu'>
            <a className="item active">Bio</a>
            <a className="item">Pics</a>
            <a className="item">Companies</a>
            <a className="item">Links</a>
          </div>
        </div>
        <div className='twelve wide stretched column'>
          {/* this will render the child routes */}
          {React.cloneElement(this.props.children, this.props)}
        </div>
        {/* portals */}
        <Modal isShowed={this.state.isModalShowed} dimmerClassName='ui dimmer'
          modalClassName='ui modal dialog' transitionTimeout={200}>
          <div className='header'>Create a topic</div>
          <div className='content'>
            some text
          </div>
          <div className='actions'>
            <div className='ui black deny button' onClick={::this._closeModal}>Nope</div>
            <div className='ui positive right labeled icon button' onClick={::this._closeModal}>
              Yes, create it<i className='checkmark icon'></i>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  _showModal () {
    this.setState({ isModalShowed: true })
  }

  _closeModal () {
    this.setState({ isModalShowed: false })
  }
}
