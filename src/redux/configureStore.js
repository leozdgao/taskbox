/* global __DEVTOOLS__ */
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
// import promiseMiddleware from 'redux-promise'
import promiseMiddleware from 'redux-promise-middleware'
import createLogger from 'redux-logger'
import cacheablePromise from './middlewares/cacheablePromise'
import thenablePromise from './middlewares/thenablePromise'
import rootReducer from './modules/reducer'

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
})

let createStoreWithMiddleware

if (typeof __DEVTOOLS__ !== 'undefined' && __DEVTOOLS__) {
  const { devTools, persistState } = require('redux-devtools')
  createStoreWithMiddleware = compose(
    applyMiddleware(cacheablePromise, thenablePromise, promiseMiddleware(), thunkMiddleware, loggerMiddleware),
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore)
} else {
  createStoreWithMiddleware = applyMiddleware(
    cacheablePromise,
    thenablePromise,
    promiseMiddleware(),
    thunkMiddleware
  )(createStore)
}


/**
 * Creates a preconfigured store.
 */
export default function configureStore (initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./modules/reducer', () => {
      const nextRootReducer = require('./modules/reducer')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
