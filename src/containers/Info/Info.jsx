import React, { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import sortBy from 'lodash/collection/sortBy'
import reduce from 'lodash/collection/reduce'
import {
  PageHeading, TreeView, IBox,
  ScrollPanel, OverlayTrigger,
  Tooltip, CompanyEditModal
} from '../../components'
import { Request } from '../../redux/modules'
import { spreadStatus } from '../../redux/dataFetch'
import { isDefined, resolveProp, always, diff, resolvePropByPath } from '../../utils'
import './info.less'

const { CompanyModule, ProjectModule } = Request
const { actionCreators: CompanyActionCreators, companyGroup } = CompanyModule
const { actionCreators: ProjectActionCreators } = ProjectModule

const mapStateToProps = state => {
  const resolveState = resolvePropByPath(state)
  const addCompanyReqState = resolveState('request.company.add')
  const companyData = resolveState('storage.company.data')
  const projectData = resolveState('storage.project.data')
  const group = resolveState('storage.company.group')

  return {
    group: reduce(group, (acc, arr, groupKey) => {
      acc[groupKey] = sortBy(arr.map(resolveProp(companyData)).filter(isDefined), 'name')
      return acc
    }, {}),
    projectData,
    addCompanyReqState: {
      ...spreadStatus(addCompanyReqState)
    }
  }
}
const mapActionToProps = {
  loadGroup: CompanyActionCreators.loadGroup,
  addCompany: CompanyActionCreators.add,
  loadProjectUnderCompany: ProjectActionCreators.loadProjectUnderCompany
}

@connect(
  mapStateToProps,
  mapActionToProps
)
export default class Info extends Component {

  static propTypes = {
    children: T.any,
    addCompany: T.func,
    loadGroup: T.func,
    loadProjectUnderCompany: T.func,
    group: T.object,
    projectData: T.object,
    addCompanyReqState: T.object
  }

  state = {
    collapsedCompanyGroup: companyGroup.map(always(false)),
    loadingCompanyGroup: companyGroup.map(always(false)),
    collapsedCompany: [],
    modalShowed: false
  }

  componentWillReceiveProps (nextProps) {
    const { addCompanyReqState } = this.props
    const { addCompanyReqState: nextAddCompanyReqState } = nextProps

    if (!addCompanyReqState.isFulfilled && nextAddCompanyReqState.isFulfilled) {
      this.setState({ modalShowed: false })
    }
  }

  componentDidMount () {
    // for socket or sth. else
  }

  render () {
    const {
      collapsedCompanyGroup
    } = this.state
    const { group: groupData, addCompanyReqState } = this.props
    const tooltip = (
      <Tooltip placement='right'>Add company</Tooltip>
    )

    return (
      <div>
        <PageHeading title="Projects" breadcrumb={[
          { title: 'Home', link: '/' },
          { title: 'Projects', link: '/info' }
        ]} />
        <div className="info-content">
          <div className="row">
            <div className="info-tree">
              <div className="info-tree-head">
                <h4 className="inline-block mr-15"><i className="fa fa-building-o"></i> Companies</h4>
                <OverlayTrigger event='hover' placement='right' overlay={tooltip}>
                  <a className="pointer" onClick={() => this.setState({ modalShowed: true })}><i className="fa fa-plus"></i></a>
                </OverlayTrigger>
              </div>
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
                        {groupData[key].map(::this._getCompanyEntry)}
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
        <CompanyEditModal isShowed={this.state.modalShowed} isRequesting={addCompanyReqState.isPending}
          onHide={() => this.setState({ modalShowed: false })} onFormSubmit={this.props.addCompany} />
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
      projectData
    } = this.props
    // company entry
    const compLabel = (
      <Link to={`/info/c/${comp._id}`} className="entry" onClick={this._handleCompanyEntryClick.bind(this, comp)}>
        <i className="fa fa-folder"></i>
        <span className="shrink-span">{comp.name}</span>
      </Link>
    )
    const collapsed = collapsedCompany.indexOf(comp._id) >= 0
    const projectEntry =
      sortBy(comp.projects.map(resolveProp(projectData))
        .filter(isDefined), 'name')
        .map((p, i) => {
          return (
            // project entry
            <div key={i} className="tree-view_item project-entry">
              <Link to={`/info/p/${p._id}`} className='entry'>
                <i className="fa fa-clipboard"></i>
                <span className="shrink-span">{p.name}</span>
              </Link>
            </div>
          )
        })

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
      this.props.loadGroup(group)
    }
  }

  _handleCompanyEntryClick (company) {
    const [ ...anotherCopy ] = this.state.collapsedCompany
    const { _id } = company
    const i = anotherCopy.indexOf(_id)
    if (i < 0) {
      anotherCopy.push(_id)
      this.props.loadProjectUnderCompany(company)
    }
    else anotherCopy.splice(i, 1)

    this.setState({
      collapsedCompany: anotherCopy
    })
  }
}
