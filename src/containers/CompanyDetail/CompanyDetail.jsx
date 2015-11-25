import React, { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import sortBy from 'lodash/collection/sortBy'
import { Spinner } from '../../components'
import { CompanyActions, ProjectActions } from '../../redux/modules'
import { isDefined, resolveProp, has, diff } from '../../utils'
import './companydetail.less'

function mapStateToProps (state, props) {
  const cid = props.params.cid
  const {
    company: {
      data: companyData, loadedCompany,
      loadingCompany, loadFailedCompany
    },
    project: {
      data: projectData,
      companyProjectsLoading,
      companyProjectsLoaded
    }
  } = state

  const currentCompany = companyData[cid]
  const needFetchCompany = !isDefined(currentCompany)
  const companyFetching = has(loadingCompany, cid)
  const companyFetchFailed = has(loadFailedCompany, cid)

  const projectsUnderCompany = currentCompany &&
    sortBy(currentCompany.projects.map(resolveProp(projectData)).filter(isDefined), 'name') || []
  const needFetchProjectsUnderCompany = currentCompany &&
    !has(companyProjectsLoading, cid) && !has(companyProjectsLoaded, cid) &&
    currentCompany.projects.length > projectsUnderCompany

  return ({
    currentCompany, needFetchCompany,
    companyFetching, companyFetchFailed,

    projectsUnderCompany,
    needFetchProjectsUnderCompany
  })
}

@connect(
  mapStateToProps,
  {
    loadCompany: CompanyActions.loadOne,
    loadProjectForCompany: ProjectActions.loadProjectForCompany
  }
)
class CompanyDetail extends Component {

  static displayName = "CompanyDetail"

  static propTypes = {
    currentCompany: T.object,
    needFetchCompany: T.bool,
    companyFetching: T.bool,
    companyFetchFailed: T.bool,

    projectsUnderCompany: T.array,
    needFetchProjectsUnderCompany: T.bool,

    loadCompany: T.func,
    loadProjectForCompany: T.func
  }

  componentWillReceiveProps (nextProps) {
    // ensure company fetch work
    this.ensureDataFetch(nextProps)
  }

  componentDidMount () {
    this.ensureDataFetch(this.props)
  }

  render () {
    const {
      needFetchCompany,
      companyFetching,
      companyFetchFailed,
    } = this.props

    if (needFetchCompany || companyFetching) {
      return <Spinner />
    }
    else if (companyFetchFailed) { // can't find
      return this._getErrorContent()
    }
    else {
      return this._getCompanyDetail()
    }
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
    const {
      currentCompany,
      projectsUnderCompany
    } = this.props
    const { name, clientId, projects } = currentCompany
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
            {projectsUnderCompany
              .map(({ name, startDate, lastUpdateDate, status }, i) => {
                return (
                  <tr key={i}>
                    <td>{name}</td>
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
      currentCompany,
      companyFetching,
      needFetchCompany,
      needFetchProjectsUnderCompany,
      params: { cid }
    } = props

    if (needFetchCompany && !companyFetching) {
      props.loadCompany(cid)
    }

    if (needFetchProjectsUnderCompany) {
      // currentCompany will not be null here
      props.loadProjectForCompany(currentCompany)
    }
  }
}

export default CompanyDetail
