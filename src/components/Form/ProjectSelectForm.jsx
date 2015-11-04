import React, { Component, PropTypes as T } from 'react'
import findWhere from 'lodash/collection/findWhere'
import DropdownInput from './DropDownInput'

class ProjectSelectForm extends Component {

  static propTypes = {
    avaliableCompanies: T.array
  }

  constructor (props) {
    super(props)

    this.state = {
      currentCompany: void 0
    }
  }

  render () {
    const { currentCompany } = this.state
    const companyMsg = currentCompany ? `${currentCompany.name} (${currentCompany.clientId})` : ''
    return (
      <form>
        <DropdownInput ref='company' items={this.props.avaliableCompanies}
          valueMap={c => c._id} nameMap={c => c.name}
          placeholder='Filter a company...'
          onValueChange={::this._handleDropdownInputChange} />
        <div className='mbt-10'>
          <label className='block'>Company selected: {companyMsg}</label>
          <a href='javascript:;'>Or create a new Company?</a>
        </div>
      </form>
    )
  }

  _handleDropdownInputChange (currentCompany) {
    this.setState({ currentCompany })
  }
}

export default ProjectSelectForm
