import React from 'react'
import ReactDOM from 'react-dom'
import { createHistory } from 'history'
import { Provider } from 'react-redux'
import { Router, PropTypes as RouterPropTypes } from 'react-router'
import configureStore from './redux/configureStore'
import routes from './routes'

// init store
const store = configureStore(window.__initData__)

// dev tools
if (typeof __DEVTOOLS__ !== 'undefined' && __DEVTOOLS__) {
  const createDevToolsWindow = require('./utils/createDevToolsWindow')
  createDevToolsWindow(store)
}

// config app root
const history = createHistory()
const root = (
  <Provider store={store} key="provider">
    <Router history={history} routes={routes} />
  </Provider>
)

// render
ReactDOM.render(
  root,
  document.getElementById('root')
)
