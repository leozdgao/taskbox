import React from 'react'
import { IndexRoute, Route } from 'react-router'
import * as containers from './containers'

const {
  App,
  Dashboard,
  Task,
  Team,
  FormDemo
} = containers

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Dashboard} />
    <Route path="task" component={Task} />
    <Route path="team" component={Team} />
  </Route>
)
