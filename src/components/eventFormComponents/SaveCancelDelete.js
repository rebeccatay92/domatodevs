import React, { Component } from 'react'
// import { Button } from 'react-bootstrap'

class SaveCancelDelete extends Component {
  deleteEvent () {
    this.props.deleteEvent()
  }

  render () {
    return (
      <div style={{position: 'absolute', right: '0', bottom: '0', padding: '2.22222222222vh 1.25vw'}}>
        {this.props.delete &&
        <button style={{height: '3.24074074074vh', width: '3.125vw', padding: '0.74074074074vh 0.41666666666vw', fontSize: '1.48148148148vh', border: 'none', marginRight: '0.83333333333vw', textAlign: 'center', borderRadius: '2px', boxShadow: '0px 3px 6px 0px rgba(0, 0, 0, .2)'}} onClick={() => this.deleteEvent()}>Delete</button>
        }
        <button style={{height: '3.24074074074vh', width: '3.125vw', fontSize: '1.48148148148vh', backgroundColor: '#df386b', color: 'white', border: '0.09259259259vh solid #df386b', marginRight: '0.83333333333vw', textAlign: 'center', borderRadius: '2px', boxShadow: '0px 3px 6px 0px rgba(0, 0, 0, .2)'}} onClick={() => this.props.handleSubmit()}>Save</button>
        <button style={{border: '0.09259259259vh solid rgba(223, 56, 107, 0.3)', height: '3.24074074074vh', width: '3.125vw', fontSize: '1.48148148148vh', color: '#df386b', backgroundColor: 'white', textAlign: 'center', borderRadius: '2px', boxShadow: '0px 3px 6px 0px rgba(0, 0, 0, .2)'}} onClick={() => this.props.closeForm()}>Cancel</button>
      </div>
    )
  }
}

export default SaveCancelDelete
