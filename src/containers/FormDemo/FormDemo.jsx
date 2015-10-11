import React, { Component, PropTypes } from 'react'
import request from 'lgutil/common/ajax'
import { Form } from '../../components'

export default class FormDemo extends Component {

  render () {
    return (
      <Form ref='form' className='ui form' invalidClassName='error'>
        <Form.Input name='name' className='field' validation='isLength:3:6'
          title='Name' placeholder='Your Name' invalidClassName='error'
          errMsg='Your name should be longer than 3 and shorter than 6.' />
        <button onClick={::this._handleClick}>Submit</button>
        <button onClick={::this._handleReset}>Reset</button>
      </Form>
    )
  }

  _handleClick (e) {
    e.preventDefault()

    const form = this.refs.form
    form.validate()

    if (form.isValid) {
      request.post('/api/task', form.body)
        .then(({ body }) => {
          console.log(body)
        })
    }
  }

  _handleReset (e) {
    e.preventDefault()

    this.refs.form.reset()
  }
}
