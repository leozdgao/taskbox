import React, { Component, PropTypes } from 'react'
import cNames from 'classnames'
import Styles from './scrollpanel.less'

export default class ScrollPanel extends Component {

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.any
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
      if (prevState.scrollYStyles.display === 'none' || prevState.scrollYStyles.height !== this._getScrollYHeight()) {
        this._showScrollY()
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
    const { scrollpanel, scrollbar, content, x, y } = Styles

    return (
      <div ref='panel' className={cNames(scrollpanel, this.props.className)} onWheel={this._handleWheel.bind(this)}>
        <div ref='content' className={content} style={this.state.contentStyles}>
          {this.props.children}
        </div>
        <div className={cNames(scrollbar, x)}></div>
        <div ref='scrollY' className={cNames(scrollbar, y)} style={{ display: this.state.scrollYStyles.display }}>
          <div style={this.state.scrollYStyles}
            onMouseDown={this._handleScrollMouseDown.bind(this)}></div>
        </div>
      </div>
    )
  }

  //
  // public methods
  //
  scrollToTop () {
    if (this._needScrollY()) {

    }
  }

  scrollToBottom () {
    if (this._needScrollY()) {
      const maxScroll = this._contentHeight - this._panelHeight
      this.setState({
        contentStyles: {
          top: - maxScroll,
          left: this.state.contentStyles.left
        },
        scrollYStyles: {
          height: this._getScrollYHeight(),
          display: 'block',
          top: this._panelHeight * maxScroll / this._contentHeight
        }
      })
    }
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
      scrollYStyles: {
        height: this._getScrollYHeight(),
        display: 'block',
        top: this.state.scrollYStyles.top
      }
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
      this.refs.scrollY.classList.add('hover')
      if (this._ltr) clearTimeout(this._ltr)
      this._ltr = setTimeout(() => {
        this.refs.scrollY.classList.remove('hover')
      }, 1000)

      this._scrollByContent(e.deltaY)
    }
  }

  _handleScrollMouseDown (e) {
    this._handleMouseUp = this._handleMouseUp.bind(this)
    this._handleMouseMove = this._handleMouseMove.bind(this)
    document.addEventListener('mouseup', this._handleMouseUp)
    document.addEventListener('mousemove', this._handleMouseMove)

    this.refs.scrollY.classList.add('hover')
    this.refs.scrollY.classList.add('down')
    this._mouseY = e.clientY
  }

  _handleMouseUp (e) {
    document.removeEventListener('mouseup', this._handleMouseUp)
    document.removeEventListener('mousemove', this._handleMouseMove)

    this.refs.scrollY.classList.remove('hover')
    this.refs.scrollY.classList.remove('down')
  }

  _handleMouseMove (e) {
    e.preventDefault()

    const deltaY = e.clientY - this._mouseY
    this._scrollByScroll(deltaY)
    this._mouseY = e.clientY
  }

  // content deltaY
  _scrollByContent (deltaY) {
    let top = this.state.contentStyles.top - deltaY
    const maxScroll = this._contentHeight - this._panelHeight
    if (top > 0) top = 0
    if (top < - maxScroll) top = - maxScroll

    this.setState({
      contentStyles: {
        top,
        left: this.state.contentStyles.left
      },
      scrollYStyles: {
        height: this._getScrollYHeight(),
        display: 'block',
        top: this._mapContentToScroll(top)
      }
    })
  }

  _scrollByScroll (deltaY) {
    let top = this.state.scrollYStyles.top + deltaY
    const maxScroll = this._panelHeight - this._getScrollYHeight()
    if (top < 0) top = 0
    if (top > maxScroll) top = maxScroll

    this.setState({
      contentStyles: {
        top: this._mapScrollToContent(top),
        left: this.state.contentStyles.left
      },
      scrollYStyles: {
        height: this._getScrollYHeight(),
        display: 'block',
        top
      }
    })
  }

  _mapContentToScroll (top) {
    return - this._panelHeight * top / this._contentHeight
  }

  _mapScrollToContent (top) {
    return - this._contentHeight * top / this._panelHeight
  }
}
