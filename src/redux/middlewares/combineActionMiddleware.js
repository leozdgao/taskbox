export default ({ dispatch, getState }) => next => action => {
  if (Array.isArray(action.next)) {
    const { next, ...others } = action
    const [ head, ...tails ] = next
    if (head) {
      dispatch(others)
      dispatch({
        ...head,
        next: tails
      })
    }
    else next(others)
  }
  else next(action)
}
