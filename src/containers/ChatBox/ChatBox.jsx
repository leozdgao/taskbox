import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import IO from 'socketIO'
import cNames from 'classnames'
import { ChatActions } from '../../redux/modules'
import { Toggle, ScrollPanel } from '../../components'
import Styles from './chatbox.less'

@connect(
  state => ({
    chats: state.chats
  }),
  dispatch => ({
    ...bindActionCreators(ChatActions, dispatch)
  })
)
export default class ChatBox extends Component {

  static propTypes = {
    receiveMessage: PropTypes.func.isRequired,
    sendMessage: PropTypes.func.isRequired,
    chats: PropTypes.array.isRequired
  }

  componentDidMount () {
    const { receiveMessage } = this.props
    this._socket = IO()
    this._socket.on('chat', receiveMessage)
  }

  render () {
    const { chatbox, chatinput } = Styles

    return (
      <div className={`ui segment ${chatbox}`}>
        <h3>Chat Box</h3>
        {this._renderPanel()}
        {this._renderInput()}
      </div>
    )
  }

  _renderPanel () {
    const { chats } = this.props
    const { chatpanel, chatentry, chatcontent, me, frominfo } = Styles

    const items = chats.map(({ from, msg }, i) => {
      const isMe = (from === 'me')
      return (
        <div className='item' key={i}>
          <div className={cNames([ { [me]: isMe }, 'content', chatentry ])}>
            <img className='ui avatar image' src='http://semantic-ui.com/images/avatar2/small/matthew.png' />
            <div className={chatcontent}>
              <b className={frominfo}>{from} said</b>
              <p>{msg}</p>
            </div>
          </div>
        </div>
      )
    })

    return (
      <ScrollPanel className={`ui list ${chatpanel}`}>
        {items}
      </ScrollPanel>
    )
  }

  _renderInput () {
    const { chatinput } = Styles

    return (
      <div className='ui form'>
        <div className='field'>
          <textarea ref='input' rows='3' placeholder='Say something...' onKeyDown={this._handleKeyDown.bind(this)}></textarea>
        </div>
        <div className={cNames('field', chatinput)}>
          <div className='ui left floated submit button' onClick={this._sendMessage.bind(this)}>Submit</div>
          <Toggle ref='toggle' checked>Send message by <kbd>Crtl + Enter</kbd></Toggle>
        </div>
      </div>
    )
  }

  _sendMessage () {
    const { sendMessage } = this.props
    const val = this.refs.input.value

    if (val) {
      sendMessage(val)
      this.refs.input.value = ''
      this._socket.emit('chat', val)
    }
  }

  _handleKeyDown (e) {
    // Ctrl + ENTER
    if (this.refs.toggle.isChecked() && e.keyCode === 13 && e.ctrlKey) {
      e.preventDefault()
      this._sendMessage()
    }
  }
}
