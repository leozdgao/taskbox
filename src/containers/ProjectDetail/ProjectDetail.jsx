import React, { Component, PropTypes as T } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'
import { Spinner, ScrollPanel } from '../../components'
import { Request } from '../../redux/modules'
import { resolvePropByPath } from '../../utils'
import { spreadStatus } from '../../redux/dataFetch'
import './projectdetail.less'

const toProjectType = ({ isPlugin, isCodeBase, isUtility, isPAPI, isWebService }) => {
  const types = []
  if (isPlugin) types.push('Plugin')
  if (isCodeBase) types.push('CodeBase')
  if (isUtility) types.push('Utility')
  if (isPAPI) types.push('PAPI')
  if (isWebService) types.push('WebService')
  return `[${types.join('/')}]`
}

const { CompanyModule, ProjectModule } = Request
const { actionCreators: CompanyActionCreators } = CompanyModule
const { actionCreators: ProjectActionCreators } = ProjectModule

const mapStateToProps = (state, props) => {
  const { params: { pid } } = props
  const resolveState = resolvePropByPath(state)
  const projectReqState = resolveState('request.project.loadOne')
  const companyReqState = resolveState('request.company.loadOne')
  const projectData = resolveState('storage.project.data')
  const companyData = resolveState('storage.company.data')

  const currentProject = projectData[pid]
  const currentCompany = currentProject && companyData[currentProject.companyId]

  return {
    projectVector: {
      val: currentProject,
      ...spreadStatus(projectReqState, pid)
    },
    companyVector: {
      val: currentCompany,
      ...spreadStatus(companyReqState, currentProject && currentProject.companyId)
    }
  }
}

const mapActionToProps = {
  loadProject: ProjectActionCreators.loadOne,
  loadCompany: CompanyActionCreators.loadOne
}

@connect(
  mapStateToProps,
  mapActionToProps
)
class ProjectDetail extends Component {
  static propTypes = {
    params: T.object,
    loadProject: T.func,
    loadCompany: T.func,
    projectVector: T.object,
    companyVector: T.object
  }

  componentWillReceiveProps (nextProps) {
    const { params: { pid }, projectVector, loadCompany } = this.props
    const { params: { pid: nextPid }, projectVector: nextProjectVector } = nextProps
    if (pid !== nextPid) {
      this.ensureDataFetch(nextProps)
    }
    else {
      if (!projectVector.isFulfilled && nextProjectVector.isFulfilled) { // project loaded then get company
        loadCompany(nextProjectVector.val.companyId)
      }
    }
  }

  componentDidMount () {
    this.ensureDataFetch(this.props)
  }

  render () {
    const { projectVector } = this.props

    if (projectVector.isRejected) {
      return this._getErrorContent()
    }
    else if (projectVector.isFulfilled) {
      return this._getProjectDetail()
    }
    else return <Spinner />
  }

  _getProjectDetail () {
    const { projectVector, companyVector } = this.props
    const { name, companyId, sourceCode,
      assemblyName, currentVersion,
      startDate, lastUpdateDate, status
    } = projectVector.val
    // leave empty if company not fetched
    const { name: companyName = '', clientId = '' } = companyVector.val || {}

    return (
      <ScrollPanel className="project-detail">
        <h2>
          <Link to={`/info/c/${companyId}`}>{`${companyName} (${clientId})`}</Link> - {`${name}`}
        </h2>
        <table className="table">
          <tbody>
            <tr>
              <td width="240"><label>Assembly Name</label></td>
              <td>{assemblyName}</td>
            </tr>
            <tr>
              <td><label>Source Code</label></td>
              <td>{sourceCode}</td>
            </tr>
            <tr>
              <td><label>Version</label></td>
              <td>{currentVersion}</td>
            </tr>
            <tr>
              <td><label>Start Date</label></td>
              <td>{moment(startDate).format('YYYY-MM-DD')}</td>
            </tr>
            <tr>
              <td><label>Last Update Date</label></td>
              <td>{moment(lastUpdateDate).format('YYYY-MM-DD')}</td>
            </tr>
            <tr>
              <td><label>Type</label></td>
              <td>{toProjectType(projectVector.val)}</td>
            </tr>
          </tbody>
        </table>
        <table className="table mt-15">
          <thead>
            <tr className="active">
              <td width="240">ClientID</td>
              <td>EncryptKey</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{clientId}</td>
              <td>*^c5Tred#w+ROA1fkIcyFXPx8J8NtoU/3I9PwmSe0faFydVF9qDfi/yLAjDB+DTD040K4Bpq5e</td>
            </tr>
            <tr>
              <td>3010000444 (Test only)</td>
              <td>*^c5Tred#w+ROA1fkIcyFXPx8J8NtoU/3I9PwmSe0faFydVF9qDfi/yLAjDB+DTD040K4Bpq5e</td>
            </tr>
          </tbody>
        </table>
      </ScrollPanel>
    )
  }

  _getErrorContent () {
    return (
      <div className="center notf-page text-muted">
        <i className="fa fa-building-o"></i>
        <h2>404</h2>
        <p>Can't find your project.</p>
      </div>
    )
  }

  ensureDataFetch (props) {
    const {
      params: { pid },
      loadProject
    } = props

    loadProject(pid)
  }
}

export default ProjectDetail
