import React, { Component, PropTypes as T } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { TaskActions } from '../../redux/modules'
import { Animate, Dimmer, Toggle, ScrollPanel } from '../../components'
import './task.less'

@connect(
  state => ({
    task: state.task
  }),
  dispatch => ({
    ...bindActionCreators(TaskActions, dispatch)
  })
)
export default class Task extends Component {

  static propTypes = {
    task: T.object,
    load: T.func
  }

  constructor (props) {
    super(props)

    this.state = {
      loading: true
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
    const { task } = this.props

    return (
      <div>
        <div className="page-header">Task Board</div>
        <Animate name='fade'>
          {this.state.loading ? (
            <Dimmer key={0} className='task-dimmer' />
          ) : (
            <div style={{ backgroundColor: 'black', height: 200 }}>
              <div>Task</div>
              <div>{task.data.length}</div>
            </div>
          )}
        </Animate>
      </div>
    )
  }
}
