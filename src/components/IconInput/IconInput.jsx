import React from 'react'
import './iconinput.less'

export default (props) => {
  const { icon, ...others } = props
  return (
    <div className='icon-input'>
      <i className={`fa fa-${icon}`}></i>
      <input {...others} />
    </div>
  )
}
