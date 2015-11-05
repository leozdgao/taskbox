import React, { Component, PropTypes as T } from 'react'
import RadioGroup from '../RadioGroup/RadioGroup'
import ResourceAssigner from './ResourceAssigner'
import validated, { isRequired, arrayNotEmpty } from './validated'

class TaskForm extends Component {

  static propTypes = {
    defaultTaskTitle: T.string,
    avaliableResources: T.array
  }

  render () {
    return (
      <form>
        <div className="form-group">
          <label htmlFor="titleInput">Title</label>
          <input className="form-control" ref="title" name="title" id="titleInput" placeholder="Title" defaultValue={this.props.defaultTaskTitle} />
        </div>
        <div className="form-group">
          <label htmlFor="descriptionInput">Description</label>
          <textarea className="form-control" ref="description" name="description" id="descriptionInput" placeholder="Description..." rows={5} />
        </div>
        <div className="form-group">
          <label htmlFor="typeOptions">Type</label>
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

const validateMixin = validated([
  { field: 'title', validator: isRequired },
  { field: 'description', validator: isRequired },
  { field: 'type', validator: isRequired },
  { field: 'assignee', validator: arrayNotEmpty }
])

validateMixin(TaskForm.prototype)

export default TaskForm
