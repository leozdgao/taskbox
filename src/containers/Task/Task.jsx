import React, { Component, PropTypes as T } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import findWhere from 'lodash/collection/findWhere'
import { TaskActions } from '../../redux/modules'
import { Animate, Dimmer, TaskPanel, Modal } from '../../components'
import './task.less'

@connect(
  state => ({
    task: state.task
  }),
  dispatch => ({
    ...bindActionCreators({
      ...TaskActions
    }, dispatch)
  })
)
export default class Task extends Component {

  static contextTypes = {
    currentUser: T.object
  }

  static propTypes = {
    task: T.object,
    load: T.func,
    checkEntry: T.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      isModalShowed: false,
      taskIdInModal: -1
    }
  }

  componentWillReceiveProps (nextProps) {
    const { task } = nextProps
    if (task.loading !== this.state.loading) {
      this.setState({ loading: task.loading })
    }
  }

  componentDidMount () {
    this.props.load()
  }

  componentWillUnmount () {
    TaskActions.dispose()
  }

  render () {
    const { task, checkEntry } = this.props

    return (
      <div>
        <div className="page-header">Task Board</div>
        <ol className="breadcrumb">
          <li><Link to='/'>Dashboard</Link></li>
          <li className="active">Task</li>
        </ol>
        <Animate name='fade'>
          {this.state.loading ? (
            <Dimmer key={0} className='task-dimmer' />
          ) : (
            <div className='row'>
              {task.data.map(::this._getTaskPanel)}
              {/* portal */}
              <Modal isShowed={this.state.isModalShowed}
                animateName='modalFade' transitionTimeout={500}
                dimmerClassName='modal-dimmer' modalClassName='modal-dialog'>
                {this._getModalContent()}
              </Modal>
            </div>
          )}
        </Animate>
      </div>
    )
  }

  _getTaskPanel (t, i) {
    const { checkEntry } = this.props
    return (
      <div key={t.id} className='col-lg-6'>
        <TaskPanel task={t}
          onSeal={::this._handleTaskSeal(t.id)}
          onAlert={() => {}}
          onEntryClick={checkEntry.bind(null, i)} />
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
}
