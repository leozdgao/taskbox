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
            <div>
              {task.data.map(this.getTaskPanel)}
            </div>
          )}
        </Animate>
      </div>
    )
  }

  getTaskPanel (task) {
    return (
      <div key={task.id} className='col-lg-6'>
        <div className='panel panel-inverse'>
          <div className='panel-heading'>
            <div className='panel-btn-heading'>
              <a className='btn btn-xs btn-icon btn-circle btn-warning'>
                <i className="fa fa-minus"></i>
              </a>
            </div>
            <h4 className='panel-title'>{task.title}</h4>
          </div>
          <div className='panel-body'>
            
          </div>
        </div>
      </div>
    )
  }
}
