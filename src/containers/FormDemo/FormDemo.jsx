import React, { Component, PropTypes } from 'react'
import cNames from 'classnames'
import validator from 'validator'
import request from 'lgutil/common/ajax'
import { Form } from '../../components'

export default class FormDemo extends Component {

  constructor (props) {
    super(props)

    this.state = {
      canSubmit: true
    }
  }

  render () {
    return (
      <Form ref='form' className='ui form' invalidClassName='error' validator={validator}>
        <Form.Input name='task' className='field'
          title='Task' placeholder='Enter Task Name' invalidClassName='error'
          msgClassName='ui basic red pointing prompt label transition visible zoomIn'
          validation={{
            "isLength:3:6": "Task name should be longer than 3 and shorter than 6."
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

  _handleChange (user) {
    const nameInput = this.refs.nameInput

    if (this._lrt) clearTimeout(this._lrt)
    if (this._pending) this._pending.abort()

    if (user) {
      this._lrt = setTimeout(() => {
        this._pending = request.post('/api/check', JSON.stringify({ user }), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        this._pending
          .then(({ body }) => {
            const res = JSON.parse(body)
            nameInput.setValid(res.isValid, 'Your name has already existed.')
          })
      }, 500)
    }
  }
}
