import React, { Component } from 'react'

// UNUSED FILE. WAS FOR AUTH SDK FOR WEB.
const callbackStyle = {
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  height: '100vh',
  width: '100vw',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'white'
}
class Callback extends Component {

  componentDidMount () {
    this.props.handleAuthentication()
  }

  render () {
    return (
      <div style={callbackStyle}>
        Loading (Callback component)
      </div>
    )
  }
}

export default Callback
