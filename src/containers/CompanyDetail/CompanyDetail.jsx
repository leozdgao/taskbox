import React, { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import sortBy from 'lodash/collection/sortBy'
import { Spinner } from '../../components'
import { CompanyActions, ProjectActions } from '../../redux/modules'
import { isDefined, resolveProp, has } from '../../utils'
import './companydetail.less'

@connect(
  state => ({
    company: state.company,
    project: state.project
  }),
  {
    loadCompany: CompanyActions.loadOne,
    loadProjectForCompany: ProjectActions.loadProjectForCompany
  }
)
class CompanyDetail extends Component {

  static displayName = "CompanyDetail"

  static propTypes = {
    params: T.object,
    project: T.object,
    company: T.object,
    loadCompany: T.func,
    loadProjectForCompany: T.func
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      isLoading: true,
      company: null,
      loadFailed: false
    }
  }

  componentWillReceiveProps (nextProps) {
    const {
      params: { cid },
      company: {
        data: companyData, loadedCompany,
        loadingCompany, loadFailedCompany
      },
      project: {
        companyProjectsLoading,
        companyProjectsLoaded
      }
    } = nextProps

    // handle error
    //

    if (loadingCompany.indexOf(cid) >=0 ) {
      this.setState({ isLoading: true, loadFailed: false })
    }
    if (loadFailedCompany.indexOf(cid) >= 0) {
      this.setState({ isLoading: false, loadFailed: true })
    }
    if (loadedCompany.indexOf(cid) >= 0) {
      this.setState({
        company: companyData[cid],
        isLoading: false, loadFailed: false
      })
    }

    if (companyData[cid] &&
      !has(companyProjectsLoading, cid) &&
      !has(companyProjectsLoaded, cid)) {
      this.props.loadProjectForCompany(companyData[cid])
    }
  }

  componentDidMount () {
    const {
      params: { cid },
      company: { data: companyData }
    } = this.props
    const company = companyData[cid]
    if (company == null) {
      this.props.loadCompany(cid)
    }
    else {
      this.setState({
        company, isLoading: false
      })
    }
  }

  render () {
    const {
      params: { cid },
      project: { data: projectData },
      company: { data: companyData }
    } = this.props

    if (this.state.isLoading) return <Spinner />
    else {
      const { name, clientId, projects } = this.state.company
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
              {sortBy(
                projects.map(resolveProp(projectData))
                .filter(isDefined), 'name')
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
  }
}

export default CompanyDetail
