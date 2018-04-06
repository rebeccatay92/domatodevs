import React, { Component } from 'react'
import Radium, { Style } from 'radium'
import { connect } from 'react-redux'
import { closeMediaConsole } from '../../actions/mediaConsoleActions'

class MediaConsole extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div style={{backgroundColor: 'rgba(180, 180, 180, 0.5)', position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, zIndex: 999, overflow: 'auto', maxHeight: '100vh', maxWidth: '100vw'}}>
        <Style rules={{html: {overflowY: 'hidden'}}} />

        <i className='material-icons' style={{position: 'fixed', top: '10vh', left: 'calc((100vw - 1134px)/2 - 50px)', fontSize: '36px', cursor: 'pointer'}} onClick={() => this.props.closeMediaConsole()}>close</i>
        <div style={{position: 'fixed', left: 'calc((100vw - 1134px)/2)', top: '10vh', width: '1134px', height: '744px', background: 'white'}}>
          <div style={{display: 'inline-block', width: '274px', height: '100%', background: 'rgb(24, 143, 143)'}}>
            Left column
          </div>
          <div style={{display: 'inline-block', width: '860px', height: '100%'}}>
            Right column
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeMediaConsole: () => {
      dispatch(closeMediaConsole())
    }
  }
}

export default connect(null, mapDispatchToProps)(Radium(MediaConsole))
