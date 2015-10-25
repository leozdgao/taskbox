import React, { Component, PropTypes as T } from 'react'
import { Overlay } from 'react-overlays'
import cNames from 'classnames'
import map from 'lodash/collection/map'
import forEach from 'lodash/collection/forEach'
import countBy from 'lodash/collection/countBy'
import CheckEntry from '../CheckEntry/CheckEntry'
import ProgressBar from '../ProgressBar/ProgressBar'
import OverlayTrigger from '../OverlayTrigger/OverlayTrigger'
import Tooltip from '../Tooltip/Tooltip'
import './taskpanel.less'

const styleMap = {
  'SOW': 'teal',
  'PCR': 'blue',
  'Bug': 'red'
}
const noop = () => {}

export default class TaskPanel extends Component {

  static propTypes = {
    task: T.object.isRequired,
    resource: T.array,
    onEntryClick: T.func,
    onSeal: T.func,
    onAlert: T.func
  }

  static defaultProps = {
    resource: [],
    onEntryClick: noop,
    onSeal: noop,
    onAlert: noop
  }

  render () {
    const { task, resource } = this.props
    const { checklist, assignee } = task

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
            <h4 className='task-title' style={{ color: '#666' }}>Members</h4>
            <div className='task-members'>
              {map(assignee, (resourceId, i) => {
                const tooltip = (
                  <Tooltip placement='bottom'>Leo Gao {resourceId}</Tooltip>
                )
                return (
                  <OverlayTrigger key={i} event='hover' placement='bottom' overlay={tooltip}>
                    <a href='javascript:;' key={i}>
                      <img src='/assets/avatar.png' />
                    </a>
                  </OverlayTrigger>
                )
              })}
            </div>
          </div>
          <div className='task-body'>
            <h4 className='task-title' style={{ color: '#666' }}>Description</h4>
            <div>{task.description}</div>
          </div>
          <div className='task-body'>
            {this._getCheckList(checklist)}
          </div>
        </div>
      </div>
    )
  }

  _getCheckList (checklist) {
    const checkKeys = Object.keys(checklist)
    if (checkKeys.length <= 0) {
      return null
    }
    else {
      return checkKeys.map((key) => {
        let i = 0, count = 0
        forEach(checklist[key], ({ checked }) => {
          if (checked) i++
          count ++
        })
        let percantage = ((i / count) * 100)
        if (percantage !== parseInt(percantage, 10)) {
          percantage = percantage.toFixed(2)
        }

        return (
          <div key={key}>
            <h4 className='task-title'><i className='fa fa-check-circle-o'></i>{key}</h4>
            <ProgressBar percantage={percantage} title={percantage + '%'} />
            {this._getTodoList(checklist, key)}
          </div>
        )
      })
    }
  }

  _getTodoList (checklist, key) {
    const obj = checklist[key]
    // const todos = [], done = []
    // forEach(obj, (checked, title) => {
    //   if (checked) done.push(title)
    //   else todos.push(title)
    // })

    return (
      <div>
        {map(obj, ({ checked, title }, i) =>
          <CheckEntry key={title} onClick={() => this.props.onEntryClick(key, i)} checked={checked}>{title}</CheckEntry>
        )}
      </div>
    )
  }
}
