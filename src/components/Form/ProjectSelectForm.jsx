import React, { Component, PropTypes as T } from 'react'
import findWhere from 'lodash/collection/findWhere'
import { DropDownInput } from '../../components'

const getValue = (obj, key) => {
  if (obj != null) return obj[key]
}

class ProjectSelectForm extends Component {

  static propTypes = {
    currentCompany: T.object,
    currentProject: T.object,
    avaliableCompanies: T.array,
    projectOptions: T.array,
    onCompanyChange: T.func,
    onProjectChange: T.func
  }

  static defaultProps = {
    avaliableCompanies: [],
    projectOptions: [],
    onCompanyChange: () => {},
    onProjectChange: () => {}
  }

  componentWillReceiveProps (nextProps) {
    const diff = (a, b) => {
      if (a.length !== b.length) return true
      else {
        for (let i = 0, l = a.length; i < l; i++) {
          if (a[i]._id !== b[i]._id) return true
        }

        return false
      }
    }

    if (diff(nextProps.projectOptions, this.props.projectOptions)) {
      const currentProject = nextProps.projectOptions[0]
      this.props.onProjectChange(currentProject)
    }
  }

  render () {
    const { currentCompany, currentProject, projectOptions, avaliableCompanies } = this.props
    const companyMsg = currentCompany ? `${currentCompany.name} (${currentCompany.clientId})` : ''
    const projectMsg = currentProject ? `${currentProject.name}` : ''

    return (
      <form>
        <DropDownInput ref='companyId'
          defaultValue={currentCompany}
          items={avaliableCompanies}
          valueMap={c => c._id} nameMap={c => c.name}
          placeholder='Filter a company...'
          onValueChange={this.props.onCompanyChange} />
        <div className='mbt-10'>
          <label className='block'>Company selected: {companyMsg}</label>
          <a href='javascript:;'>Or create a new Company?</a>
        </div>
        {currentCompany ?
          <div>
            <select ref='projectId' className='form-control'
              defaultValue={getValue(currentProject, '_id')}
              onChange={::this._handleChange}>
              {projectOptions.map((project, i) => {
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

  _handleChange (e) {
    const currentProject = findWhere(this.props.projectOptions, { _id: e.target.value })
    this.props.onProjectChange(currentProject)
  }
}

export default ProjectSelectForm
