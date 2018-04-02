import React, { Component } from 'react'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'

const liStyle = {cursor: 'default', lineHeight: '100%', padding: '8px', whiteSpace: 'nowrap', ':hover': {color: '#ed685a'}}

class BlogDropdownMenu extends Component {
  render () {
    return (
      <div style={{position: 'absolute', top: '11px', left: '9px', backgroundColor: 'white', zIndex: 1, display: 'inline-block', boxShadow: '0px 3px 6px 0px rgba(0, 0, 0, .2)'}}>
        <ul style={{listStyleType: 'none', padding: 0}}>
          {this.props.heading && <li key='addPost' style={liStyle}>Add Post</li>}
          {this.props.heading && <li key='addHeader' style={liStyle}>Add Header Below</li>}
          {this.props.heading && <li key='delHead' style={liStyle}>Delete Header</li>}
          {this.props.post && <li key='delPost' style={liStyle}>Delete Post</li>}
        </ul>
      </div>
    )
  }

  handleClickOutside (event) {
    this.props.toggleDropdown(event)
  }
}

export default onClickOutside(Radium(BlogDropdownMenu))
