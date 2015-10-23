import React, { Component, PropTypes as T } from 'react'
import cNames from 'classnames'
import './checkentry.less'

export default class CheckEntry extends Component {

  static propTypes = {
    checked: T.bool,
    onClick: T.func,
    children: T.any
  }

  static defaultProps = {
    checked: false,
    onClick: () => {}
  }

  render () {
    return (
      <a className={cNames([ 'todolist-container', { active: this.props.checked } ])} onClick={this.props.onClick}>
				<div className='todolist-input'><i className='fa fa-square-o'></i></div>
				<div className='todolist-title'>
				  {this.props.children}
				</div>
			</a>
    )
  }
}
