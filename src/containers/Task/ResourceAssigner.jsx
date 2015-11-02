import React, { Component, PropTypes as T } from 'react'
import assign from 'object-assign'
import { DropdownList, OverlayTrigger, Tooltip } from '../../components'

class ResourceAssigner extends Component {

  static propTypes = {
    avaliableResources: T.array.isRequired,
    valueMap: T.func
  }

  static defaultProps = {
    avaliableResources: [],
    valueMap: r => r.resourceId
  }

  constructor (props) {
    super(props)

    this.state = {
      isDropDownShowed: false,
      assignedResources: []
    }
  }

  get value () {
    return this.state.assignedResources.map(this.props.valueMap)
  }

  render () {
    return (
      <div className="assigner">
        <a className="btn btn-sm btn-white" onClick={::this._openDropdown}>Add</a>
        <div className="rlist">
          {this.state.assignedResources.map((r, i) => {
            const tooltip = (
              <Tooltip placement='bottom'>{r.name}</Tooltip>
            )
            return (
              <OverlayTrigger key={i} event='hover' placement='bottom' overlay={tooltip}>
                <a onClick={this._removeResource.bind(this, r)}>
                  <img className="avatar" src={r.avatar} />
                </a>
              </OverlayTrigger>
            )
          })}
        </div>
        <DropdownList className='dropdown-menu' animateName='slideDown' open={this.state.isDropDownShowed} onHide={::this._hideDropdown} notHideIfClickEntry>
          {this.props.avaliableResources.filter(r => {
            return r.resourceId > 0 && this.state.assignedResources.indexOf(r) < 0
          }).map((r, i) => {
            return <option key={i} onClick={this._addResource.bind(this, r)}><a href="javascript:;"><img className="avatar" src={r.avatar} />{r.name}</a></option>
          })}
        </DropdownList>
      </div>
    )
  }

  _openDropdown () {
    if (this.props.avaliableResources.length !== this.state.assignedResources.length) {
      this.setState({
        isDropDownShowed: true
      })
    }
  }

  _hideDropdown () {
    this.setState({
      isDropDownShowed: false
    })
  }

  _addResource (resource) {
    this.setState({
      assignedResources: [].concat(this.state.assignedResources, resource)
    })
  }

  _removeResource (resource) {
    const i = this.state.assignedResources.indexOf(resource)
    this.setState({
      assignedResources: [
        ...this.state.assignedResources.slice(0, i),
        ...this.state.assignedResources.slice(i + 1)
      ]
    })
  }
}

export default ResourceAssigner
