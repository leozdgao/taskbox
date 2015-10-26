import React, { Component, PropTypes as T } from 'react'
import { Link } from 'react-router'
import cNames from 'classnames'
import { DropdownList } from '../../components'

import './navbar.less'

export default class Navbar extends Component {

  static propTypes = {
    msgNum: T.number,
    user: T.object.isRequired
  }

  static defaultProps = {
    msgNum: 0
  }

  constructor (props) {
    super(props)

    this.state = {
      notiOpened: false,
      userOpened: false
    }
  }

  render () {
    const { msgNum, user = {} } = this.props
    const { avatar, name } = user
    return (
      <div id='header' className='header navbar navbar-default navbar-fixed-top'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            <Link className='navbar-brand' to="/">
              <span className='navbar-logo'></span>
              Task Box
            </Link>
          </div>
          <ul className='nav navbar-nav navbar-right'>
            <li className='dropdown f-s-14'>
              <a href='javascript:;'>
                <i className='fa fa-bell-o'></i>
                {msgNum > 0 ? <span className='label'>{msgNum}</span> : null}
              </a>
            </li>
            <li className={cNames([ 'dropdown navbar-user', { open: this.state.userOpened } ])}>
              <a href='javascript:;' className='dropdown-toggle' onClick={() => this.setState({ userOpened: true })}>
                <img src={avatar} />
                <span className='hidden-xs'>{name}</span><b className='caret'></b>
              </a>
              <DropdownList className='dropdown-menu' animateName='slideDown' open={this.state.userOpened} onHide={() => this.setState({ userOpened: false })}>
                <option><a><i className='fa fa-user'></i>Profile</a></option>
                <option><a><i className='fa fa-cog'></i>Settings</a></option>
                <option className='divider'></option>
                <option><a href="/logout"><i className='fa fa-sign-out'></i>Logout</a></option>
              </DropdownList>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Navbar
