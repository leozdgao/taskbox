import React, { Component, PropTypes as T } from 'react'
import { connect } from 'react-redux'
import { dataDependence } from '../../components'
import { ProjectActions, CompanyActions } from '../../redux/modules'
import { diff } from '../../utils'

// function mapStateToProps (state) {
//   const { project, company } = state
//
//   // data fetching deps
//   // 'project' -> 'company'
//
//   return {
//     project, company
//   }
// }

// @connect(
//   mapStateToProps
// )

@dataDependence((props, getState) => {
  const { params: { pid } } = props

  return {
    projectView: [
      {
        state: 'chat.loadProject',
        key: pid,
        action: ChatActions.loadProject,
        args: [ pid ],
        mapVal: ({ project: { data } }) => ({  })
      },
      {
        state: 'chat.loadCompany',
        key: ({ companyId }) => companyId,
        action: ChatActions.loadCompany,
        args: ({ companyId }) => [ companyId ],
        mapVal: ({ company: { data } }) => ({ })
      }
    ]
  }
})
class ProjectDetail extends Component {
  static propTypes = {
    params: T.object
  }

  contructor (props, context) {
    super(props, context)

    this.state = {

    }
  }

  componentWillReceiveProps (nextProps) {
    const diffProps = diff(this.props.params, nextProps.params)
    diffProps('pid', () => {
      this.tryToGetProject(nextProps)
    })
  }

  componentDidMount () {
    this.tryToGetProject(this.props)
  }

  render () {
    return (
      <div></div>
    )
  }

  tryToGetProject (props) {
    const {
      params: { pid },
      project: { data: projectData }
    } = props
  }
}

export default ProjectDetail
