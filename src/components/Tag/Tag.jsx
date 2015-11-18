import React, { Component, PropTypes as T } from 'react'
import './tag.less'

const Tag = (props) => {
  return (
    <span className="label label-default tag">{props.children}</span>
  )
}

export default Tag
