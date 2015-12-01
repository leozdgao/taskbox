import React, { Component, PropTypes as T } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'
import sortBy from 'lodash/collection/sortBy'
import { Spinner, OverlayTrigger, Tooltip, CompanyEditModal, ScrollPanel } from '../../components'
import { Request } from '../../redux/modules'
import { spreadStatus } from '../../redux/dataFetch'
import { isDefined, resolveProp, resolvePropByPath } from '../../utils'
import './companydetail.less'

const { CompanyModule, ProjectModule } = Request
const { actionCreators: CompanyActionCreators } = CompanyModule
const { actionCreators: ProjectActionCreators } = ProjectModule

function mapStateToProps (state, props) {
  const cid = props.params.cid
  const resolveState = resolvePropByPath(state)
  const companyReqState = resolveState('request.company.loadOne')
  const companyData = resolveState('storage.company.data')
  const projectUnderCompanyReqState = resolveState('request.project.loadProjectUnderCompany')
  const projectData = resolveState('storage.project.data')

  const companyUpdateState = resolveState('request.company.update')

  const currentCompany = companyData[cid]
  const projectsUnderCompany = currentCompany &&
    sortBy(currentCompany.projects.map(resolveProp(projectData)).filter(isDefined), 'name')

  return {
    companyVector: {
      val: currentCompany,
      ...spreadStatus(companyReqState, cid)
    },
    projectUnderCompanyVector: {
      val: projectsUnderCompany || [], // give a default value
      ...spreadStatus(projectUnderCompanyReqState, cid)
    },
    companyUpdateState: {
      ...spreadStatus(companyUpdateState)
    }
  }
}

const mapActionToProps = {
  loadCompany: CompanyActionCreators.loadOne,
  loadProjectUnderCompany: ProjectActionCreators.loadProjectUnderCompany,
  updateCompany: CompanyActionCreators.update
}

@connect(
  mapStateToProps,
  mapActionToProps
)
class CompanyDetail extends Component {

  static displayName = "CompanyDetail"

  static propTypes = {
    params: T.object,
    companyVector: T.object,
    projectUnderCompanyVector: T.object,
    companyUpdateState: T.object,

    loadCompany: T.func,
    loadProjectUnderCompany: T.func,
    updateCompany: T.func
  }

  state = {
    editModalShowed: false,
    addProjectModalShowed: false
  }

  componentWillReceiveProps (nextProps) {
    // ensure company fetch work
    const {
      params: { cid },
      companyVector,
      loadProjectUnderCompany,
      companyUpdateState
    } = this.props
    const {
      params: { cid: nextCid },
      companyVector: nextCompanyVector,
      companyUpdateState: nextCompanyUpdateState
    } = nextProps

    if (cid !== nextCid) {
      this.ensureDataFetch(nextProps)
    }
    else {
      if (!companyVector.isFulfilled && nextCompanyVector.isFulfilled) {
        loadProjectUnderCompany(nextCompanyVector.val)
      }

      if (!companyUpdateState.isFulfilled && nextCompanyUpdateState.isFulfilled) {
        // hide modal after update company
        this.setState({
          editModalShowed: false
        })
      }
    }
  }

  componentDidMount () {
    this.ensureDataFetch(this.props)
  }

  render () {
    const { companyVector } = this.props

    if (companyVector.isRejected) {
      return this._getErrorContent()
    }
    else if (companyVector.isFulfilled) {
      return this._getCompanyDetail()
    }
    else return <Spinner />
  }

  _getErrorContent () {
    return (
      <div className="center notf-page text-muted">
        <i className="fa fa-building-o"></i>
        <h2>404</h2>
        <p>Can't find your company.</p>
      </div>
    )
  }

  _getCompanyDetail () {
    const { companyVector, projectUnderCompanyVector, companyUpdateState } = this.props
    const { name, clientId, projects } = companyVector.val
    const addTooltip = (
      <Tooltip placement='bottom'>Add project</Tooltip>
    )
    const editTooltip = (
      <Tooltip placement='bottom'>Edit company</Tooltip>
    )

    return (
      <ScrollPanel className="company-detail">
        <header>
          <h2>{`${name} (${clientId})`}</h2>
          <div>
            <OverlayTrigger event='hover' placement='bottom' overlay={addTooltip}>
              <a className="head-icon"><i className="fa fa-plus"></i></a>
            </OverlayTrigger>
            <OverlayTrigger event='hover' placement='bottom' overlay={editTooltip}>
              <a className="head-icon" onClick={() => this.setState({ editModalShowed: true })}>
                <i className="fa fa-pencil-square-o"></i>
              </a>
            </OverlayTrigger>
          </div>
        </header>
        <table className="company-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>StartDate</th>
              <th>LastUpdateDate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {projectUnderCompanyVector.val
              .map(({ _id, name, startDate, lastUpdateDate, status }, i) => {
                return (
                  <tr key={i}>
                    <td><Link to={`/info/p/${_id}`}>{name}</Link></td>
                    <td>{moment(startDate).format('YYYY-MM-DD')}</td>
                    <td>{moment(lastUpdateDate).format('YYYY-MM-DD')}</td>
                    <td>{status}</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
        <CompanyEditModal
          isShowed={this.state.editModalShowed} body={companyVector.val}
          isRequesting={companyUpdateState.isPending} isFailed={companyUpdateState.isRejected}
          onHide={() => this.setState({ editModalShowed: false })}
          onFormSubmit={::this._updateCompany} />
      </ScrollPanel>
    )
  }

  // use data from the store or send an api request
  ensureDataFetch (props) {
    const {
      params: { cid },
      loadCompany
    } = props

    loadCompany(cid)
  }

  _updateCompany (body) {
    const { companyVector: { val }, updateCompany } = this.props
    updateCompany(val._id, body)
  }
}

export default CompanyDetail
