import React, { Component, PropTypes as T } from 'react'

class TagInput extends Component {
  static propTypes = {

  }

  constructor (props, context) {
    super(props, context)
  }

  render () {
    // return (
    //   <div className="cleanText tag-input" onClick={this._click}>
    //     <div className="inline-block" style={{ marginLeft: 10 }}>
    //       {tags}
    //     </div>
    //     <div className="inline-block relative" style={{ zIndex: 101 }}>
    //       <input type="text" ref="input" onKeyDown={this._keyDown} onKeyUp={this._keyUp} onBlur={this._blur} placeholder="Tag, like: JavaScript" />
    //       <div ref="container"></div>
    //       {this.state.promptShow ?
    //          (<ul className="tags-prompt" ref="prompt">
    //            {this._getPrompts()}
    //          </ul>): null}
    //     </div>
    //     <div className={stripClass}></div>
    //
    //     <span className="hidden" ref="hidden"></span>
    //   </div>
    // )
  }
}

export default TagInput
