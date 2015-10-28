import React, { Component, PropTypes as T } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import findWhere from 'lodash/collection/findWhere'
import { TaskActions } from '../../redux/modules'
import { Animate, Dimmer, Spinner, TaskPanel, Modal } from '../../components'
import './task.less'

@connect(
  state => ({
    task: state.task
  }),
  dispatch => ({
    ...bindActionCreators({
      ...TaskActions,
      ...TaskActions.taskModifyActionCreators
    }, dispatch)
  })
)
export default class Task extends Component {

  static contextTypes = {
    socket: T.object,
    currentUser: T.object
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
    updateCheckList: T.func
  }

  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      error: false,
      isModalShowed: false,
      taskIdInModal: -1
    }
    this._dirtyList = []
    this._handleSyncTask = this._handleSyncTask.bind(this)
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
    this.props.load(currentUser.resourceId)
    socket.on('syncTask', this._handleSyncTask)
  }

  componentWillUnmount () {
    const { socket } = this.context
    TaskActions.dispose()
    socket.removeListener('syncTask', this._handleSyncTask)
  }

  render () {
    const { task } = this.props

    return (
      <div>
        <div className="page-header">Task Board</div>
        <ol className="breadcrumb">
          <li><Link to='/'>Dashboard</Link></li>
          <li className="active">Task</li>
        </ol>
        <Animate name='fade'>
          {this.state.loading ? (
            <Spinner key={0} className='task-dimmer' />
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
              task.data.length > 0 ? (
                <div className='row'>
                  {task.data.map(::this._getTaskPanel)}
                  {/* portal */}
                  <Modal isShowed={this.state.isModalShowed}
                    animateName='modalFade' transitionTimeout={500}
                    dimmerClassName='modal-dimmer' modalClassName='modal-dialog'>
                    {this._getModalContent()}
                  </Modal>
                </div>
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
      </div>
    )
  }

  _getTaskPanel (t, i) {
    const { checkEntry, addEntry, removeEntry, addCheckList, removeCheckList } = this.props
    const handleModify = this._handleModify(i)
    return (
      <div key={t._id} className='col-lg-6'>
        <TaskPanel task={t}
          onSeal={::this._handleTaskSeal(t._id)}
          onAlert={() => {}}
          onEntryClick={handleModify(checkEntry.bind(this), 'checkEntry', i)}
          onEntryAdd={handleModify(addEntry.bind(this), 'addEntry', i)}
          onEntryRemove={handleModify(removeEntry.bind(this), 'removeEntry', i)}
          onCheckListAdd={handleModify(addCheckList.bind(this), 'addCheckList', i)}
          onCheckListRemove={handleModify(removeCheckList.bind(this), 'removeCheckList', i)} />
      </div>
    )
  }

  _getModalContent () {
    return (
      <div className="modal-content">
        <div>
          <div className="modal-header">
            <button type="button" className="close" onClick={::this._hideModal}>
              <span aria-hidden="true">×</span>
            </button>
            <h4 className="modal-title">Modal title</h4>
          </div>
          <div className="modal-body">
            <p>One fine body…</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-sm btn-white" onClick={::this._hideModal}>Close</button>
            <button type="button" className="btn btn-sm btn-success">Save changes</button>
          </div>
        </div>
      </div>
    )
  }

  _handleTaskSeal (id) {
    return () => {
      this.setState({ isModalShowed: true, taskIdInModal: id })
    }
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

        if (this._dirtyList[taskIndex]) clearTimeout(this._dirtyList[taskIndex])

        const ltr = setTimeout(() => {
          const updateBodyBuilder = TaskActions.updateBodyMap[actionName]
          if (typeof updateBodyBuilder === 'function') {
            const updateBody = updateBodyBuilder.apply(null, newArg)
            sync(updateBody)
          }
        }, 1000)
        this._dirtyList[taskIndex] = ltr
      }
    }
  }

  _handleSyncTask (body) {
    const { syncTask } = this.props
    syncTask(body)
  }

  _reload () {
    this.setState({
      loading: true, error: false
    }, () => {
      const { currentUser } = this.context
      this.props.load(currentUser.resourceId)
    })
  }
}
