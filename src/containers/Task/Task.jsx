import React, { Component, PropTypes as T } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import findWhere from 'lodash/collection/findWhere'
import merge from 'deep-extend'
import validator from 'validator'
import { TaskActions } from '../../redux/modules'
import {
  PageHeading, Animate, Dimmer, Form, Spinner,
  TaskPanel, Waterfall, IconInput, NewTaskModal
} from '../../components'
import './task.less'

@connect(
  state => ({
    task: state.task
  }),
  {
    ...TaskActions,
    ...TaskActions.taskModifyActionCreators
  }
)
export default class Task extends Component {

  static contextTypes = {
    socket: T.object,
    currentUser: T.object,
    isLeader: T.bool
  }

  static propTypes = {
    task: T.object,
    load: T.func,
    checkEntry: T.func,
    addEntry: T.func,
    removeEntry: T.func,
    addCheckList: T.func,
    removeCheckList: T.func,
    syncTask: T.func,
    updateCheckList: T.func,
    addTask: T.func
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      loading: true,
      error: false,
      isModalShowed: false,
      taskIdInModal: -1
    }
    this._dirtyList = []
    this._handleSyncTask = this._handleSyncTask.bind(this)
    this._handleAddTask = this._handleAddTask.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    const { task } = nextProps
    if (task.loading !== this.state.loading) {
      this.setState({ loading: task.loading, error: task.error })
      // this.setState({ loading: true })
    }
  }

  componentDidMount () {
    const { currentUser, socket } = this.context
    this.props.load(currentUser)
    // for single task modify
    socket.on('syncTask', this._handleSyncTask)
    // for task add or remove
    socket.on('addTask', this._handleAddTask)
  }

  componentWillUnmount () {
    const { socket } = this.context
    TaskActions.dispose()
    socket.removeListener('syncTask', this._handleSyncTask)
    socket.removeListener('addTask', this._handleAddTask)
  }

  render () {
    const { task } = this.props
    const taskKeys = Object.keys(task.data)

    return (
      <div>
        <PageHeading title="Task" breadcrumb={[
          { title: "Home", link: "/" }, { title: "Task", link: "/task" }
        ]}>
          {this._getTaskNav()}
        </PageHeading>
        <Animate name='fade'>
          {this.state.loading ? (
            <Spinner key={0} />
          ) : (
            this.state.error ? (
              <Dimmer className='block-center' style={{ height: 165 }}>
                <div className='task-free'>
                  <i className='fa fa-frown-o'></i>
                  <p>Can't fetch data from server...</p>
                  <button className='btn btn-success' onClick={::this._reload}>Try again</button>
                </div>
              </Dimmer>
            ) : (
              taskKeys.length > 0 ? (
                <Waterfall className='row'>
                  {taskKeys.map(::this._getTaskPanel)}
                </Waterfall>
              ): (
                <Dimmer className='block-center'>
                  <div className='task-free'>
                    <i className='fa fa-file-text-o'></i>
                    <p>You are free today!</p>
                  </div>
                </Dimmer>
              )
            )
          )}
        </Animate>
        {/* portal for create new task */}
        <NewTaskModal ref='newTaskModal' isShowed={this.state.isModalShowed}
          onHide={::this._hideModal} onSuccess={::this._addTask} />
      </div>
    )
  }

  _getTaskNav () {
    const { isLeader } = this.context
    return (
      <nav className="navbar navbar-default">
        <ul className="nav navbar-nav">
          {isLeader ? <li><a href='javascript:;' onClick={::this._showModal}><i className='fa fa-plus'></i>New Task</a></li> : null}
          <li><a href='javascript:;'><i className='fa fa-calendar'></i>Calender</a></li>
        </ul>
        <form className="navbar-form navbar-left" role="search">
          <div className="form-group">
            <IconInput icon='filter' className="form-control lean-control" placeholder="Filter your task..." />
          </div>
          {/* <a type="submit" className="btn btn-sm btn-white">Submit</a> */}
        </form>
      </nav>
    )
  }

  _getTaskPanel (taskKey) {
    const { task, checkEntry, addEntry, removeEntry, addCheckList, removeCheckList } = this.props
    const t = task.data[taskKey]
    const handleModify = this._handleModify(t._id)

    return (
      <div key={t._id} className='wf-box'>
        <TaskPanel task={t}
          onSeal={::this._handleTaskSeal(t._id)}
          onAlert={() => {}}
          onEntryClick={handleModify(checkEntry.bind(this), 'checkEntry', t._id)}
          onEntryAdd={handleModify(addEntry.bind(this), 'addEntry', t._id)}
          onEntryRemove={handleModify(removeEntry.bind(this), 'removeEntry', t._id)}
          onCheckListAdd={handleModify(addCheckList.bind(this), 'addCheckList', t._id)}
          onCheckListRemove={handleModify(removeCheckList.bind(this), 'removeCheckList', t._id)} />
      </div>
    )
  }

  _showModal () {
    this.setState({ isModalShowed: true })
  }

  _hideModal () {
    this.setState({ isModalShowed: false })
  }

  _handleModify (taskIndex) {
    return (func, actionName, ...args) => {
      const { updateCheckList } = this.props
      const sync = (updateBody) => {
        const task = this.props.task.data[taskIndex]
        updateCheckList(task._id, task.checklist, () => {
          const { socket } = this.context
          socket.emit('syncTask', updateBody)
        })
      }

      return (...others) => {
        const newArg = [].concat(args, others)
        func.apply(this, newArg)

        const updateBodyBuilder = TaskActions.updateBodyMap[actionName]
        if (typeof updateBodyBuilder === 'function') {
          const updateBody = updateBodyBuilder.apply(null, newArg)
          this._actions = TaskActions.mergeActions(this._actions, actionName, newArg, updateBody)
        }

        if (this._ltr) clearTimeout(this._ltr)

        this._ltr = setTimeout(() => {
          const finalUploadObject = TaskActions.extractUpdateObject(this._actions)
          sync(finalUploadObject)
          this._actions = {}
        }, 1000)
      }
    }
  }

  _handleSyncTask (body) {
    this.props.syncTask(body)
  }

  _handleAddTask (body) {
    const { assignee } = body
    const { currentUser } = this.context
    if (assignee.indexOf(currentUser.resourceId) >= 0) {
      this.props.addTask(body)
    }
  }

  _handleTaskSeal (id) {
    return () => {
      // this.setState({ isModalShowed: true, taskIdInModal: id })
    }
  }

  _reload () {
    this.setState({
      loading: true, error: false
    }, () => {
      const { currentUser } = this.context
      this.props.load(currentUser)
    })
  }

  _addTask (body) {
    const { socket } = this.context
    this.setState({
      isModalShowed: false
    }, () => {
      this.props.addTask(body)
      socket.emit('addTask', body)
    })
  }
}
