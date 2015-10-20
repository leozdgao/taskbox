import React, { Component, PropTypes as T } from 'react'
import './taskpanel.less'

export default class TaskPanel extends Component {

  static propTypes = {
    task: T.object.isRequired,
    onClick: T.func
  }

  render () {
    const { task } = this.props

    return (
      <div className='panel panel-inverse'>
        <div className='panel-heading'>
          <div className='panel-btn-heading'>
            <a className='btn btn-xs btn-icon btn-circle btn-warning' onClick={this.props.onClick}>
              <i className="fa fa-minus"></i>
            </a>
          </div>
          <h4 className='panel-title'>{task.title}</h4>
        </div>
        <div className='panel-body'>
          <span className='label-brand red'>Bug fix</span>
        </div>
      </div>
    )
  }
}
