import React, { Component } from 'react'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'

class AttachmentOptionsDropdown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      downloadUrl: ''
    }
  }
  handleClickOutside (event) {
    this.props.toggleDropdown()
  }

  setBackground () {
    this.props.toggleDropdown()
    this.props.setBackground()
  }

  removeUpload () {
    this.props.toggleDropdown()
    this.props.removeUpload()
  }

  componentDidMount () {
    // console.log('file', this.props.file)
    var fileName = this.props.file.fileName
    var url = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}${fileName}`
    url = url.replace(/ /gi, '%20')
    this.setState({downloadUrl: url})
  }

  render () {
    return (
      <div style={{width: '145px', position: 'absolute', left: '50px', top: '0px', backgroundColor: 'white', zIndex: 1, cursor: 'default', boxShadow: '0px 1px 5px 2px rgba(0, 0, 0, .2)'}}>
        <div style={{margin: '8px'}} onClick={() => this.setBackground()}>
          <span key='setBackground' style={{color: '#3C3A44', ':hover': {color: '#ed685a'}}}>Set as background</span>
        </div>
        <a href={this.state.downloadUrl} download style={{margin: '8px', color: 'black'}} onClick={() => this.props.toggleDropdown()}>Download File</a>
        <div style={{margin: '8px'}} onClick={() => this.props.removeUpload()}>
          <span key='removeUpload' style={{color: '#3C3A44', ':hover': {color: '#ed685a'}}}>Remove upload</span>
        </div>
      </div>
    )
  }
}

export default onClickOutside(Radium(AttachmentOptionsDropdown))
