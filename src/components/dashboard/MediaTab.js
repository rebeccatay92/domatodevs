import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { getUserAlbums } from '../../apollo/album'

const focusedTabStyle = {minHeight: '30px', paddingLeft: '10px', paddingTop: '5px', paddingBottom: '5px', borderLeft: '5px solid black', margin: '20px 0 20px 0', cursor: 'pointer'}
const unfocusedTabStyle = {minHeight: '30px', paddingLeft: '10px', paddingTop: '5px', paddingBottom: '5px', borderLeft: '5px solid transparent', margin: '20px 0 20px 0', cursor: 'pointer'}

class MediaTab extends Component {
  constructor (props) {
    super(props)
    this.state = {
      albums: [],
      focusedTabIndex: 0,
      mediaInAlbum: [] // changes depending on currently focused album
    }
  }

  switchFocusedAlbum (i) {
    this.setState({
      focusedTabIndex: i,
      mediaInAlbum: this.state.albums[i].media
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data.getUserAlbums !== this.props.data.getUserAlbums) {
      let albums = nextProps.data.getUserAlbums
      this.setState({
        albums: albums,
        focusedTabIndex: 0,
        mediaInAlbum: albums[0].media
      })
    }
  }

  componentDidMount () {
    if (this.props.data.getUserAlbums) {
      this.setState({
        albums: this.props.data.getUserAlbums,
        focusedTabIndex: 0,
        mediaInAlbum: this.props.data.getUserAlbums[0].media
      })
    }
  }

  render () {
    if (this.props.data.loading) return <h1>Loading</h1>
    return (
      <div style={{width: '100%', height: 'calc(100vh - 270px)', padding: '15px 0 15px 0', boxSizing: 'border-box', border: '1px solid red'}}>

        <div style={{display: 'inline-block', width: '20%', height: '100%', verticalAlign: 'top', borderRight: '2px solid gray', paddingRight: '10px', overflow: 'scroll'}}>
          {this.state.albums.map((album, i) => {
            return (
              <h4 style={this.state.focusedTabIndex === i ? focusedTabStyle : unfocusedTabStyle} key={i} onClick={() => this.switchFocusedAlbum(i)}>{album.title}</h4>
            )
          })}
        </div>

        <div style={{display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'flex-start', verticalAlign: 'top', width: '80%', height: '100%', boxSizing: 'border-box', paddingLeft: '12px', margin: '-12px 0 0 0', overflow: 'scroll'}}>
          {this.state.mediaInAlbum.map((medium, i) => {
            return (
              // <h4 key={i}>{medium.id} {medium.url} {medium.type}</h4>
              // 256 X 144. 24px spacing
              <div key={i} style={{width: '256px', height: '144px', margin: '12px'}}>
                <img src={medium.url} width='256px' height='144px' />
              </div>
            )
          })}
        </div>

      </div>
    )
  }
}

export default (compose(
  graphql(getUserAlbums)
)(MediaTab))
