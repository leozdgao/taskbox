import React, { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'
import sortBy from 'lodash/collection/sortBy'
import { PageHeading, TreeView, IBox, ScrollPanel } from '../../components'
import { CompanyActions, ProjectActions } from '../../redux/modules'
import './info.less'

const { companyGroup } = CompanyActions

@connect(
  state => ({
    company: state.company,
    project: state.project
  }),
  {
    ...CompanyActions,
    ...ProjectActions
  }
)
export default class Info extends Component {

  static propTypes = {
    company: T.object,
    project: T.object,
    loadCompanyGroup: T.func,
    loadProjectByIds: T.func
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      collapsedCompanyGroup: companyGroup.map(() => false),
      loadingCompanyGroup: companyGroup.map(() => false),
      collapsedCompany: []
    }
  }

  componentDidMount () {

  }

  render () {
    const {
      collapsedCompanyGroup, collapsedCompany
    } = this.state
    const {
      company: { pendingGroup, data, group: companySet },
      project: { data: projectData }
    } = this.props
    const isPending = (key) => pendingGroup.indexOf(key) >= 0

    return (
      <div>
        <PageHeading title="Projects" breadcrumb={[
          { title: 'Home', link: '/' },
          { title: 'Projects', link: '/info' }
        ]} />
        <div className="row">
          <div className="col-md-4">
            <ScrollPanel>
              <div>
                {companyGroup.map((group, i) => {
                  const { from, to, key } = group
                  const label = (
                    <a className="entry" onClick={this._handleTreeEntryClick.bind(this, i, group)}>
                      <i className="fa fa-folder"></i>
                      {`${from} - ${to}`}
                    </a>
                  )

                  return (
                    <TreeView key={i}
                      nodeLabel={label}
                      collapsed={collapsedCompanyGroup[i]}>
                      {isPending(key) && companySet[key].length <= 0 ? <div>Loading...</div> : (
                        sortBy(companySet[key].map((_id) => data[_id]), 'name').map((comp, i) => {
                          const compLabel = <a className="entry" onClick={this._handleCompanyEntryClick.bind(this, comp)}><i className="fa fa-folder"></i> {comp.name}</a>
                          const collapsed = collapsedCompany.indexOf(comp._id) >= 0

                          return (
                            <TreeView key={i}
                              nodeLabel={compLabel}
                              collapsed={collapsed}>
                              {comp.projects.map((_id, i) => {
                                return projectData[_id] && (
                                  <div key={i} className="tree-view_item project-entry">
                                    <a className='entry'><i className="fa fa-clipboard"></i> {projectData[_id].name}</a>
                                  </div>
                                )
                              })}
                            </TreeView>
                          )
                        })
                      )}
                    </TreeView>
                  )
                })}
              </div>
            </ScrollPanel>
          </div>
          <div className="col-md-8">

          </div>
        </div>
      </div>
    )
  }

  _getInitPage () {

  }

  _handleTreeEntryClick (i, group, e) {
    const [ ...anotherCopy ] = this.state.collapsedCompanyGroup
    const collapsed = anotherCopy[i] = !this.state.collapsedCompanyGroup[i]

    this.setState({
      collapsedCompanyGroup: anotherCopy
    })

    if (collapsed) {
      this.props.loadCompanyGroup(group)
    }
  }

  _handleCompanyEntryClick ({ _id, projects }) {
    const [ ...anotherCopy ] = this.state.collapsedCompany
    const i = anotherCopy.indexOf(_id)
    if (i < 0) {
      anotherCopy.push(_id)
      this.props.loadProjectByIds(projects)
    }
    else anotherCopy.splice(i, 1)

    this.setState({
      collapsedCompany: anotherCopy
    })
  }
}
