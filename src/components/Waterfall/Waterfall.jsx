import React, { Component, PropTypes as T } from 'react'
import ResWaterfall from 'responsive_waterfall'
import cNames from 'classnames'
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
