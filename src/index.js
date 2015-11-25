import React from 'react'
import ReactDOM from 'react-dom'
import createHistory from 'history/lib/createBrowserHistory'
import { Provider } from 'react-redux'
// import { Router, PropTypes as RouterPropTypes } from 'react-router'
import { ReduxRouter } from 'redux-router'
import configureStore from './redux/configureStore'
import routes from './routes'

// init store
const store = configureStore()

// {
//   user: {
//     data: window.__initData__.user
//   }
// }

// dev tools
if (typeof __DEVTOOLS__ !== 'undefined' && __DEVTOOLS__) {
  const createDevToolsWindow = require('./utils/createDevToolsWindow')
  createDevToolsWindow(store)
}

// <Router history={history} routes={routes} />
// config app root
const history = createHistory()
const root = (
  <Provider store={store} key="provider">
    <ReduxRouter>
      {routes}
    </ReduxRouter>
  </Provider>
)

// render
ReactDOM.render(
  root,
  document.getElementById('root')
)
