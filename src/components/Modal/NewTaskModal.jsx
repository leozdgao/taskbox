import React, { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'
import map from 'lodash/collection/map'
import sortBy from 'lodash/collection/sortBy'
import { TaskActions } from '../../redux/modules'
import { Request, Views } from '../../redux/modules'
import { TaskForm, ProjectSelectForm } from '../../components'
import { resolveProp, isDefined, resolvePropByPath } from '../../utils'
import ModalWrapper from './ModalWrapper'

const { NewTaskModalModule } = Views
const { CompanyModule } = Request
const { actionCreators: NewTaskModalActions } = NewTaskModalModule
const { actionCreators: CompanyActions } = CompanyModule

const mapStateToProps = state => {
  const resolveState = resolvePropByPath(state)
  const { step, currentProject, currentCompany, projectOptions } = resolveState('views.newTaskModal')
  const companyData = resolveState('storage.company.data')

  return {
    avaliableCompanies: sortBy(map(companyData, val => val), 'name'),
    step, currentProject, currentCompany,
    projectOptions: sortBy(projectOptions, 'name')
  }
}
const mapActionToProps = {
  nextStep: NewTaskModalActions.nextStep,
  prevStep: NewTaskModalActions.prevStep,
  loadAllCompany: CompanyActions.loadAll,
  selectCompany: NewTaskModalActions.selectCompany,
  selectProject: NewTaskModalActions.selectProject,
  publishNewTask: TaskActions.publishNewTask,
  reset: NewTaskModalActions.reset
}

@connect(
  mapStateToProps,
  mapActionToProps
)
class NewTaskModal extends Component {

  static contextTypes = {
    resourceInfo: T.array
  }

  static propTypes = {
    avaliableCompanies: T.array,
    projectOptions: T.array,
    currentProject: T.object,
    currentCompany: T.object,
    step: T.number,
    isShowed: T.bool,
    onSuccess: T.func,
    onSubmit: T.func,
    onHide: T.func,
    nextStep: T.func,
    prevStep: T.func,
    loadAllCompany: T.func,
    selectCompany: T.func,
    selectProject: T.func,
    publishNewTask: T.func,
    reset: T.func
  }

  static defaultProps = {
    isShowed: false,
    onSubmit: () => {},
    onHide: () => {}
  }

  constructor (props) {
    super(props)

    this._initState = {
      msg: '',
      submitting: false
    }

    this.state = this._initState
  }

  componentWillReceiveProps (nextProps) {
    // reset form after close this modal
    if (this.props.isShowed && !nextProps.isShowed) {
      this.props.reset() // reset modal state
    }
  }

  componentDidMount () {
    this.props.loadAllCompany()
  }

  // componentWillUnmount () {
  //   // CompanyActions.dispose()
  // }

  render () {
    return (
      <ModalWrapper isShowed={this.props.isShowed}>
        {this._getContent()}
      </ModalWrapper>
    )
  }

  setMessage (msg) {
    this.setState({ msg })
  }

  _getContent () {
    const { step } = this.props
    if (step === 0) return this._confirmProject()
    if (step === 1) return this._newTaskContent()
  }

  _confirmProject () {
    const {
      avaliableCompanies: companies,
      currentProject, currentCompany,
      projectOptions,
      // actions
      selectCompany, selectProject
    } = this.props

    return (
      <div>
        <ModalWrapper.Header>
          <button type="button" className="close" onClick={this.props.onHide}>
            <span aria-hidden="true">×</span>
          </button>
          <h4 className="modal-title">Choose a project</h4>
        </ModalWrapper.Header>
        <ModalWrapper.Content>
          <ProjectSelectForm
            currentCompany={currentCompany}
            currentProject={currentProject}
            avaliableCompanies={companies}
            projectOptions={projectOptions}
            onCompanyChange={selectCompany}
            onProjectChange={selectProject} />
        </ModalWrapper.Content>
        <ModalWrapper.Footer>
          <button type="button" className="btn btn-sm btn-white" onClick={this.props.onHide}>Cancel</button>
          {currentProject ?
            <button type="button" className="btn btn-sm btn-info" onClick={this.props.nextStep}>Next</button>
            : null
          }
        </ModalWrapper.Footer>
      </div>
    )
  }

  _newTaskContent () {
    const { currentProject, currentCompany } = this.props
    const defaultTaskTitle = currentProject && currentCompany ? `${currentCompany.name} - ${currentProject.name}` : ''
    return (
      <div>
        <ModalWrapper.Header>
          <button type="button" className="close" onClick={this.props.onHide}>
            <span aria-hidden="true">×</span>
          </button>
          <h4 className="modal-title">Publish a new Task</h4>
        </ModalWrapper.Header>
        <ModalWrapper.Content>
          <TaskForm
            ref='taskform'
            defaultTaskTitle={defaultTaskTitle}
            avaliableResources={this.context.resourceInfo} />
        </ModalWrapper.Content>
        <ModalWrapper.Footer>
          <span className='help-text text-danger'>{this.state.msg}</span>
          <button type="button" className="btn btn-sm btn-white" onClick={this.props.prevStep}>Back</button>
          <button type="button" className="btn btn-sm btn-success" onClick={::this._onClick} disabled={this.state.submitting}>Publish</button>
        </ModalWrapper.Footer>
      </div>
    )
  }

  _onClick () {
    const form = this.refs.taskform
    form.validate()

    const { errmsg, body } = form

    if (errmsg) {
      this.setState({ msg: errmsg })
    }
    else {
      this.setState({
        msg: '', submitting: true
      }, () => {
        body.projectId = this.props.currentProject._id

        this.props.publishNewTask(body, ({ status, body }) => {
          if (Number(status) !== 200) {
            this.setState({ msg: 'Publish failed, please try again later.' })
          }
          else this.props.onSuccess(body.new)
        })
      })
    }
  }
}

export default NewTaskModal
