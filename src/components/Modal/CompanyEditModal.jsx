import React, { Component, PropTypes as T } from 'react'
import { reduxForm } from 'redux-form'
import EditCompanyForm from '../Form/EditCompanyForm'
import ModalWrapper from './ModalWrapper'
import { isDefined } from '../../utils'

@reduxForm({
  form: "editCompany",
  fields: [ "name", "clientId" ]
})
class CompanyEditModal extends Component {
  static propTypes = {
    isRequesting: T.bool,
    isShowed: T.bool,
    onHide: T.func,
    onSubmit: T.func,
    body: T.object
  }

  static defaultProps = {
    isShowed: false,
    onHide: () => {},
    // onSubmit: () => {}
  }

  render () {
    const { isShowed, isRequesting, onHide, onFormSubmit, body } = this.props
    const hasBody = isDefined(body)
    const initialValues = hasBody ? {
      name: body.name,
      clientId: body.clientId
    }: {}

    return (
      <ModalWrapper isShowed={isShowed} className="cedit-modal">
        <ModalWrapper.Header>
          <button type="button" className="close" onClick={onHide}>
            <span aria-hidden="true">×</span>
          </button>
          <h4 className="modal-title">
            {hasBody ? "Edit company" : "New company"}
          </h4>
        </ModalWrapper.Header>
        <ModalWrapper.Content>
          <EditCompanyForm ref="test" initialValues={initialValues}
            isRequesting={isRequesting}
            onSubmit={onFormSubmit} onCancel={onHide} />
        </ModalWrapper.Content>
      </ModalWrapper>
    )
  }
}

export default CompanyEditModal
