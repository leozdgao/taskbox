import React from 'react'
import { IndexRoute, Route } from 'react-router'
import * as containers from './containers'

const {
  App,
  Dashboard,
  Task,
  Team,
  Document,
  Profile,
  Page404
} = containers

export default (
  <Route>
    <Route path="/" component={App}>
      <IndexRoute component={Dashboard} />
      <Route path="task" component={Task} />
      <Route path="team" component={Team} />
      <Route path="doc" component={Document} />
      <Route path="profile" component={Profile} />
    </Route>
    <Route path="*" component={Page404} />
  </Route>
)
