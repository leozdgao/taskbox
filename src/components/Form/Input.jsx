import React, { Component, PropTypes as T } from 'react'
import shadowEqual from 'react-addons-shallow-compare'
import cNames from 'classnames'

// default Input
export default class Input extends Component {

  static propTypes = {
    name: T.string.isRequired,
    // from form
    validate: T.func,
    attach: T.func,
    detach: T.func,
    onValidated: T.func,
    // custom
    className: T.string,
    type: T.string,
    title: T.string,
    placeholder: T.string,
    value: T.any,
    onChange: T.func,
    // validation part
    validation: T.object,
    invalidClassName: T.string,
    msgClassName: T.string,
    checkEvent: T.string
  }

  static defaultProps = {
    type: 'text',
    invalidClassName: 'invalid',
    checkEvent: 'change',
    onChange: () => {}
  }

  get value () {
    return this.state.value
  }

  get isDirty () {
    return this.state.isDirty
  }

  get isValid () {
    return this.state.isValid
  }

  constructor (props) {
    super(props)

    this.state = {
      value: this.props.value || '',
      isValid: true,
      isDirty: false,
      errMsg: ''
    }

    this.props.attach(this)
  }

  componentDidMount () {
    // only do this if input has default value
    this.props.validate(this)
  }

  componentWillUnmount () {
    this.props.detach(this)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shadowEqual(this, nextProps, nextState)
  }

  render () {
    return (
      <div className={cNames([
        this.props.className,
        {
          dirty: this.state.isDirty,
          [this.props.invalidClassName]: !this.state.isValid && this.state.isDirty
        }
      ])}>
        <label>{this.props.title}</label>
        <input type={this.props.type} name={this.props.name}
          placeholder={this.props.placeholder}
          value={this.state.value} onChange={::this._handleChange} onBlur={::this._handleBlur} />
        {(!this.state.isValid && this.state.isDirty && this.state.errMsg) ?
          (<div className={this.props.msgClassName}>
              {this.state.errMsg}
          </div>) : null}
      </div>
    )
  }

  setValid (isValid, errMsg) {
    this.setState({
      isValid, errMsg
    }, this.props.onValidated)
  }

  _handleChange (e) {
    const value = e.currentTarget.value
    this.setState({
      value,
      isDirty: true
    }, () => {
      this.props.onChange(value)
      if (this.props.checkEvent === 'change') this.props.validate(this)
    })
  }

  _handleBlur (e) {
    if (this.props.checkEvent === 'blur') this.props.validate(this)
  }
}
