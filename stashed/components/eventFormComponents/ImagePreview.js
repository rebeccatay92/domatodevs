import React, { Component } from 'react'

class ImagePreview extends Component {
  render () {
    return (
      <div style={{background: 'transparent', position: 'fixed', left: '10%', top: '10%', zIndex: '9999', height: '80%', width: '80%', textAlign: 'center'}}>
        <img src={this.props.previewUrl} alt='preview' style={{maxWidth: '100%', maxHeight: '100%'}} />
        <button onClick={() => this.props.setBackground(this.props.previewUrl)} style={{color: 'black', position: 'absolute', top: '0', left: '0'}}>Set as background</button>
        {/* <div style={{position: 'fixed', top: '10%', left: '50px'}} onClick={() => this.props.setBackground(this.props.previewUrl)}>
          <i className='material-icons' style={{color: 'black', cursor: 'pointer'}}>panorama</i>
          <span style={{color: 'black'}}>Set as Background</span>
        </div> */}
      </div>
    )
  }
}

export default ImagePreview
