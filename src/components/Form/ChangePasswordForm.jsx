import React, { Component, PropTypes as T } from 'react'
import { reduxForm } from 'redux-form'
import cNames from 'classnames'

@reduxForm({
  form: 'changePassword',
  fields: [ 'oldpwd', 'newpwd', 'repeat' ],
  validate: (values) => {
    const errors = {}

    if (!values.oldpwd) errors.oldpwd = 'It is required.'

    if (!values.newpwd) errors.newpwd = 'It is required.'
    else if (values.newpwd.length < 6) errors.newpwd = 'Password length should be longer than 6.'

    if (!values.repeat) errors.repeat = 'It is required.'
    else if (values.repeat !== values.newpwd) errors.repeat = 'Two passwords are not consistant.'

    return errors
  },
  touchOnBlur: false
})
class ChangePasswordForm extends Component {

  static propTypes = {
    fields: T.object,
    isRequesting: T.bool,
    handleSubmit: T.func.isRequired,
    resetForm: T.func.isRequired
  }

  static defaultProps = {
    handleSubmit: () => {}
  }

  constructor (props, context) {
    super(props, context)

    this.state = {

    }
  }

  render () {
    const { fields: { oldpwd, newpwd, repeat }, handleSubmit, resetForm, isRequesting } = this.props
    const isInvalid = (field) => field.touched && field.error

    return (
      <form onSubmit={handleSubmit}>
        <div className={cNames([ "form-group", { "has-error": isInvalid(oldpwd) } ])}>
          <label>Current password</label>
          <input type="password" className="form-control" {...oldpwd} />
          {isInvalid(oldpwd) && <span className='help-block'>{oldpwd.error}</span>}
        </div>
        <div className={cNames([ "form-group", { "has-error": isInvalid(newpwd) } ])}>
          <label>New password</label>
          <input type="password" className="form-control" {...newpwd} />
          {isInvalid(newpwd) && <span className='help-block'>{newpwd.error}</span>}
        </div>
        <div className={cNames([ "form-group", { "has-error": isInvalid(repeat) } ])}>
          <label>Repeat new password</label>
          <input type="password" className="form-control" {...repeat} />
          {isInvalid(repeat) && <span className='help-block'>{repeat.error}</span>}
        </div>
        <button className="mt-15 btn btn-success btn-block" disabled={isRequesting} onClick={handleSubmit}>Change password</button>
      </form>
    )
  }
}

export default ChangePasswordForm
