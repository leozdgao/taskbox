import React, { Component, PropTypes as T } from 'react'
import { Link } from 'react-router'
import cNames from 'classnames'
import './pageheading.less'

class PageHeading extends Component {

  static propTypes = {
    title: T.string.isRequired,
    breadcrumb: T.array,
    children: T.any
  }

  render () {
    const { title, breadcrumb } = this.props

    return (
      <div className="row wrapper border-bottom white-bg page-heading">
        <div className="col-lg-10">
          <h2>{title}</h2>
          {breadcrumb &&
            <ol className="breadcrumb">
              {breadcrumb.map(({ title, link }, i) => {
                return (
                  <li key={i} className={cNames({ active: i === breadcrumb.length - 1 })}>
                    {link ? <Link to={link}>{title}</Link> : <a>{title}</a>}
                  </li>
                )
              })}
            </ol>
          }
          {this.props.children}
        </div>
        <div className="col-lg-2"></div>
      </div>
    )
  }
}

export default PageHeading
