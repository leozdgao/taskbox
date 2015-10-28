import React from 'react'
import Dimmer from './Dimmer'

export default (props) => {
  return (
    <Dimmer {...props}>
      <div className='spinner'><div></div></div>
    </Dimmer>
  )
}
