import React, { Component, PropTypes as T } from 'react'
import cNames from 'classnames'
import { DropdownList } from '../../components'
import './dropdowninput.less'

class DropdownInput extends Component {

  static propTypes = {
    className: T.string,
    defaultValue: T.any,
    items: T.array,
    valueMap: T.func,
    nameMap: T.func,
    children: T.any,
    onValueChange: T.func
  }

  static defaultProps = {
    items: [],
    valueMap: i => i,
    nameMap: i => i,
    onValueChange: () => {}
  }

  get value () {
    return this.props.valueMap(this.state.value)
  }

  constructor (props) {
    super(props)

    const { defaultValue, nameMap } = this.props
    const value = defaultValue || {}

    this.state = {
      value,
      isDropDownShowed: false,
      items: [],
      inputValue: nameMap(value)
    }
  }

  render () {
    return (
      <div className={cNames([ 'dropdown-input', this.props.className ])}>
        <input {...this.props} className='form-control' onChange={::this._onChange} value={this.state.inputValue} />
        <DropdownList className='dropdown-menu' animateName='slideDown'
          open={this.state.isDropDownShowed} onHide={() => this.setState({ isDropDownShowed: false })}
          height={200}
          >
          {this.state.items.map((item, i) => {
            return (
              <option key={i} onClick={this._handleItemClick.bind(this, item)}><a href='javascript:;'>{this.props.nameMap(item)}</a></option>
            )
          })}
        </DropdownList>
      </div>
    )
  }

  _handleItemClick (item, e) {
    this.setState({
      value: item,
      inputValue: this.props.nameMap(item)
    }, () => { this.props.onValueChange(this.state.value) })
  }

  _onChange (e) {
    if (e.target.value) {
      if (this._ltr) clearTimeout(this._ltr)
      this._ltr = setTimeout(() => {
        const val = e.target.value.toLowerCase()
        this.setState({
          items: this.props.items.filter((item) => {
            const sample = this.props.nameMap(item).toLowerCase()
            return sample.indexOf(val) === 0
          }),
          isDropDownShowed: true
        })
      }, 500)
    }
    else {
      if (this._ltr) clearTimeout(this._ltr)
      this.setState({
        items: [],
        isDropDownShowed: false
      })
    }

    this.setState({
      inputValue: e.target.value
    })
  }
}

export default DropdownInput
