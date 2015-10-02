const SEND_MESSAGE = 'SEND_MESSAGE'
const RECIEVE_MESSAGE = 'RECIEVE_MESSAGE'

export default function (state = [], action) {
  switch (action.type) {
  case SEND_MESSAGE: {
    return [
      ...state,
      { from: '$$me', msg: action.payload }
    ]
  }
  case RECIEVE_MESSAGE: {
    return [
      ...state,
      { from: 'other', msg: action.payload }
    ]
  }
  default: return state
  }
}

export function receiveMessage (msg) {
  return {
    type: RECIEVE_MESSAGE,
    payload: msg
  }
}

export function sendMessage (msg) {
  return {
    type: SEND_MESSAGE,
    payload: msg
  }
}
