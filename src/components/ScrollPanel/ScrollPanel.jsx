import React, { Component, PropTypes } from 'react'
import update from 'react-addons-update'
import cNames from 'classnames'
import './scrollpanel.less'

const noop = () => {}
const range = (min, max) => (val) => {
  if (val < min) return min
  if (val > max) return max

  return val
}

export default class ScrollPanel extends Component {

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
    onScrollTop: PropTypes.func,
    onScrollBottom: PropTypes.func
  }

  static defaultProps = {
    onScrollTop: noop,
    onScrollBottom: noop
  }

  constructor (props) {
    super(props)

    this.state = {
      contentStyles: {
        top: 0, left: 0
      },
      scrollYStyles: {
        top: 0,
        height: 0,
        display: 'none'
      }
    }
  }

  componentDidMount () {
    this._refreshDOMValue()

    if (this._needScrollY()) {
      this._showScrollY()
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.children !== this.props.children) {
      this._refreshDOMValue()
    }

    if (this._needScrollY()) {
      const { display, height, top } = prevState.scrollYStyles
      if (display === 'none' || height !== this._getScrollYHeight()) {
        this._showScrollY()
      }

      // emit top
      if (display !== 'none' &&
        !this._isScrollTop(prevState.scrollYStyles) &&
        this._isScrollTop(this.state.scrollYStyles)) {
        this.props.onScrollTop()
      }

      // emit bottom
      if (display !== 'none' &&
        !this._isScrollBottom(prevState.scrollYStyles) &&
        this._isScrollBottom(this.state.scrollYStyles)) {
        this.props.onScrollBottom()
      }
    }
    else {
      // hide scrollbar here
      if (prevState.scrollYStyles.display === 'block') {
        this._hideScrollY()
      }
    }
  }

  render () {
    return (
      <div ref='panel' {...this.props} className={cNames('scrollpanel', this.props.className)} onWheel={::this._handleWheel}>
        <div ref='content' className='scrollcontent' style={this.state.contentStyles}>
          {this.props.children}
        </div>
        <div className='scrollbar x'></div>
        <div ref='scrollY' className='scrollbar y' style={{ display: this.state.scrollYStyles.display }}>
          <div style={this.state.scrollYStyles}
            onMouseDown={::this._handleScrollMouseDown}></div>
        </div>
      </div>
    )
  }

  //
  // public methods
  //
  scrollToTop () {
    if (this._needScrollY()) {
      this.setState(this._constructScrollYUpdateState(0, 0))
    }
  }

  scrollToBottom () {
    if (this._needScrollY()) {
      const maxScroll = this._contentHeight - this._panelHeight
      this.setState(
        this._constructScrollYUpdateState(- maxScroll, this._panelHeight * maxScroll / this._contentHeight)
      )
    }
  }

  hasScrolledToTop () {
    return this._isScrollTop(this.state.scrollYStyles)
  }

  hasScrolledToBottom () {
    return this._isScrollBottom(this.state.scrollYStyles)
  }

  //
  // private methods
  //

  _refreshDOMValue () {
    this._contentHeight = this._getContentHeight()
    this._panelHeight = this._getPanelHeight()
  }

  _getContentHeight () {
    const contentStyles = window.getComputedStyle(this.refs.content)
    const panelStyles = window.getComputedStyle(this.refs.panel)

    return this.refs.content.offsetHeight +
     parseInt(contentStyles['margin-top'], 10) + parseInt(contentStyles['margin-bottom'], 10) +
     parseInt(panelStyles['padding-top'], 10) + parseInt(panelStyles['padding-bottom'], 10)
  }

  _getPanelHeight () {
    return this.refs.panel.clientHeight
  }

  _getScrollYHeight () {
    return this._panelHeight * this._panelHeight / this._contentHeight
  }

  _needScrollY () {
    return this._contentHeight - this._panelHeight > 0
  }

  _showScrollY () {
    this.setState({
      scrollYStyles: update(this.state.scrollYStyles, {
        display: { $set: 'block' },
        height: { $set: this._getScrollYHeight() }
      })
    })
  }

  _hideScrollY () {
    this.setState({
      scrollYStyles: {
        height: 0,
        display: 'none',
        top: 0
      }
    })
  }

  _handleWheel (e) {
    // need scrollY
    if (e.deltaY && this._needScrollY()) {
      e.preventDefault()

      this.refs.scrollY.classList.add('hover')
      if (this._ltr) clearTimeout(this._ltr)
      this._ltr = setTimeout(() => {
        this.refs.scrollY.classList.remove('hover')
      }, 500)

      let delta = e.deltaY
      if (navigator.platform !== 'MacIntel') delta = e.deltaY > 0 ? 100 : -100

      this._scrollByContent(delta)
    }
  }

  _handleScrollMouseDown (e) {
    this._handleMouseUp = this._handleMouseUp.bind(this)
    this._handleMouseMove = this._handleMouseMove.bind(this)
    document.addEventListener('mouseup', this._handleMouseUp)
    document.addEventListener('mousemove', this._handleMouseMove)

    this.refs.scrollY.classList.add('hover')
    this._mouseY = e.clientY
  }

  _handleMouseUp (e) {
    document.removeEventListener('mouseup', this._handleMouseUp)
    document.removeEventListener('mousemove', this._handleMouseMove)

    this.refs.scrollY.classList.remove('hover')
  }

  _handleMouseMove (e) {
    e.preventDefault()

    const deltaY = e.clientY - this._mouseY
    this._scrollByScroll(deltaY)
    this._mouseY = e.clientY
  }

  _isScrollTop ({ top }) {
    return top === 0
  }

  _isScrollBottom ({ top, height }) {
    const styles = window.getComputedStyle(this.refs.scrollY)
    return top + height === parseInt(styles.height, 10)
  }

  // content deltaY
  _scrollByContent (deltaY) {
    let top = this.state.contentStyles.top - deltaY
    const maxScroll = this._contentHeight - this._panelHeight

    top = range(- maxScroll, 0)(top)

    this.setState(
      this._constructScrollYUpdateState(top, this._mapContentToScroll(top))
    )
  }

  _scrollByScroll (deltaY) {
    let top = this.state.scrollYStyles.top + deltaY
    const maxScroll = this._panelHeight - this._getScrollYHeight()

    top = range(0, maxScroll)(top)

    this.setState(
      this._constructScrollYUpdateState(this._mapScrollToContent(top), top)
    )
  }

  _mapContentToScroll (top) {
    return - this._panelHeight * top / this._contentHeight
  }

  _mapScrollToContent (top) {
    return - this._contentHeight * top / this._panelHeight
  }

  _constructScrollYUpdateState (contentTop, scrollTop) {
    return {
      contentStyles: update(this.state.contentStyles, {
        top: { $set: contentTop }
      }),
      scrollYStyles: update(this.state.scrollYStyles, {
        height: { $set: this._getScrollYHeight() },
        top: { $set: scrollTop }
      })
    }
  }
}
