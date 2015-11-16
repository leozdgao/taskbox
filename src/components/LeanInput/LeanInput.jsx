import React, { Component, PropTypes as T } from 'react'
import cNames from 'classnames'
import { createChainedFunction } from '../../utils'
import './leaninput.less'

class LeanInput extends Component {
  static propTypes = {
    className: T.string,
    defaultValue: T.string,
    onChange: T.func,
    autoFocus: T.bool
  }

  get value () {
    return this.state.value
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      value: this.props.defaultValue || ''
    }
  }

  componentDidMount () {
    if (this.props.autoFocus) {
      this.refs.input.focus()
    }
  }

  render () {
    const { className, onChange, ...others } = this.props
    const handleChange = createChainedFunction(::this._handleChange, onChange)
    return (
      <div className={cNames([ 'cleanText', className ])}>
        <input {...others} value={this.state.value} onChange={handleChange} ref="input" />
        <div className="strip"></div>
      </div>
    )
  }

  _handleChange (e) {
    this.setState({
      value: e.target.value
    })
  }
}

export default LeanInput
