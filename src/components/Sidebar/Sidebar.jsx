import React from 'react'
import { IndexLink, Link } from 'react-router'
import { ScrollPanel } from '../../components'
import { roleMap } from '../../auth'

import './sidebar.less'

const Sidebar = ({ user = {} }) => {
  const { avatar, name, role } = user

  return (
    <div id='sidebar' className='sidebar'>
      <ScrollPanel >
        <ul className="nav">
          <li className="nav-profile">
            <div className="image">
              <a><img src={avatar} /></a>
            </div>
            <div className="info">
              {name}
              <small>{roleMap[role] || ''}</small>
            </div>
          </li>
        </ul>
        <ul className="nav">
					<li className="nav-header">Navigation</li>
					<li>
            <IndexLink to='/' activeClassName="active">
              <i className="fa fa-laptop"></i>
              <span>DashBoard</span>
            </IndexLink>
          </li>
          <li>
            <Link to='/task' activeClassName="active">
              <i className="fa fa-calendar"></i>
              <span>Task</span>
            </Link>
          </li>
          <li>
            <Link to='/team' activeClassName="active">
              <i className="fa fa-users"></i>
              <span>Team</span>
            </Link>
          </li>
          <li>
            <Link to='/doc' activeClassName="active">
              <i className="fa fa-book"></i>
              <span>Document</span>
            </Link>
          </li>
          <li className='splitter'></li>
          <li>
            <Link to='/profile' activeClassName="active">
              <i className="fa fa-user"></i>
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link to='/settings' activeClassName="active">
              <i className="fa fa-cog"></i>
              <span>Settings</span>
            </Link>
          </li>
				</ul>
      </ScrollPanel>
    </div>
  )
}

export default Sidebar
