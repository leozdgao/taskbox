import React, { Component, PropTypes as T } from 'react'
import { reduxForm } from 'redux-form'
import { Editor, LeanInput, TagInput } from '../../components'
import { noop, prop } from '../../utils'

@reduxForm({
  form: 'editPost',
  fields: [ 'title', 'tags', 'content' ],
  validate: (values) => {
    const errors = {}

    if (!values.title) errors.title = 'It is required.'
    if (!values.content) errors.content = 'It is required.'

    return errors
  },
  touchOnBlur: false
})
class EditPostForm extends Component {
  static propTypes = {
    fields: T.object,
    errors: T.object,
    invalid: T.bool,
    dirty: T.bool,
    isRequesting: T.bool,
    handleSubmit: T.func.isRequired,
    onLoad: T.func,
    onError: T.func
  }

  static defaultProps = {
    onSubmit: noop,
    onLoad: noop,
    onError: noop
  }

  // TODO: Issue with HOC, can't resolve this property
  isDirty () {
    const { dirty } = this.props // only by this dirty property for now
    return dirty
  }

  constructor (props, context) {
    super(props, context)
  }

  render () {
    const { fields, onLoad, onError, handleSubmit, invalid, errors, isRequesting } = this.props
    const { title, content, tags } = fields
    const isInvalid = (field) => field.touched && field.error
    const invalidKeys = invalid ? Object.keys(errors).map(key => fields[key]).filter(isInvalid).map(prop('name')) : []
    const invalidKeyString = invalidKeys.join(', ')

    return (
      <form>
        <div className="form-group">
          <LeanInput className="title" placeholder="Title" autoFocus {...title} />
        </div>
        <div className="form-group">
          <TagInput placeholder="Input tag by Comma" {...tags} />
        </div>
        <div className="form-group">
          <Editor ref="editor" onLoad={onLoad} onError={onError} {...content}  />
        </div>
        <div>
          <a className="btn btn-success" onClick={handleSubmit}>Publish</a>
          {invalidKeys.length > 0 &&
            <span className="help-block">{`You should populate following fields: ${invalidKeyString}`}</span>}
        </div>
      </form>
    )
  }
}

export default EditPostForm
