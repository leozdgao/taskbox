import React from 'react'
import { Route } from 'react-router'
import * as containers from './containers'


const {
  App,
  ChatBox,
  FormDemo
} = containers

export default (
  <Route component={App}>
    <Route path="/" component={ChatBox} />
    <Route path="/form" component={FormDemo} />
  </Route>
)
