import React, { Component, PropTypes as T } from 'react'
import { reduxForm } from 'redux-form'

@reduxForm({
  form: 'editCompany',
  fields: [ 'name', 'clientId' ],
  validate: (values) => {
    const errors = {}

    if (!values.name) errors.name = 'It is required.'
    if (!values.clientId) errors.clientId = 'It is required.'

    return errors
  },
  touchOnBlur: false
})
class EditCompanyForm extends Component {
  static propTypes = {
    isRequesting: T.bool,
    fields: T.object,
    body: T.object,
    handleSubmit: T.func,
    onCancel: T.func
  }

  static defaultProps = {
    body: {}
  }

  render () {
    const { fields, body, handleSubmit, onCancel, isRequesting } = this.props
    const { name, clientId } = fields
    const isInvalid = (field) => field.touched && field.error

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="company-name">Name</label>
          <input id="company-name" autoFocus className="form-control" {...name} />
          {isInvalid(name) && <span className='text-danger'>{name.error}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="company-clientid">ClientID</label>
          <input id="company-clientid" className="form-control" {...clientId} />
          {isInvalid(clientId) && <span className='text-danger'>{clientId.error}</span>}
        </div>
        <div className="form-btn">
          <button type="button" className="btn btn-sm btn-white" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn btn-sm btn-success"
            disabled={isRequesting} onClick={e => { if (!isRequesting) handleSubmit(e) }}>Confirm</button>
        </div>
      </form>
    )
  }
}

export default EditCompanyForm
