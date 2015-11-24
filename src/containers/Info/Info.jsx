import React, { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import sortBy from 'lodash/collection/sortBy'
import { PageHeading, TreeView, IBox, ScrollPanel } from '../../components'
import { CompanyActions, ProjectActions } from '../../redux/modules'
import { isDefined, resolveProp, always, diff } from '../../utils'
import './info.less'

const { companyGroup } = CompanyActions

@connect(
  ({ company, project }) => ({
    company, project
  }),
  {
    ...CompanyActions,
    ...ProjectActions
  }
)
export default class Info extends Component {

  static propTypes = {
    children: T.any,
    company: T.object,
    project: T.object,
    loadCompanyGroup: T.func,
    loadProjectForCompany: T.func
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      collapsedCompanyGroup: companyGroup.map(always(false)),
      loadingCompanyGroup: companyGroup.map(always(false)),
      collapsedCompany: [],
      rightPanel: {
        type: null,
        id: null
      },
      companyProjectsLoading: [],
      companyProjectsLoaded: []
    }
  }

  componentWillReceiveProps (nextProps) {
    const diffProps = diff(this.props.project, nextProps.project)
    diffProps('companyProjectsLoading', (curr, next) => {
      this.setState({
        companyProjectsLoading: next
      })
    })
    diffProps('companyProjectsLoaded', (curr, next) => {
      const [ ...copy ] = curr
      next.forEach(val => {
        if (copy.indexOf(val) < 0) copy.push(val)
      })

      this.setState({
        companyProjectsLoaded: copy
      })
    })
  }

  componentDidMount () {
    // for socket or sth. else
  }

  render () {
    const {
      collapsedCompanyGroup
    } = this.state
    const {
      company: { pendingGroup, data: companyData, group: companySet },
    } = this.props
    const isPending = (key) => pendingGroup.indexOf(key) >= 0

    return (
      <div>
        <PageHeading title="Projects" breadcrumb={[
          { title: 'Home', link: '/' },
          { title: 'Projects', link: '/info' }
        ]} />
        <div className="info-content">
          <div className="row">
            <div className="info-tree">
              <ScrollPanel scrollTopAfterUpdate={false}>
                <div>
                  {companyGroup.map((group, i) => {
                    const { from, to, key } = group
                    const label = ( // group entry
                      <a className="entry" onClick={this._handleTreeEntryClick.bind(this, i, group)}>
                        <i className="fa fa-folder"></i>
                        <span className="shrink-span">{`${from} - ${to}`}</span>
                      </a>
                    )
                    return (
                      <TreeView key={i}
                        nodeLabel={label}
                        collapsed={collapsedCompanyGroup[i]}>
                        {isPending(key) && companySet[key].length <= 0 ? <div>Loading...</div> : (
                          sortBy(companySet[key].map(resolveProp(companyData)), 'name')
                            .map(::this._getCompanyEntry)
                        )}
                      </TreeView>
                    )
                  })}
                </div>
              </ScrollPanel>
            </div>
            <div className="info-panel relative">
              {this.props.children || this._getInitPage()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  _getInitPage () {
    return (
      <div className="center wel-page text-muted">
        <i className="fa fa-building-o"></i>
        <p>Select a company or project to view its information</p>
      </div>
    )
  }

  _getCompanyEntry (comp, i) {
    const {
      collapsedCompany
    } = this.state
    const {
      project: { data: projectData }
    } = this.props
    // company entry
    const compLabel = (
      <Link to={`/info/c/${comp._id}`} className="entry" onClick={this._handleCompanyEntryClick.bind(this, comp)}>
        <i className="fa fa-folder"></i>
        <span className="shrink-span">{comp.name}</span>
      </Link>
    )
    const collapsed = collapsedCompany.indexOf(comp._id) >= 0
    const isLoading = ({ _id }) => {
      return this.state.companyProjectsLoading.indexOf(_id) >= 0
    }
    const projectEntry = isLoading(comp) ? <div>Loading...</div>: (
      sortBy(comp.projects.map(resolveProp(projectData))
        .filter(isDefined), 'name')
        .map((p, i) => {
          return (
            // project entry
            <div key={i} className="tree-view_item project-entry">
              <a className='entry' onClick={this._handleProjectEntryClick.bind(this, p)}>
                <i className="fa fa-clipboard"></i>
                <span className="shrink-span">{p.name}</span>
              </a>
            </div>
          )
        })
    )

    return (
      <TreeView key={i}
        nodeLabel={compLabel}
        collapsed={collapsed}>
        {projectEntry}
      </TreeView>
    )
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

  _handleCompanyEntryClick (company) {
    const [ ...anotherCopy ] = this.state.collapsedCompany
    const { _id } = company
    const i = anotherCopy.indexOf(_id)
    if (i < 0) {
      anotherCopy.push(_id)
      this.props.loadProjectForCompany(company)
    }
    else anotherCopy.splice(i, 1)

    this.setState({
      collapsedCompany: anotherCopy,
      rightPanel: {
        type: 'company',
        id: _id
      }
    })
  }

  _handleProjectEntryClick ({ _id }) {
    this.setState({
      rightPanel: {
        type: 'project',
        id: _id
      }
    })
  }
}
