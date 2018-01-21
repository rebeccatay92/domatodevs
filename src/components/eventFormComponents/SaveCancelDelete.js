import React, { Component } from 'react'
import { Button } from 'react-bootstrap'

class SaveCancelDelete extends Component {
  deleteEvent () {
    console.log('delete')
  }

  render () {
    return (
      <div style={{position: 'absolute', right: '0', bottom: '0', padding: '10px'}}>
        {this.props.delete &&
        <Button bsStyle='default' style={{border: 'none', marginRight: '5px'}} onClick={() => this.deleteEvent()}>Delete</Button>
        }
        <Button bsStyle='default' style={{border: 'none', marginRight: '5px'}} onClick={() => this.props.closeForm()}>Cancel</Button>
        <Button bsStyle='danger' style={{backgroundColor: '#ed685a', border: 'none'}} onClick={() => this.props.handleSubmit()}>Save</Button>
      </div>
    )
  }
}

export default SaveCancelDelete
