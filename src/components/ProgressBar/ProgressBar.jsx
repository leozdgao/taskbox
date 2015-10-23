import React from 'react'
import './progressbar.less'

export default (props) => {
  const { percantage, title } = props
  return (
    <div className='progress'>
      <div className='progress-bar progress-bar-info' style={{ width: percantage + '%' }}>{title}</div>
    </div>
  )
}
