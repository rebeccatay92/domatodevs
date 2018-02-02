import React, {Component} from 'react'

class Thumbnail extends Component {
  render () {
    const style = {
      display: 'block',
      position: 'absolute',
      left: 0,
      bottom: '50px',
      zIndex: 1
    }
    return (
      <div style={style}>
        <img src={this.props.thumbnailUrl} alt='thumbnail' width='auto' height='auto' style={{maxWidth: '200px', maxHeight: '200px'}} />
      </div>
    )
  }
}

export default Thumbnail
