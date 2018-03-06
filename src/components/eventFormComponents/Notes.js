import React, { Component } from 'react'

const labelStyle = {
  fontSize: '1.2037037037vh',
  fontWeight: '400',
  marginBottom: '1.48148148148vh',
  lineHeight: '1.38888888889vh'
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
        <textarea type='text' name='notes' value={this.props.notes} onChange={(e) => this.props.handleChange(e)} style={{width: '100%', height: '18.3333333333vh', display: 'block', marginBottom: '1.48148148148vh'}} />
      </div>
    )
  }
}

export default Notes
