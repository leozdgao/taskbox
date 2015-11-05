import React, { Component, PropTypes as T } from 'react'
import update from 'react-addons-update'
import { Overlay } from 'react-overlays'
import cNames from 'classnames'
import map from 'lodash/collection/map'
import forEach from 'lodash/collection/forEach'
import countBy from 'lodash/collection/countBy'
import { CheckEntry, ProgressBar, OverlayTrigger, Tooltip, Dropdown } from '../../components'
import './taskpanel.less'

const styleMap = {
  'SOW': 'teal',
  'PCR': 'blue',
  'Bugfix': 'red'
}
const noop = () => {}

export default class TaskPanel extends Component {

  static contextTypes = {
    resourceInfo: T.array
  }

  static propTypes = {
    task: T.object.isRequired,
    resource: T.array,
    onEntryClick: T.func,
    onEntryAdd: T.func,
    onEntryRemove: T.func,
    onCheckListAdd: T.func,
    onCheckListRemove: T.func,
    onSeal: T.func,
    onAlert: T.func
  }

  static defaultProps = {
    resource: [],
    onEntryClick: noop,
    onEntryAdd: noop,
    onEntryRemove: noop,
    onCheckListAdd: noop,
    onCheckListRemove: noop,
    onSeal: noop,
    onAlert: noop
  }

  constructor (props) {
    super(props)

    const init = {}
    const { task } = props
    const { checklist = [] } = task

    // for (const key in checklist) {
    //   if (!checklist.hasOwnProperty(key)) continue
    //   init[key] = false
    // }

    this.state = {
      dropdown: checklist.map(() => false)
    }
  }

  render () {
    const { task, resource } = this.props
    const { checklist = [], assignee } = task

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
                  <Tooltip placement='bottom'>{this._getResourceName(resourceId)}</Tooltip>
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
            <div className='new-checklist'>
              <i className='fa fa-check-circle-o pull-left'></i>
              <div>
                <input type="text" className="form-control lean-control mb-10" placeholder="Add new CheckList..." onKeyDown={::this._handleAddCheckList} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  _getCheckList (checklist = []) {
    if (checklist.length <= 0) {
      return null
    }
    else {
      return checklist.map((list, listIndex) => {
        let i = 0, count = 0
        const { name, items } = list
        forEach(items, ({ checked }) => {
          if (checked) i++
          count ++
        })
        let percantage = ((i / count) * 100)
        if (percantage !== parseInt(percantage, 10)) {
          percantage = percantage.toFixed(2)
        }

        return (
          <div key={name}>
            <h4 className='task-title'>
              <i className='fa fa-check-circle-o'></i>
              {name}
              <a href='javascript:;' className='pull-right' onClick={this._showDropdown.bind(this, listIndex)}>Delete</a>
              <Dropdown animateName='fade' transitionTimeout={300} open={this.state.dropdown[listIndex]} onHide={this._hideDropdown.bind(this, listIndex)}>
                <div className='rm-dropdown'>
                  <p>Remove this checkList?</p>
                  <button className='btn btn-xs btn-danger' onClick={this._handleRemoveCheckList.bind(this, listIndex)}>Remove</button>
                </div>
              </Dropdown>
            </h4>
            {isNaN(percantage) ? null : <ProgressBar percantage={percantage} title={percantage + '%'} />}
            <input type="text" className="form-control lean-control mb-10" placeholder="Add new item..." onKeyDown={this._handleAddItem.bind(this, listIndex)} />
            {this._getTodoList(checklist, listIndex)}
          </div>
        )
      })
    }
  }

  _getTodoList (checklist, listIndex) {
    const { name, items } = checklist[listIndex]

    return (
      <div>
        {map(items, ({ checked, title }, i) =>
          <CheckEntry key={title} onClick={() => this.props.onEntryClick(listIndex, i, checked)} checked={checked}>
            {title}
            <i className='fa fa-times-circle pull-right' onClick={(e) => {
              e.stopPropagation()
              this.props.onEntryRemove(listIndex, i)
            }}></i>
          </CheckEntry>
        )}
      </div>
    )
  }

  _getResourceName (resourceId) {
    const { resourceInfo } = this.context

    for (let i = 0; i < resourceInfo.length; i++) {
      const resource = resourceInfo[i]
      if (resource.resourceId === resourceId) {
        return resource.name
      }
    }
  }

  _handleAddItem (key, e) {
    const val = e.currentTarget.value.trim()
    if (e.keyCode === 13 && val) {
      this.props.onEntryAdd(key, val)
      e.currentTarget.value = ''
    }
  }

  _handleAddCheckList (e) {
    const val = e.currentTarget.value.trim()
    if (e.keyCode === 13 && val) {
      this.props.onCheckListAdd(val)
      e.currentTarget.value = ''
    }
  }

  _handleRemoveCheckList (key, e) {
    this.props.onCheckListRemove(key)
  }

  _hideDropdown (key) {
    this.setState({
      dropdown: update(this.state.dropdown, {
        [key]: { $set: false }
      })
    })
  }

  _showDropdown (key) {
    this.setState({
      dropdown: update(this.state.dropdown, {
        [key]: { $set: true }
      })
    })
  }
}
