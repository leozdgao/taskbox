import React, { Component, PropTypes as T } from 'react'
import { PageHeading } from '../../components'

export default class Team extends Component {

  render () {
    return (
      <PageHeading title="Team" breadcrumb={[
        { title: 'Home', link: '/' },
        { title: 'Team', link: '/team' }
      ]}/>
    )
  }
}
