import React, { Component, PropTypes as T } from 'react'
import { EditableField } from '../../components'
import { roleMap } from '../../auth'
import './profile.less'

class Profile extends Component {

  static contextTypes = {
    currentUser: T.object,
    isLeader: T.bool
  }

  render () {
    const { currentUser } = this.context

    return (
      <div>
        <div className="page-header">User - Profile</div>
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="panel panel-inverse">
              <div className="panel-body">
                <div className="clearfix">
                  <div className="profile-image">
                    <img className="circle-border" src={currentUser.avatar}/>
                  </div>
                  <div className="profile-info">
                    <h3>{currentUser.name}</h3>
                    <p>{roleMap[currentUser.role]}</p>
                  </div>
                </div>
                <div className="profile-panel">
                  <div>
                    <label>Email</label>
                    <EditableField value={currentUser.email} />
                  </div>
                  <div>
                    <label>Tel</label>
                    <EditableField value={currentUser.tel} />
                  </div>
                  <div>
                    <label>QQ</label>
                    <EditableField value={currentUser.qq} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            {/* Timeline here */}
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="panel panel-inverse">
              <div className="panel-body">
                <form>
                  <div className="form-group">
                    <label>Current password</label>
                    <input type="password" className="form-control" />
                  </div>
                  <div className="form-group">
                    <label>New password</label>
                    <input type="password" className="form-control" />
                  </div>
                  <div>
                    <label>Repeat new password</label>
                    <input type="password" className="form-control" />
                  </div>
                  <a href="javascript:;" className="mt-15 btn btn-success btn-block">Change password</a>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Profile
