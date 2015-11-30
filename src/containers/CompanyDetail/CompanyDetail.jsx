import React, { Component, PropTypes as T } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'
import sortBy from 'lodash/collection/sortBy'
import { Spinner } from '../../components'
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

  const currentCompany = companyData[cid]
  const projectsUnderCompany = currentCompany && sortBy(currentCompany.projects.map(resolveProp(projectData)).filter(isDefined), 'name')

  return {
    companyVector: {
      val: currentCompany,
      ...spreadStatus(companyReqState, cid)
    },
    projectUnderCompanyVector: {
      val: projectsUnderCompany || [], // give a default value
      ...spreadStatus(projectUnderCompanyReqState, cid)
    }
  }
}

const mapActionToProps = {
  loadCompany: CompanyActionCreators.loadOne,
  loadProjectUnderCompany: ProjectActionCreators.loadProjectUnderCompany
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

    loadCompany: T.func,
    loadProjectUnderCompany: T.func
  }

  componentWillReceiveProps (nextProps) {
    // ensure company fetch work
    const { params: { cid }, companyVector, loadProjectUnderCompany } = this.props
    const { params: { cid: nextCid }, companyVector: nextCompanyVector } = nextProps

    if (cid !== nextCid) {
      this.ensureDataFetch(nextProps)
    }
    else {
      if (!companyVector.isFulfilled && nextCompanyVector.isFulfilled) {
        loadProjectUnderCompany(nextCompanyVector.val)
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
    const { companyVector, projectUnderCompanyVector } = this.props
    const { name, clientId, projects } = companyVector.val

    return (
      <div>
        <h2>{`${name} (${clientId})`}</h2>
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
      </div>
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
}

export default CompanyDetail
