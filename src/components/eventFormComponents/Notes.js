import React, { Component } from 'react'

const labelStyle = {
  fontSize: '13px',
  display: 'block',
  margin: '0',
  lineHeight: '26px'
}

// DIRECTLY PASS THE VALUE UP TO FORM, WHICH NOTES IS CHANGING DEPENDS ON PROPS FXN
class Notes extends Component {
  render () {
    return (
      <div>
        <label style={labelStyle}>
          {/* LABEL IS NOTES, DEPARTURE NOTES ETC */}
          {this.props.label}
        </label>
        <textarea type='text' name='notes' value={this.props.notes} onChange={(e) => this.props.handleChange(e)} style={{width: '100%', height: '100px', display: 'block'}} />
      </div>
    )
  }
}

export default Notes
