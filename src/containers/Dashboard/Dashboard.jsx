import React, { Component, PropTypes as T } from 'react'
import { isDefined } from '../../utils'

export default class Dashboard extends Component {

  componentDidMount () {
    // console.log('mount');
    // this.props.load('123')
  }

  render () {
    return (
      <div className="page-header">
        Dashboard
      </div>
    )
  }
}
