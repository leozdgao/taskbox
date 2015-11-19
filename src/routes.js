import React from 'react'
import { IndexRoute, Route } from 'react-router'
import * as containers from './containers'

const {
  App,
  Dashboard,
  Info,
  CompanyDetail,
  ProjectDetail,
  Task,
  Team,
  Document,
  NewPost,
  PostList,
  PostView,
  Profile,
  Page404
} = containers

export default (
  <Route>
    <Route path="/" component={App}>
      <IndexRoute component={Dashboard} />
      <Route path="info" component={Info}>
        <Route path="c/:cid" component={CompanyDetail} />
        <Route path="p/:pid" component={ProjectDetail} />
      </Route>
      <Route path="task" component={Task} />
      <Route path="team" component={Team} />
      <Route path="doc" component={Document}>
        <IndexRoute component={PostList} />
        <Route path="new" component={NewPost} />
        <Route path=":page" component={PostList} />
        <Route path="p/:docId" component={PostView} />
      </Route>
      <Route path="profile" component={Profile} />
    </Route>
    <Route path="*" component={Page404} />
  </Route>
)
