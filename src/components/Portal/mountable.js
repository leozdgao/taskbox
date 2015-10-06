function createChainableTypeChecker (validate) {
  function checkType (isRequired, props, propName, componentName) {
    componentName = componentName || '<<anonymous>>'
    if (props[propName] == null) {
      if (isRequired) {
        return new Error(
          `Required prop '${propName}' was not specified in '${componentName}'.`
        )
      }
    } else {
      return validate(props, propName, componentName)
    }
  }

  const chainedCheckType = checkType.bind(null, false)
  chainedCheckType.isRequired = checkType.bind(null, true)

  return chainedCheckType
}

function errMsg (props, propName, componentName, msgContinuation) {
  return `Invalid prop '${propName}' of value '${props[propName]}'` +
    ` supplied to '${componentName}'${msgContinuation}`
}

function validate (props, propName, componentName) {
  if (typeof props[propName] !== 'object' ||
    typeof props[propName].render !== 'function' && props[propName].nodeType !== 1) {
    return new Error(
      errMsg(props, propName, componentName,
        ', expected a DOM element or an object that has a `render` method')
    )
  }
}

export default createChainableTypeChecker(validate)
