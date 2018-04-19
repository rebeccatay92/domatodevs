import React, { Component } from 'react'
import { connect } from 'react-redux'

import { confirmClicked, cancelClicked } from '../../actions/confirmWindowActions'

class ConfirmWindow extends Component {
  render () {
    return (
      <div style={{position: 'fixed', top: '0', left: '0', height: '100vh', width: '100vw', backgroundColor: 'rgba(255, 255, 255, 0.5)', zIndex: '9999'}}>
        <div style={{border: '1px solid black', margin: '0 auto', width: '40vw', minHeight: '30vh', backgroundColor: 'white', position: 'relative', top: '33%', transform: 'translateY(-50%)', padding: '24px'}}>
          <span>{this.props.confirmWindow.message}</span>
          <br /><br />
          <span>{this.props.confirmWindow.secondaryMessage}</span>
          <div style={{position: 'absolute', bottom: 0, right: 0, padding: '0 16px 16px 0'}}>
            <button style={{marginRight: '16px'}} onClick={() => this.props.cancelClicked()}>Cancel</button>
            <button onClick={() => this.props.confirmClicked()}>{this.props.confirmWindow.confirmMessage}</button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    confirmWindow: state.confirmWindow
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    confirmClicked: () => {
      dispatch(confirmClicked())
    },
    cancelClicked: () => {
      dispatch(cancelClicked())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmWindow)
