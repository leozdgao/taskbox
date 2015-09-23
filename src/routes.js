import React from 'react'
import { Route } from 'react-router'
import * as containers from './containers'


const {
  App,
  ChatBox
} = containers


export default (
  <Route component={App}>
    <Route path="/" component={ChatBox} />
  </Route>
)
