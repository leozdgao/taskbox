import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import './app.less'

@connect(
  state => ({})
)
export default class Main extends Component {

  static propTypes = {
    children: PropTypes.any.isRequired
  }

  render () {
    return (
      <div className='ui cb-container'>
          {/* this will render the child routes */}
          {React.cloneElement(this.props.children, this.props)}
      </div>
    )
  }
}
