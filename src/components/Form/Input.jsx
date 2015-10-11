import React, { Component, PropTypes as T } from 'react'
import cNames from 'classnames'

// default Input
export default class Input extends Component {

  static propTypes = {
    name: T.string.isRequired,
    // from form
    validate: T.func,
    attach: T.func,
    detach: T.func,
    // custom
    className: T.string,
    type: T.string,
    title: T.string,
    placeholder: T.string,
    value: T.any,
    // validation part
    validation: T.string,
    errMsg: T.string,
    invalidClassName: T.string,
    checkEvent: T.string
  }

  static defaultProps = {
    type: 'text',
    invalidClassName: 'invalid',
    checkEvent: 'change'
  }

  constructor (props) {
    super(props)

    this.props.attach(this)

    this.state = {
      value: this.props.value || '',
      isValid: true,
      isDirty: false
    }
  }

  componentDidMount () {
    // only do this if input has default value
    if (this.state.value) this.props.validate(this)
  }

  render () {
    return (
      <div className={cNames([
        this.props.className,
        { dirty: this.state.isDirty, [this.props.invalidClassName]: !this.state.isValid }
      ])}>
        <label>{this.props.title}</label>
        <input type={this.props.type} name={this.props.name}
          placeholder={this.props.placeholder}
          value={this.state.value} onChange={::this._handleChange} onBlur={::this._handleBlur} />
        {(!this.state.isValid && this.state.isDirty) ?
          (<div className='ui basic red pointing prompt label transition visible'>
              {this.props.errMsg}
          </div>) : null}
      </div>
    )
  }

  _handleChange (e) {
    this.setState({
      value: e.currentTarget.value,
      isDirty: true
    }, () => {
      if (this.props.checkEvent === 'change') this.props.validate(this)
    })
  }

  _handleBlur (e) {
    if (this.props.checkEvent === 'blur') this.props.validate(this)
  }
}
