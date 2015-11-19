import React, { Component, PropTypes as T } from 'react'
import { Link } from 'react-router'
import { PageHeading, IconInput } from '../../components'

class Document extends Component {

  static propTypes = {
    children: T.any
  }

  // constructor (props, context) {
  //   super(props, context)
  // }

  render () {
    return (
      <div>
        <PageHeading title="Documents" breadcrumb={[
          { title: 'Home', link: '/' },
          { title: 'Document', link: '/doc' }
        ]}>
          {this._getDocNav()}
        </PageHeading>
        {this.props.children}
      </div>
    )
  }

  _getDocNav () {
    return (
      <nav className="navbar navbar-default task-navbar">
        <ul className="nav navbar-nav">
          <li><Link to="/doc/new"><i className='fa fa-plus'></i>New Document</Link></li>
        </ul>
        <form className="navbar-form navbar-left" role="search">
          <div className="form-group">
            <IconInput icon='filter' className="form-control lean-control" placeholder="Filter documents..." />
          </div>
          {/* <a type="submit" className="btn btn-sm btn-white">Submit</a> */}
        </form>
      </nav>
    )
  }
}

export default Document
