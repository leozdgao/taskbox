import React, { Component, PropTypes } from 'react'
import cNames from 'classnames'

const toggleKeyGenerator = (function  () {
  let seed =  0
  return {
    next () {
      return `toggle_$${seed++}`
    }
  }
})()

export default class Toggle extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    text: PropTypes.string,
    checked: PropTypes.bool.isRequired,
    children: PropTypes.any
  }

  static defaultProps = {
    id: toggleKeyGenerator.next(),
    checked: false
  }

  constructor (props) {
    super(props)

    this.state = {
      checked: this.props.checked
    }
  }

  render () {
    return (
      <div className={cNames('ui toggle checkbox', this.props.className)}>
        <input ref='checkbox' id={this.props.id} type='checkbox' className='hidden' checked={this.state.checked} onChange={this._handleChange.bind(this)} />
        <label htmlFor={this.props.id}>{this.props.text || this.props.children}</label>
      </div>
    )
  }

  isChecked () {
    return this.state.checked
  }

  _handleChange () {
    this.setState({ checked: this.refs.checkbox.checked })
  }
}
