import React, { Component, PropTypes as T } from 'react'
import { Modal } from '../../components'
import ResourceAssigner from './ResourceAssigner'

class NewTaskModal extends Component {

  static contextTypes = {
    socket: T.object,
    currentUser: T.object,
    resourceInfo: T.array
  }

  static propTypes = {
    isShowed: T.bool,
    onHide: T.func
  }

  static defaultProps = {
    isShowed: false,
    onHide: () => {}
  }

  render () {
    return (
      <Modal isShowed={this.props.isShowed}
        animateName='modalFade' transitionTimeout={500}
        dimmerClassName='modal-dimmer' modalClassName='modal-dialog'>
        <div className="modal-content">
          <div>
            <div className="modal-header">
              <button type="button" className="close" onClick={this.props.onHide}>
                <span aria-hidden="true">×</span>
              </button>
              <h4 className="modal-title">Publish a new Task</h4>
            </div>
            <div className="modal-body">
              {/* <Form invalidClassName='error' validator={validator}>
                <Form.Input name='title' className='form-group' inputClassName='form-control lean-control' title='Title' placeholder='Task title' invalidClassName='error' />
                <Form.Input name='description' className='form-group' inputClassName='form-control lean-control' title='Description' placeholder='Task description' invalidClassName='error' />
                <Form.Input name='type' className='form-group' inputClassName='form-control lean-control' title='Type' placeholder='Task type' invalidClassName='error' />
                <Form.Input name='assignee' className='form-group' inputClassName='form-control lean-control' title='Assignee' placeholder='Task title' invalidClassName='error' />
              </Form> */}
              <form>
                <div className="form-group">
                  <label htmlFor="titleInput">Title</label>
                  <input className="form-control" name="title" id="titleInput" placeholder="Title" />
                </div>
                <div className="form-group">
                  <label htmlFor="descriptionInput">Description</label>
                  <textarea className="form-control" name="description" id="descriptionInput" placeholder="Description..." rows={5} />
                </div>
                <div className="form-group">
                  <label htmlFor="descriptionInput">Type</label>
                  <div>
                    <label className="radio-inline">
                      <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="SOW" /> SOW
                    </label>
                    <label className="radio-inline">
                      <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="PCR" /> PCR
                    </label>
                    <label className="radio-inline">
                      <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="Improvement" /> Improvement
                    </label>
                    <label className="radio-inline">
                      <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="Bugfix" /> Bugfix
                    </label>
                    <label className="radio-inline">
                      <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="Bugfix" /> Others
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Assignee</label>
                  <ResourceAssigner avaliableResources={this.context.resourceInfo} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-sm btn-white" onClick={this.props.onHide}>Cancel</button>
              <button type="button" className="btn btn-sm btn-success">Publish</button>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default NewTaskModal
