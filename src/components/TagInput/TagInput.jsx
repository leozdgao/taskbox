import React, { Component, PropTypes as T } from 'react'
import cNames from 'classnames'
import { COMMA, BACKSPACE } from 'lgutil/dom/keycode'
import { createChainedFunction, isFunction } from '../../utils'
import Tag from '../Tag/Tag'
import './taginput.less'

// bind to this for access component properties
const keyMapAction = (e) => ({
  [COMMA] (component) { // add tag
    e.preventDefault()

    const val = e.target.value
    const { value: tags } = component.state
    if (val && tags.indexOf(val) < 0) { // not empty
      const newVal = [ ...tags, val ]
      // component.setState({
      //   tags: newVal
      // })
      component.props.onChange(newVal) // notify redux-form
    }
    e.target.value = "" // reset value
  },
  [BACKSPACE] (component) { // remove tag
    const val = e.target.value
    if (!val) { // only when no other input
      e.preventDefault()

      const { value: tags } = component.state
      if (tags.length > 0) {
        const [ ...newVal ] = tags
        newVal.pop()
        // component.setState({
        //   tags: newVal
        // })
        component.props.onChange(newVal) // notify redux-form
      }
    }
  }
})[e.keyCode]

class TagInput extends Component {
  static propTypes = {
    placeholder: T.string,
    value: T.array,
    onChange: T.func,
    onClick: T.func,
    onKeyDown: T.func,
    onKeyUp: T.func,
    onBlur: T.func
  }

  static defaultProps = {
    onChange: () => {}
  }

  get value () {
    return this.state.tags
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      value: this.props.value || [],
      isFocus: false
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      value: nextProps.value || []
    })
  }

  render () {
    const { value: tags } = this.state

    const handleClick = createChainedFunction(::this._handleClick, this.props.onClick)
    const handleKeyDown = createChainedFunction(::this._handlekeyDown, this.props.onKeyDown)
    const handleKeyUp = createChainedFunction(::this._handleKeyUp, this.props.onKeyUp)
    const handleBlur = createChainedFunction(::this._handleBlur) // has some issue with redux-form onBlur handler

    return (
      <div className="cleanText tag-input" onClick={handleClick}>
        {tags.length > 0 && (
          <div className="inline-block tag-set">
            {tags.map((tag, i) => <Tag key={i}>{tag}</Tag>)}
          </div>
        )}
        <div className="inline-block relative">
          <input ref="input" placeholder={this.props.placeholder} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onBlur={handleBlur}  />
          <div ref="container"></div>
          {this.state.promptShow ?
             (<ul className="tags-prompt" ref="prompt">
               {this._getPrompts()}
             </ul>): null}
        </div>
        <div className={cNames([ "strip", { show: this.state.isFocus } ])}></div>
        <span className="hidden" ref="hidden"></span>
      </div>
    )
  }

  _handlekeyDown (e) {
    const action = keyMapAction(e)
    if (isFunction(action)) action(this)
  }

  _handleKeyUp (e) {

  }

  // focus the inner input
  _handleClick () {
    this.setState({
      isFocus: true
    }, () => {
      this.refs.input.focus()
    })
  }

  _handleBlur () {
    this.setState({
      isFocus: false
    })
    this.props.onBlur(this.state.value) // work with redux-form
  }
}

export default TagInput
