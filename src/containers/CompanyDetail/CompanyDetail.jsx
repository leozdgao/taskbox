import React, { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'
import sortBy from 'lodash/collection/sortBy'
import { isDefined, resolveProp } from '../../utils'
import './companydetail.less'

@connect(
  state => ({
    company: state.company,
    project: state.project
  })
)
class CompanyDetail extends Component {

  static displayName = "CompanyDetail"

  static propTypes = {
    params: T.object,
    project: T.object,
    company: T.object
  }

  render () {
    const {
      params: { cid },
      project: { data: projectData },
      company: { data: companyData }
    } = this.props

    const company = companyData[cid]
    const { name, clientId, projects } = company

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
                    <td>{startDate}</td>
                    <td>{lastUpdateDate}</td>
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

export default CompanyDetail
