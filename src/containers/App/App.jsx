import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Modal } from '../../components'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import './app.less'
import './navbar.less'
import './sidebar.less'

const user = {
  name: 'Leo Gao',
  avatar: 'http://semantic-ui.com/images/avatar2/small/matthew.png',
  role: 1
}
const msgNum = 3

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
      <div id='page-container' className='fade page-sidebar-fixed page-header-fixed in'>
        <Navbar user={user} msgNum={msgNum} />
        <Sidebar user={user} />
        <div className='twelve wide stretched column'>
          {/* this will render the child routes */}
          {React.cloneElement(this.props.children, this.props)}
        </div>
      </div>
    )
  }
}
