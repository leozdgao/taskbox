import React, { Component, PropTypes as T } from 'react'

class PostList extends Component {

  static propTypes = {
    params: T.object
  }

  constructor (props, context) {
    super(props, context)
  }

  componentDidMount () {
    console.log(this.props.params)
  }

  render () {
    return (
      <div></div>
    )
  }
}

export default PostList
