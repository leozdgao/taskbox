import React, { Component, PropTypes } from 'react'
import cNames from 'classnames'
import validator from 'validator'
import { json as request } from 'lgutil/common/ajax'
import { Form } from '../../components'

export default class FormDemo extends Component {

  constructor (props) {
    super(props)

    this.state = { }
  }

  render () {
    return (
      <Form ref='form' className='ui form' invalidClassName='error' validator={validator} onValidated={::this._handleValidate}>
        <Form.Input name='task' className='field' ref='taskInput' onChange={::this._handleTaskChange}
          title='Task' placeholder='Enter Task Name' invalidClassName='error'
          msgClassName='ui basic red pointing prompt label transition visible zoomIn'
          validation={{
            "isLength:3:6": "Task name should be longer than 3 and shorter than 6."
          }} />
        <Form.Input name='task2' className='field' ref='taskInput2'
          title='Task' placeholder='Enter Task Name' invalidClassName='error'
          msgClassName='ui basic red pointing prompt label transition visible zoomIn'
          validation={{
            "isLength:1": 'Please retype your task.',
            "equalTo": {
              msg: 'Two name must be equal.',
              validator: (val) => {
                return val === this.refs.taskInput.value
              }
            }
          }} />
        <Form.Input ref='nameInput' name='name' className='field required'
          title='Name' placeholder='Your Name' invalidClassName='error'
          msgClassName='ui basic red pointing prompt label transition visible zoomIn'
          validation={{
            "isLength:1": "Your name is required."
          }} onChange={::this._handleChange} />
        <button className={cNames([ 'ui primary button' ])} onClick={::this._handleClick}>Submit</button>
        <button className='ui positive button' onClick={::this._handleReset}>Reset</button>
      </Form>
    )
  }

  _handleClick (e) {
    e.preventDefault()

    const form = this.refs.form
    form.validate()
    console.log(form.errors)

    if (form.isValid) {
      request.post('/api/task', form.body)
        .then(({ body, headers }) => {
          console.log(headers)
          console.log(body)
        })
    }
  }

  _handleTaskChange (val) {
    const task2 = this.refs.taskInput2
    if (task2.isDirty) {
      task2.setValid(val === task2.value, 'Two name must be equal.')
    }
  }

  _handleReset (e) {
    e.preventDefault()

    this.refs.form.reset()
  }

  _handleChange (user) {
    const nameInput = this.refs.nameInput

    if (this._lrt) clearTimeout(this._lrt)
    if (this._pending) this._pending.abort()

    if (user) {
      this._lrt = setTimeout(() => {
        this._pending = request.post('/api/check', { user })
        this._pending.then(({ body }) => {
          nameInput.setValid(body.isValid, 'Your name has already existed.')
        })
      }, 500)
    }
  }

  _handleValidate (isValid) {
    this.setState({
      isFormValid: isValid
    })
  }

  _isDisabled () {
    return !this.state.isFormValid || this.state.asyncRequesting
  }
}
