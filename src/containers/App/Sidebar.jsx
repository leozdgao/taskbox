import React from 'react'
import { ScrollPanel } from '../../components'

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
              <small>Front end developer</small>
            </div>
          </li>
        </ul>
        <ul className="nav">
					<li className="nav-header">Navigation</li>
					<li className="active">
            <a>
              <i className="fa fa-laptop"></i>
              <span>DashBoard</span>
            </a>
          </li>
          <li className="">
            <a>
              <i className="fa fa-calendar"></i>
              <span>Task</span>
            </a>
          </li>
          <li className="">
            <a>
              <i className="fa fa-users"></i>
              <span>Team</span>
            </a>
          </li>
				</ul>
      </ScrollPanel>
    </div>
  )
}

export default Sidebar
