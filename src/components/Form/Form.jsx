import React, { Component, PropTypes as T } from 'react'
import cNames from 'classnames'
import validator from 'validator'
import any from 'lodash/collection/any'
import all from 'lodash/collection/all'
import reduce from 'lodash/collection/reduce'
import forEach from 'lodash/collection/forEach'
import Input from './Input'

class Form extends Component {

  static propTypes = {
    className: T.string,
    invalidClassName: T.string,
    children: T.any
  }

  static defaultProps = {
    invalidClassName: 'invalid'
  }

  constructor (props) {
    super(props)

    this.inputs = {}
    this.initValue = {}

    this.state = {
      isValid: true
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // improvement
    return this.state.isValid !== nextState.isValid
  }

  render () {
    return (
      <form className={cNames([
        this.props.className,
        { [this.props.invalidClassName]: !this.state.isValid }
      ])}>
        {React.Children.map(this.props.children, (child) => {
          if (child.props.name) {
            return React.cloneElement(child, {
              attach: this._attachInput.bind(this),
              detach: this._detachInput.bind(this),
              validate: this._validate.bind(this)
            })
          }
          else return child
        })}
      </form>
    )
  }

  get body () {
    return reduce(this.inputs, (ret, component, key) => {
      ret[key] = component.state.value
      return ret
    }, {})
  }

  get isDirty () {
    return any(this.inputs, (component) => {
      return component.state.isDirty
    })
  }

  get isValid () {
    return all(this.inputs, (component) => {
      return component.state.isValid
    })
  }

  // actually, this method just set all input to dirty to make
  // sure the invalid message showed
  validate () {
    forEach(this.inputs, (component) => {
      if (!component.state.isDirty) component.setState({ isDirty: true })
    })
  }

  reset () {
    forEach(this.inputs, (component) => {
      component.setState({
        value: this.initValue[component.props.name],
        isDirty: false
      }, () => {
        component.props.validate(component)
      })
    })
  }

  _attachInput (component) {
    this.inputs[component.props.name] = component
    this.initValue[component.props.name] = component.state.value
  }

  _detachInput (component) {
    delete this.inputs[component.props.name]
  }

  _validate (component) {
    const { validation } = component.props

    if (validation) {
      const { value } = component.state
      const [ method, ...args ] = validation.split(':')
      const fn = validator[method]

      if (typeof fn === 'function') {
        // check form validation after input state change
        const isValid = fn.apply(validator, [ value, ...args ])
        if (isValid !== component.state.isValid) {
          component.setState({
            isValid
          }, () => {
            this.setState({ isValid: this.isValid })
          })
        }
      }
    }
  }
}

Form.Input = Input

export default Form
