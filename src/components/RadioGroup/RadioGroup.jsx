import React, { Component, PropTypes as T } from 'react'
import ReactDOM from 'react-dom'

class RadioGroup extends Component {

  static propTypes = {
    children: T.any,
    name: T.string.isRequired
  }

  get value () {
    const node = ReactDOM.findDOMNode(this)
    if (node) {
      const radioList = node.querySelectorAll('input[type=radio]')
      for (let i = 0, l = radioList.length; i < l; i ++) {
        const radio = radioList[i]
        if (radio.checked) return radio.value
      }
    }
  }

  render () {
    return (
      <div {...this.props}>
        {React.Children.map(this.props.children, (child) => {
          if (child.type === 'option') {
            const { value, ...others } = child.props
            return (
              <label {...others}>
                <input type="radio" name={this.props.name} value={value} />
                {child.props.children}
              </label>
            )
          }
        })}
      </div>
    )
  }
}

export default RadioGroup
