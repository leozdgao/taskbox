const INCREMENT_COUNTER = 'INCREMENT_COUNTER'
const DECREMENT_COUNTER = 'DECREMENT_COUNTER'

export default function counter (state = 0, action) {
  switch (action.type) {
  case INCREMENT_COUNTER:
    return state + 2
  case DECREMENT_COUNTER:
    return state - 1
  default:
    return state
  }
}

export function increment () {
  return {
    type: INCREMENT_COUNTER
  }
}


export function decrement () {
  return {
    type: DECREMENT_COUNTER
  }
}


export function incrementIfOdd () {
  return (dispatch, getState) => {
    const { counter } = getState()

    if (counter % 2 === 0) {
      return
    }

    dispatch(increment())
  }
}


export function incrementAsync (delay = 1000) {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment())
    }, delay)
  }
}
