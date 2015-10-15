import React from 'react'
import { Route } from 'react-router'
import * as containers from './containers'

const {
  App,
  ChatBox,
  FormDemo,
  DailyTask
} = containers

export default (
  <Route component={App}>
    <Route path="/" component={ChatBox} />
    <Route path="/form" component={FormDemo} />
    <Route path="/task" component={DailyTask} />
  </Route>
)
