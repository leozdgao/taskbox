import React, { Component, PropTypes as T } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { TaskActions, ResourceActions } from '../../redux/modules'
import { Animate, Dimmer, TaskPanel, Modal } from '../../components'
import './task.less'

@connect(
  state => ({
    task: state.task
  }),
  dispatch => ({
    loadResource: () => {
      dispatch(ResourceActions.load())
    },
    ...bindActionCreators(TaskActions, dispatch)
  })
)
export default class Task extends Component {

  static propTypes = {
    task: T.object,
    load: T.func,
    loadResource: T.func
  }

  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      isModalShowed: false
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
    this.props.loadResource()
  }

  componentWillUnmount () {
    TaskActions.dispose()
  }

  render () {
    const { task } = this.props

    return (
      <div>
        <div className="page-header">Task Board</div>
        <Animate name='fade'>
          {this.state.loading ? (
            <Dimmer key={0} className='task-dimmer' />
          ) : (
            <div>
              {task.data.map(::this.getTaskPanel)}
            </div>
          )}
        </Animate>
      </div>
    )
  }

  getTaskPanel (task) {
    return (
      <div key={task.id} className='col-lg-6'>
        <TaskPanel task={task} onClick={::this._handleTaskClick(task.id)} />
        {/* portal */}
        <Modal isShowed={this.state.isModalShowed} transitionTimeout={500}>

        </Modal>
      </div>
    )
  }

  _handleTaskClick (id) {
    return () => {

    }
  }
}
