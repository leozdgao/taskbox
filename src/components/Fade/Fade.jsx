import React from 'react'
import { Transition } from 'react-overlays'

const Fade = (props) => {
  const timeout = props.timeout || 300

  return (
    <Transition
      {...props}
      timeout={timeout}
      className="fade"
      enteredClassName="in"
      enteringClassName="in"
      unmountOnExit={false}
      transitionAppear={false}
      in={props.in}
    >
      {props.children}
    </Transition>
  )
}

export default Fade
