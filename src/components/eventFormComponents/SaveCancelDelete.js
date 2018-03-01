import React, { Component } from 'react'
// import { Button } from 'react-bootstrap'

class SaveCancelDelete extends Component {
  deleteEvent () {
    this.props.deleteEvent()
  }

  render () {
    return (
      <div style={{position: 'absolute', right: '0', bottom: '0', padding: '24px'}}>
        {this.props.delete &&
        <button style={{height: '35px', width: '60px', padding: '8px', fontSize: '16px', border: 'none', marginRight: '16px', textAlign: 'center', borderRadius: '2px', boxShadow: '0px 3px 6px 0px rgba(0, 0, 0, .2)'}} onClick={() => this.deleteEvent()}>Delete</button>
        }
        <button style={{height: '35px', width: '60px', fontSize: '16px', backgroundColor: '#df386b', color: 'white', border: '1px solid #df386b', marginRight: '16px', textAlign: 'center', borderRadius: '2px', boxShadow: '0px 3px 6px 0px rgba(0, 0, 0, .2)'}} onClick={() => this.props.handleSubmit()}>Save</button>
        <button style={{border: '1px solid rgba(223, 56, 107, 0.3)', height: '35px', width: '60px', fontSize: '16px', color: '#df386b', backgroundColor: 'white', textAlign: 'center', borderRadius: '2px', boxShadow: '0px 3px 6px 0px rgba(0, 0, 0, .2)'}} onClick={() => this.props.closeForm()}>Cancel</button>
      </div>
    )
  }
}

export default SaveCancelDelete
