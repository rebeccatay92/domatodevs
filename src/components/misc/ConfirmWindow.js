import React, { Component } from 'react'

class ConfirmWindow extends Component {
  render () {
    return (
      <div style={{position: 'fixed', top: '0', left: '0', height: '100vh', width: '100vw', backgroundColor: 'rgba(255, 255, 255, 0.5)', zIndex: '9999'}}>
        <div style={{border: '1px solid black', margin: '0 auto', width: '40vw', height: '20vh', backgroundColor: 'white', position: 'relative', top: '33%', transform: 'translateY(-50%)'}}>
          <span>{this.props.message}</span>
          <div style={{position: 'absolute', bottom: 0, right: 0, padding: '0 16px 16px 0'}}>
            <button style={{marginRight: '16px'}} onClick={() => this.props.cancelFn()}>Cancel</button>
            <button onClick={() => this.props.confirmFn()}>{this.props.confirmMessage}</button>
          </div>
        </div>
      </div>
    )
  }
}

export default ConfirmWindow
