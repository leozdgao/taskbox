import React, { Component, PropTypes as T } from 'react'
import ResWaterfall from 'responsive_waterfall'
import cNames from 'classnames'
import forEach from 'lodash/collection/forEach'
import './waterfall.less'

class Waterfall extends Component {

  static propTypes = {
    className: T.string,
    minBoxWidth: T.number,
    children: T.any
  }

  static defaultProps = {
    minBoxWidth: 400
  }

  constructor (props) {
    super(props)

    this.state = {
      columns: []
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.children.length !== this.props.children.length) {
      new ResWaterfall({ minBoxWidth: this.props.minBoxWidth })
      return
    }

    forEach(prevProps.children, (child, i) => {
      const next = this.props.children[i]
      if (next.key !== child.key) {
        new ResWaterfall({ minBoxWidth: this.props.minBoxWidth })
        return false
      }
    })
  }

  componentDidMount () {
    new ResWaterfall({ minBoxWidth: this.props.minBoxWidth })
  }

  render () {
    return (
      <div {...this.props} className={cNames([ 'wf-container', this.props.className ])}>
        {this.props.children}
      </div>
    )
  }
}

export default Waterfall
