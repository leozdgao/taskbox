import React, { Component, PropTypes as T } from 'react'
import cNames from 'classnames'
import './ibox.less'

const iBox = (props) => {
  return (
    <div {...props} className={cNames([ "ibox", props.className ])}>{props.children}</div>
  )
}
const iBoxTitle = (props) => {
  return (
    <div {...props} className={cNames([ "ibox-title", props.className ])}>{props.children}</div>
  )
}
const iBoxContent = (props) => {
  return (
    <div {...props} className={cNames([ "ibox-content", props.className ])}>{props.children}</div>
  )
}

iBox.Title = iBoxTitle
iBox.Content = iBoxContent

export default iBox
