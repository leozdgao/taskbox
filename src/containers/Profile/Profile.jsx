import React, { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'
import { reset } from 'redux-form'
import { Dimmer, Modal, EditableField, ChangePasswordForm, ChangeAvatarModal } from '../../components'
import { UserActions } from '../../redux/modules'
import { roleMap } from '../../auth'
import './profile.less'

@connect(
  state => ({
    user: state.user
  }),
  {
    ...UserActions,
    resetForm: reset
  }
)
class Profile extends Component {

  static contextTypes = {
    currentUser: T.object,
    isLeader: T.bool
  }

  static propTypes = {
    user: T.object,
    updateProfile: T.func,
    changePassword: T.func,
    resetForm: T.func
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      loading: false,
      modalShowed: false
    }
  }

  componentWillReceiveProps (nextProps) {
    const { user: { changePasswordPending, lastChangePasswordError } } = nextProps
    const { user: { changePasswordPending: currentPending } } = this.props
    if (currentPending && !changePasswordPending) { // fulfilled
      this.setState({
        loading: false
      }, () => {
        if (!lastChangePasswordError) this.props.resetForm('changePassword')
      })
    }
    if (!currentPending && changePasswordPending) { // start requesting
      this.setState({
        loading: true
      })
    }
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
                    <div className="circle-border" onClick={::this._showModal}>
                      <img className="" src={currentUser.avatar}/>
                      <Dimmer><i className="fa fa-edit" /></Dimmer>
                    </div>
                  </div>
                  <div className="profile-info">
                    <h3>{currentUser.name}</h3>
                    <p>{roleMap[currentUser.role]}</p>
                  </div>
                </div>
                <div className="profile-panel">
                  <div>
                    <label>Email</label>
                    <EditableField value={currentUser.email} onChange={this.props.updateProfile.bind(this, 'email')} />
                  </div>
                  <div>
                    <label>Tel</label>
                    <EditableField value={currentUser.tel} onChange={this.props.updateProfile.bind(this, 'tel')} />
                  </div>
                  <div>
                    <label>QQ</label>
                    <EditableField value={currentUser.qq} onChange={this.props.updateProfile.bind(this, 'qq')} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            {/* Timeline here */}
          </div>
        </div>
        {this._getChangePasswordPanel()}
        {/* Protal */}
        <ChangeAvatarModal isShowed={this.state.modalShowed} onHide={::this._hideModal} />
      </div>
    )
  }

  _getChangePasswordPanel () {
    const { user: { lastChangePasswordError } } = this.props
    return (
      <div className="row">
        <div className="col-lg-4 col-md-6">
          <div className="panel panel-inverse">
            <div className="panel-body">
              <ChangePasswordForm onSubmit={::this._handleChangePassword} isRequesting={this.state.loading} />
              {lastChangePasswordError &&
                <span className="block mt-15 text-danger">
                  Failed to change password. Maybe your current password is wrong or server just broken...
                </span>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  _handleChangePassword (body) {
    const { oldpwd, newpwd } = body
    this.setState({
      submitting: true
    }, () => {
      this.props.changePassword(oldpwd, newpwd)
    })
  }

  _showModal () {
    this.setState({ modalShowed: true })
  }

  _hideModal () {
    this.setState({ modalShowed: false })
  }
}

export default Profile
