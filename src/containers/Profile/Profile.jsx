import React, { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'
import { reset } from 'redux-form'
import { PageHeading, IBox, Dimmer, Modal, EditableField,
  ChangePasswordForm, ChangeAvatarModal, ScrollPanel } from '../../components'
import { UserActions } from '../../redux/modules'
import { roleMap } from '../../auth'
import './profile.less'

const avatars = [
  '/assets/avatar.png',
  '/assets/avatar0.png',
  '/assets/avatar1.png',
  '/assets/avatar2.png'
]

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
    loadActivities: T.func,
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
    const { user: { changePasswordPending, lastChangePasswordError,  } } = nextProps
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

  componentDidMount () {
    // this.props.loadActivities()
  }

  render () {
    const { currentUser } = this.context

    return (
      <div>
        <PageHeading title="Profile" breadcrumb={[
          { title: "Home", link: "/" }, { title: "User" }, { title: "Profile" }
        ]} />
        <div className="row">
          <div className="col-lg-5 col-md-6">
            {::this._getProfileDetail()}
            {::this._getChangePasswordPanel()}
          </div>
          <div className="col-lg-7 col-md-6">
            {this._getActivities()}
          </div>
        </div>

        {/* Protal */}
        <ChangeAvatarModal isShowed={this.state.modalShowed}
           onHide={::this._hideModal} onSubmit={this.props.updateProfile.bind(this, 'avatar')}
           items={avatars} defaultValue={currentUser.avatar} />
      </div>
    )
  }

  _getProfileDetail () {
    const { currentUser } = this.context

    return (
      <IBox>
        <IBox.Title><h5>Profile Detail</h5></IBox.Title>
        <IBox.Content>
          <div className="clearfix">
            <div className="profile-image">
              <div className="circle-img circle-border" onClick={::this._showModal}>
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
        </IBox.Content>
      </IBox>
    )
  }

  _getChangePasswordPanel () {
    const { user: { lastChangePasswordError } } = this.props
    return (
      <IBox>
        <IBox.Title><h5>Change Password</h5></IBox.Title>
        <IBox.Content>
          <ChangePasswordForm onSubmit={::this._handleChangePassword} isRequesting={this.state.loading} />
          {lastChangePasswordError &&
            <span className="block mt-15 text-danger">
              Failed to change password. Maybe your current password is wrong or server just broken...
            </span>}
        </IBox.Content>
      </IBox>
    )
  }

  _getActivities () {
    return (
      <IBox>
        <IBox.Title><h5>Activity (Not implement yet)</h5></IBox.Title>
        <IBox.Content style={{ height: 638 }}>
          <ScrollPanel>
            <div className="feed-activity-list">
              <div className="feed-element">
                <div className="circle-img sm-img pull-left">
                  <i className="fa fa-hourglass-start"></i>
                </div>
                <div className="media-body">
                  <small className="pull-right text-muted">5m ago</small>
                  Start the task <strong>Banc of California - Web Document Transfer to Encompass</strong><br />
                  <span className="text-muted">Today 4:21 pm - 12.06.2014</span>
                </div>
              </div>
              <div className="feed-element">
                <div className="circle-img sm-img pull-left">
                  <i className="fa fa-list-alt"></i>
                </div>
                <div className="media-body">
                  <small className="pull-right text-muted">5m ago</small>
                  Finish the task <strong>Banc of California - Web Document Transfer to Encompass</strong><br />
                  <span className="text-muted">Today 4:21 pm - 12.06.2014</span>
                </div>
              </div>
              <div className="feed-element">
                <div className="circle-img sm-img pull-left">
                  <i className="fa fa-compress"></i>
                </div>
                <div className="media-body">
                  <small className="pull-right text-muted">5m ago</small>
                  Seal the task <strong>Banc of California - Web Document Transfer to Encompass</strong><br />
                  <span className="text-muted">Today 4:21 pm - 12.06.2014</span>
                </div>
              </div>
              <div className="feed-element">
                <div className="circle-img sm-img pull-left">
                  <i className="fa fa-file-text"></i>
                </div>
                <div className="media-body">
                  <small className="pull-right text-muted">5m ago</small>
                  Publish a post <strong>User guide for using Encompass</strong><br />
                  <span className="text-muted">Today 4:21 pm - 12.06.2014</span>
                </div>
              </div>
            </div>
          </ScrollPanel>
        </IBox.Content>
      </IBox>
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
