import React from 'react'
import { IndexRoute, Route } from 'react-router'
import * as containers from './containers'

const {
  App,
  Dashboard,
  Task,
  Team,
  Page404
} = containers

export default (
  <Route>
    <Route path="/" component={App}>
      <IndexRoute component={Dashboard} />
      <Route path="task" component={Task} />
      <Route path="team" component={Team} />
    </Route>
    <Route path="*" component={Page404} />
  </Route>
)
