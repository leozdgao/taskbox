import React, { Component, PropTypes as T } from 'react'
import cNames from 'classnames'
import './taskpanel.less'

const styleMap = {
  'SOW': 'teal',
  'PCR': 'blue',
  'Bug': 'red'
}

export default class TaskPanel extends Component {

  static propTypes = {
    task: T.object.isRequired,
    onSeal: T.func,
    onAlert: T.func
  }

  render () {
    const { task } = this.props

    return (
      <div className='panel panel-inverse'>
        <div className='panel-heading'>
          <div className='panel-btn-heading'>
            <a className='btn btn-xs btn-icon btn-circle btn-danger' onClick={this.props.onAlert}>
              <i className="fa fa-bell"></i>
            </a>
            <a className='btn btn-xs btn-icon btn-circle btn-warning' onClick={this.props.onSeal}>
              <i className="fa fa-minus"></i>
            </a>
          </div>
          <h4 className='panel-title'>{task.title}</h4>
        </div>
        <div className='panel-body'>
          <span className={cNames([ 'label-brand', styleMap[task.type] || 'orange' ])}>{task.type || 'Task'}</span>
          <div className='task-body'>
            <h4 className='task-title'>Description</h4>
            <div>{task.description}</div>
          </div>
          <div className='task-body'>
            <h4 className='task-title'>CheckList</h4>

          </div>
        </div>
      </div>
    )
  }
}
