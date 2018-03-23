import React, {Component} from 'react'
import onClickOutside from 'react-onclickoutside'

class FullScreenMedia extends Component {
  render () {
    return <img src={this.props.url} style={{left: '50%', position: 'relative', top: '50%', transform: 'translateY(-50%) translateX(-50%)', maxWidth: '95vw', maxHeight: '95vh'}} />
  }

  handleClickOutside (event) {
    this.props.toggleFullScreen()
  }
}

export default onClickOutside(FullScreenMedia)
