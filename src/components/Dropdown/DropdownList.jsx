import React, { Component, PropTypes as T } from 'react'
import Dropdown from './Dropdown'
import { ScrollPanel } from '../../components'
import './dropdown.less'

const DropdownList = (props) => {
  const { open, onHide, animateName, notHideIfClickEntry, height, ...others } = props
  let child
  if (height) {
    child = (
      <ul  {...others}>
        <ScrollPanel style={{ maxHeight: height }}>
          {React.Children.map(props.children, (child) => {
            if (child.type === 'option') {
              return <li {...child.props}>{child.props.children}</li>
            }
          })}
        </ScrollPanel>
      </ul>
    )
  }
  else {
    child = (
      <ul  {...others}>
        {React.Children.map(props.children, (child) => {
          if (child.type === 'option') {
            return <li {...child.props}>{child.props.children}</li>
          }
        })}
      </ul>
    )
  }

  return (
    <Dropdown animateName={animateName} open={open} onHide={onHide} notHideIfClickEntry={notHideIfClickEntry}>
      {child}
    </Dropdown>
  )
}

export default DropdownList
