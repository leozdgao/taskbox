/* global __DEVTOOLS__ */
import { createStore, applyMiddleware, compose } from 'redux'
// import { reduxReactRouter } from 'redux-router'
import { createHistory } from 'history'
import routes from '../routes'

import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'
import createLogger from 'redux-logger'
import cacheablePromise from './middlewares/cacheablePromise'
import thenablePromise from './middlewares/thenablePromise'
import apiMiddleWare from './middlewares/apiMiddleware'
import combineActionMiddleware from './middlewares/combineActionMiddleware'

import rootReducer from './modules/reducer'

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
})

let createStoreWithMiddleware

const storeEnhancer = compose(
  applyMiddleware(
    apiMiddleWare, combineActionMiddleware,
    cacheablePromise,
    thenablePromise, promiseMiddleware(),
    thunkMiddleware, loggerMiddleware
  )
  // reduxReactRouter({
  //   routes,
  //   createHistory
  // })
)

if (typeof __DEVTOOLS__ !== 'undefined' && __DEVTOOLS__) {
  const { devTools, persistState } = require('redux-devtools')
  createStoreWithMiddleware = compose(
    storeEnhancer,
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore)
} else {
  createStoreWithMiddleware = storeEnhancer(createStore)
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
