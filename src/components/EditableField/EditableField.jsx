import React, { Component, PropTypes as T } from 'react'
import './editablefield.less'

class EditableField extends Component {

  static propTypes = {
    value: T.string,
    onChange: T.func
  }

  static defaultProps = {
    onChange: () => {}
  }

  constructor (props) {
    super(props)

    this.state = {
      editing: false,
      value: this.props.value || ''
    }

    this._lastValue = this.props.value
  }

  render () {
    return this.state.editing ? (
        <div className="editable editing">
          <input ref="input" className="form-control" value={this.state.value}
            onChange={::this._handleChange} onKeyDown={::this._handleKeyDown}
            onBlur={::this._disableEditable} />
        </div>
      ) : (
        <div className="editable">
          <span>{this.state.value}</span>
          <i className="fa fa-edit" onClick={::this._editable}></i>
        </div>
      )
  }

  _handleChange (e) {
    this.setState({ value: e.target.value })
  }

  _handleKeyDown (e) {
    if (e.keyCode === 13) {
      this._disableEditable()
    }
  }

  _editable () {
    this.setState({ editing: true }, () => {
      this.refs.input.focus()
    })
  }

  _disableEditable () {
    this.setState({ editing: false }, () => {
      if (this._lastValue !== this.state.value) this.props.onChange(this.state.value)

      this._lastValue = this.state.value
    })
  }
}

export default EditableField
