import React, { Component } from 'react'

const MouseHoverHOC = (WrappedComponent, elemType) => {
  return class extends Component {
    constructor (props) {
      super(props)

      this.state = {
        hover: false
      }
    }

    render () {
      if (!elemType || elemType === 'li') {
        return (
          <li style={{position: 'relative'}} onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})}>
            <WrappedComponent hover={this.state.hover} removeHover={() => this.setState({hover: false})} {...this.props} />
          </li>
        )
      } else if (elemType === 'div') {
        return (
          <div style={{position: 'relative'}} onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})}>
            <WrappedComponent hover={this.state.hover} removeHover={() => this.setState({hover: false})} {...this.props} />
          </div>
        )
      }
    }
  }
}

export default MouseHoverHOC
