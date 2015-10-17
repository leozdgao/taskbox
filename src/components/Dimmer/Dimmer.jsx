import React, { Component } from 'react'
import cNames from 'classnames'
import './dimmer.less'

const Dimmer = (props) => {
  return (
    <div {...props} className={cNames([ 'dimmer', props.className ])}>
      <div className='ball-clip-rotate'><div></div></div>
    </div>
  )
}

export default Dimmer
