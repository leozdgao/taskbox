import React, { Component, PropTypes as T } from 'react'
import Dropdown from './Dropdown'

const DropdownList = (props) => {
  const { open, onHide, animateName, notHideIfClickEntry, ...others } = props
  return (
    <Dropdown animateName={animateName} open={open} onHide={onHide} notHideIfClickEntry={notHideIfClickEntry}>
      <ul {...others}>
        {React.Children.map(props.children, (child) => {
          if (child.type === 'option') {
            return <li {...child.props}>{child.props.children}</li>
          }
        })}
      </ul>
    </Dropdown>
  )
}

export default DropdownList
