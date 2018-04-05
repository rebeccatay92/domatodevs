import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { getUserAlbums } from '../../apollo/album'

const focusedTabStyle = {paddingLeft: '10px', borderLeft: '5px solid gray', margin: '20px 0 20px 0', cursor: 'pointer'}
const unfocusedTabStyle = {paddingLeft: '10px', borderLeft: '5px solid transparent', margin: '20px 0 20px 0', cursor: 'pointer'}

class MediaTab extends Component {
  constructor (props) {
    super(props)
    this.state = {
      albums: [],
      focusedTabIndex: 0
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data.getUserAlbums !== this.props.data.getUserAlbums) {
      let albums = nextProps.data.getUserAlbums
      this.setState({albums: albums})
    }
  }

  componentDidMount () {
    if (this.props.data.getUserAlbums) {
      this.setState({albums: this.props.data.getUserAlbums})
    }
  }

  render () {
    if (this.props.data.loading) return <h1>Loading</h1>
    return (
      <div style={{width: '100%', minHeight: 'calc(100vh - 360px)', border: '1px solid red', padding: '15px 0 15px 0', boxSizing: 'border-box'}}>

        <div style={{display: 'inline-block', width: '20%', minHeight: 'calc(100vh - 375px)', borderRight: '2px solid gray', paddingRight: '10px', overflow: 'scroll'}}>
          {this.state.albums.map((album, i) => {
            return (
              <h4 style={this.state.focusedTabIndex === i ? focusedTabStyle : unfocusedTabStyle} key={i}>{album.title}</h4>
            )
          })}
        </div>

        {/* RIGHT SECTION WITH PHOTOS, VIDEO THUMBNAILS */}
        <div style={{display: 'inline-block', verticalAlign: 'top', width: '80%', boxSizing: 'border-box', paddingLeft: '20px'}}>
          section
        </div>

      </div>
    )
  }
}

export default (compose(
  graphql(getUserAlbums)
)(MediaTab))
