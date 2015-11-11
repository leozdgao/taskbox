import React, { Component, PropTypes as T } from 'react'
import cNames from 'classnames'
import './treeview.less'

export default class TreeView extends Component {
  static propTypes = {
    className: T.string,
    collapsed: T.bool,
    defaultCollapsed: T.bool,
    nodeLabel: T.node.isRequired,
    onClick: T.func,
    children: T.any
  }

  static defaultProps = {
    collapsed: true,
    onClick: () => {}
  }

  render () {
    const {
      collapsed,
      className = '',
      nodeLabel,
      children,
      ...rest,
    } = this.props

    const arrowClassName = 'tree-view_arrow'

    const arrow = (
      <div {...rest} className={className + ' ' + arrowClassName} onClick={::this._handleClick}>
        ▾
      </div>
    )
    return (
      <div className="tree-view">
        <div className={cNames([ "tree-view_item", { collapsed } ])}>
          {arrow}
          {nodeLabel}
        </div>
        <div className={cNames([ "tree-view_children", { collapsed } ])}>
          {children}
        </div>
      </div>
    )
  }

  _handleClick (...args) {
    this.props.onClick(...args)
  }
}

export default TreeView
