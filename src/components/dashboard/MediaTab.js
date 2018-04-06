import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { getUserAlbums } from '../../apollo/album'

const focusedTabStyle = {minHeight: '30px', paddingLeft: '10px', paddingTop: '5px', paddingBottom: '5px', borderLeft: '5px solid black', margin: '0px 0 20px 0', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}
const unfocusedTabStyle = {minHeight: '30px', paddingLeft: '10px', paddingTop: '5px', paddingBottom: '5px', borderLeft: '5px solid transparent', margin: '0px 0 20px 0', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}

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

  openMediaConsole () {
    console.log('open media console')
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
      <div style={{width: '100%', height: 'calc(100vh - 270px)', padding: '15px 0 15px 0', boxSizing: 'border-box'}}>

        <div style={{display: 'inline-block', width: '20%', height: '100%', verticalAlign: 'top', borderRight: '2px solid gray', paddingRight: '10px', overflow: 'scroll'}}>
          <h4 style={unfocusedTabStyle} onClick={() => this.openMediaConsole()}><strong>Album list </strong><i className='material-icons' style={{color: 'gray', verticalAlign: 'middle'}}>settings</i></h4>
          {this.state.albums.map((album, i) => {
            return (
              <h4 style={this.state.focusedTabIndex === i ? focusedTabStyle : unfocusedTabStyle} key={i} onClick={() => this.switchFocusedAlbum(i)}>{album.title}</h4>
            )
          })}
        </div>

        <div style={{display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'flex-start', verticalAlign: 'top', width: '80%', height: '100%', boxSizing: 'border-box', paddingLeft: '12px', overflow: 'scroll'}}>
          {/* <iframe src={'https://www.youtube.com/embed/L5TRm2iADhE'} width='256px' height='144px' style={{margin: '0px 12px 24px 0px'}} frameBorder={0} allowFullScreen /> */}
          {/* <img src={'http://img.youtube.com/vi/L5TRm2iADhE/0.jpg'} width='256px' height='144px' style={{margin: '0px 12px 24px 0px'}} /> */}
          {this.state.mediaInAlbum.map((medium, i) => {
            // 256 X 144. 24px spacing
            if (medium.type === 'Photo') {
              return (
                <div key={i} style={{width: '256px', height: '144px', margin: '0px 12px 24px 0px'}}>
                  <img src={medium.imageUrl} width='256px' height='144px' />
                </div>
              )
            } else if (medium.type === 'Youtube') {
              return (
                <iframe src='#' width='256px' height='144px' style={{margin: '0px 12px 24px 0px'}} frameBorder={0} allowFullScreen />
              )
            }
          })}
        </div>

      </div>
    )
  }
}

export default (compose(
  graphql(getUserAlbums)
)(MediaTab))
