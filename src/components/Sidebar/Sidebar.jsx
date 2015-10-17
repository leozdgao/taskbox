import React from 'react'
import { IndexLink, Link } from 'react-router'
import { ScrollPanel } from '../../components'

import './sidebar.less'

const roleMap = {
  '-1': 'Administrator',
  '0': 'Intern',
  '1': 'Team Member',
  '2': 'Team Leader'
}

const Sidebar = ({ user }) => {
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
          <li className="">
            <Link to='/team' activeClassName="active">
              <i className="fa fa-users"></i>
              <span>Team</span>
            </Link>
          </li>
				</ul>
      </ScrollPanel>
    </div>
  )
}

export default Sidebar
