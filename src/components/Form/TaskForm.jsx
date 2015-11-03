import React, { Component, PropTypes as T } from 'react'
import RadioGroup from '../RadioGroup/RadioGroup'
import ResourceAssigner from './ResourceAssigner'

class TaskForm extends Component {

  static propTypes = {
    avaliableResources: T.array
  }

  get body () {
    return this._body || {}
  }

  get errmsg () {
    if (this._errors.length > 0) {
      return this._errors.map(m => m[0].toUpperCase() + m.slice(1)).join(', ') + ' is required.'
    }
  }

  validate () {
    const isRequired = val => val != null && val !== ""
    const arrayNotEmpty = val => Array.isArray(val) && val.length > 0

    this._errors = []
    this._body = [
      { field: 'title', validator: isRequired },
      { field: 'description', validator: isRequired },
      { field: 'type', validator: isRequired },
      { field: 'assignee', validator: arrayNotEmpty }
    ].reduce((ret, obj) => {
      const { field, validator } = obj
      const control = this.refs[field]
      if (control) {
        const val = control.value
        if (!validator(val)) this._errors.push(field)
        else ret[field] = val
      }

      return ret
    }, {})
  }

  render () {
    return (
      <form>
        <div className="form-group">
          <label htmlFor="titleInput">Title</label>
          <input className="form-control" ref="title" name="title" id="titleInput" placeholder="Title" />
        </div>
        <div className="form-group">
          <label htmlFor="descriptionInput">Description</label>
          <textarea className="form-control" ref="description" name="description" id="descriptionInput" placeholder="Description..." rows={5} />
        </div>
        <div className="form-group">
          <label htmlFor="descriptionInput">Type</label>
          <RadioGroup name='typeOptions' ref="type">
            <option className='radio-inline' value="SOW">SOW</option>
            <option className='radio-inline' value="PCR">PCR</option>
            <option className='radio-inline' value="Improvement">Improvement</option>
            <option className='radio-inline' value="Bugfix">Bugfix</option>
            <option className='radio-inline' value="Others">Others</option>
          </RadioGroup>
        </div>
        <div className="form-group">
          <label>Assignee</label>
          <ResourceAssigner ref="assignee" avaliableResources={this.props.avaliableResources} />
        </div>
      </form>
    )
  }
}

export default TaskForm
