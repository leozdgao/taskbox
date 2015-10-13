import React, { Component, PropTypes as T } from 'react'
import shadowEqual from 'react-addons-shallow-compare'
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
    children: T.any,
    validator: T.object,
    onValidated: T.func
  }

  static defaultProps = {
    invalidClassName: 'invalid',
    validator,
    onValidated: () => {}
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
    return shadowEqual(this, nextProps, nextState)
  }

  render () {
    return (
      <form className={cNames([
        this.props.className,
        { [this.props.invalidClassName]: !this.state.isValid }
      ])}>
        {React.Children.map(this.props.children, (child) => {
          // take the component which has the name props as the input component
          if (child.props.name) {
            return React.cloneElement(child, {
              attach: ::this._attachInput,
              detach: ::this._detachInput,
              validate: ::this._validateInput,
              onValidated: ::this._validateForm // private invoked
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

  get errors () {
    return reduce(this.inputs, (ret, component, key) => {
      if (!component.isValid) ret[key] = component.state.errMsg
      return ret
    }, {})
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

  _validateInput (component) {
    const { validation } = component.props

    if (validation) {
      const { value } = component.state

      forEach(validation, (opt, validatorKey) => {
        let isValid
        // "isLength:1:6": "Your lenght should be 1 to 6."
        if (typeof opt === 'string') {
          const [ method, ...args ] = validatorKey.split(/\s*:\s*/)
          const fn = this.props.validator[method]

          if (typeof fn === 'function') {
            // check form validation after input state change
            isValid = !!fn.apply(this.props.validator, [ value, ...args ])
            this._setComponentValid(component, !!isValid, opt)
          }
        }
        // "isEqualToAnother": {
        //   msg: "Should equal to another input",
        //   validator: (val) => {
        //
        //   }
        // }
        else {
          const { validator, msg } = opt
          if (typeof validator === 'function') {
            isValid = !!validator.call(component, value)
            this._setComponentValid(component, !!isValid, msg)
          }
        }

        // stop validate if one of validator has already failed
        if (isValid === false) return false
      })
    }
  }

  _setComponentValid (component, isValid, errMsg) {
    component.setState({
      isValid, errMsg
    }, ::this._validateForm)
  }

  _validateForm () {
    this.setState({ isValid: this.isValid }, () => {
      this.props.onValidated(this.isValid)
    })
  }
}

Form.Input = Input

export default Form
