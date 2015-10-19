import React, { Component, PropTypes as T } from 'react'
import { IndexLink } from 'react-router'
import './page404.less'

export default class Page404 extends Component {

  render () {
    return (
      <div className="error">
          <div className="error-code m-b-10">404 <i className="fa fa-warning"></i></div>
          <div className="error-content">
              <div className="error-message">We couldn't find it...</div>
              <div className="error-desc m-b-20">
                  The page you're looking for doesn't exist. <br/>
                  Perhaps, there pages will help find what you're looking for.
              </div>
              <div>
                  <IndexLink to='/' className="btn btn-success">Go Back to Home Page</IndexLink>
              </div>
          </div>
        </div>
    )
  }
}
