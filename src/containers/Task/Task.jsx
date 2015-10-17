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

  componentDidMount () {
    this.props.load()
  }

  render () {
    const { task } = this.props

    return (
      <Animate name='taskFade'>
        {task.loading ? (
          <Dimmer className='task-dimmer' />
        ) : (
          <div style={{ backgroundColor: 'black' }} key={1}>
            <div>Task</div>
            <div>{task.data.length}</div>
          </div>
        )}
      </Animate>
    )
  }
}
