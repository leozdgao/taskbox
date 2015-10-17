import React, { Component, PropTypes as T } from 'react'
import Animate from '../Animate/Animate'

export default class Dropdown extends Component {

  static propTypes = {
    open: T.bool,
    onHide: T.func,
    children: T.any
  }

  static defaultProps = {
    open: false,
    onHide: () => {}
  }

  componentDidMount () {
    this._handler = ::this._handleClick
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.open && !this.props.open) document.addEventListener('click', this._handler)
    if (!nextProps.open && this.props.open) document.removeEventListener('click', this._handler)
  }

  render () {
    return (
      <Animate name='slideDown'>
        {this.props.open ? (
          <ul ref='list' {...this.props}>
            {React.Children.map(this.props.children, (child) => {
              if (child.type === 'option') {
                return <li {...child.props}>{child.props.children}</li>
              }
            })}
          </ul>
        ): null}
      </Animate>
    )
  }

  _handleClick () {
    if (this.props.open) this.props.onHide()
  }
}
