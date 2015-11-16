import React, { Component, PropTypes as T } from 'react'
import findWhere from 'lodash/collection/findWhere'
import { DropdownInput } from '../../components'

const getValue = (obj, key) => {
  if (obj != null) return obj[key]
}

class ProjectSelectForm extends Component {

  static propTypes = {
    defaultCompany: T.object,
    defaultProject: T.object,
    avaliableCompanies: T.array,
    currentProjectItems: T.array,
    onCompanyChange: T.func,
    onProjectChange: T.func
  }

  static defaultProps = {
    avaliableCompanies: [],
    currentProjectItems: [],
    onCompanyChange: () => {},
    onProjectChange: () => {}
  }

  constructor (props) {
    super(props)

    const { defaultProject, defaultCompany } = this.props

    this.state = {
      currentCompany: defaultCompany,
      currentProject: defaultProject
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentProjectItems !== this.props.currentProjectItems) {
      const currentProject = nextProps.currentProjectItems[0]
      this.setState({
        currentProject
      }, () => {
        this.props.onProjectChange(currentProject)
      })
    }
  }

  render () {
    const { currentCompany, currentProject } = this.state
    const companyMsg = currentCompany ? `${currentCompany.name} (${currentCompany.clientId})` : ''
    const projectMsg = currentProject ? `${currentProject.name}` : ''
    return (
      <form>
        <DropdownInput ref='companyId'
          defaultValue={currentCompany}
          items={this.props.avaliableCompanies}
          valueMap={c => c._id} nameMap={c => c.name}
          placeholder='Filter a company...'
          onValueChange={::this._handleDropdownInputChange} />
        <div className='mbt-10'>
          <label className='block'>Company selected: {companyMsg}</label>
          <a href='javascript:;'>Or create a new Company?</a>
        </div>
        {this.state.currentCompany ?
          <div>
            <select ref='projectId' className='form-control'
              defaultValue={getValue(this.state.currentProject, '_id')}
              onChange={::this._handleChange}>
              {this.props.currentProjectItems.map((project, i) => {
                return <option key={i} value={project._id}>{project.name}</option>
              })}
            </select>
            <div className='mbt-10'>
              <label className='block'>Project selected: {projectMsg}</label>
              <a href='javascript:;'>Or create a new Proejct for this company?</a>
            </div>
          </div>
          : null
        }
      </form>
    )
  }

  _handleDropdownInputChange (currentCompany) {
    this.setState({ currentCompany }, () => {
      this.props.onCompanyChange(currentCompany)
    })
  }

  _handleChange (e) {
    const currentProject = findWhere(this.props.currentProjectItems, { _id: e.target.value })
    this.setState({ currentProject }, () => {
      this.props.onProjectChange(currentProject)
    })
  }
}

export default ProjectSelectForm
