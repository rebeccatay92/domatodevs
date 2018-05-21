import React, { Component } from 'react'
import Radium from 'radium'
import { primaryColor } from '../../Styles/styles'
// SUBMIT AND CANCEL ACTIONS ARE DEFINED DEPENDING ON THE PARENT FORM

class SubmitCancelForm extends Component {
  render () {
    return (
      <div style={{position: 'absolute', top: '20px', right: '20px', color: '#9FACBC'}}>
        {!this.props.flight && <i key='creatEventSubmit' onClick={() => this.props.handleSubmit()} className='material-icons' style={{marginRight: '5px', cursor: 'pointer', ':hover': {color: primaryColor}}}>done</i>}
        <i key='creatEventClose' onClick={() => this.props.closeForm()} className='material-icons' style={{cursor: 'pointer', ':hover': {color: primaryColor}}}>clear</i>
      </div>
    )
  }
}

export default Radium(SubmitCancelForm)
