import React, { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'
import { PageHeading, TreeView } from '../../components'
import { CompanyActions, ProjectActions } from '../../redux/modules'
import './info.less'

const treeGroup = [
  { from: '0', to: '9' },
  { from: 'A', to: 'E' },
  { from: 'F', to: 'K' },
  { from: 'L', to: 'N' },
  { from: 'O', to: 'R' },
  { from: 'S', to: 'Z' }
]

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

  constructor (props, context) {
    super(props, context)

    this.state = {
      collapsedCompanyGroup: treeGroup.map(() => true)
    }
  }

  componentDidMount () {

  }

  render () {
    const { collapsedCompanyGroup } = this.state

    return (
      <div>
        <PageHeading title="Projects" breadcrumb={[
          { title: 'Home', link: '/' },
          { title: 'Projects', link: '/info' }
        ]} />
        <div>
          <div className="col-md-4">
            {treeGroup.map(({ from, to }, i) => {
              const label = <span onClick={this._handleTreeEntryClick.bind(this, i)}><i className="fa fa-folder-open"></i> {`${from} - ${to}`}</span>
              return (
                <TreeView key={i}
                  nodeLabel={label}
                  collapsed={collapsedCompanyGroup[i]}
                  onClick={this._handleTreeEntryClick.bind(this, i)}>
                  <div><i className="fa fa-folder-open"></i>company0</div>
                  <div><i className="fa fa-folder-open"></i>company0</div>
                  <div><i className="fa fa-folder-open"></i>company0</div>
                  <div><i className="fa fa-folder-open"></i>company0</div>
                  <div><i className="fa fa-folder-open"></i>company0</div>
                </TreeView>
              )
            })}
          </div>
          <div className="col-md-8"></div>
        </div>
      </div>
    )
  }

  _handleTreeEntryClick (i, e) {
    const [ ...anotherCopy ] = this.state.collapsedCompanyGroup
    anotherCopy[i] = !this.state.collapsedCompanyGroup[i]

    this.setState({
      collapsedCompanyGroup: anotherCopy
    })
  }
}
