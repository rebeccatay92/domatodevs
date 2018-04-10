import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { getUserAlbums } from '../../apollo/album'
import { openMediaConsole, initializeMediaConsole, setFocusedAlbum } from '../../actions/mediaConsoleActions'
import MediaConsole from '../mediaConsole/MediaConsole'

const focusedTabStyle = {minHeight: '30px', paddingLeft: '10px', paddingTop: '5px', paddingBottom: '5px', borderLeft: '5px solid black', margin: '0px 0 20px 0', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}
const unfocusedTabStyle = {minHeight: '30px', paddingLeft: '10px', paddingTop: '5px', paddingBottom: '5px', borderLeft: '5px solid transparent', margin: '0px 0 20px 0', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}

class MediaTab extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // no need internal state. takes from redux state props.mediaConsole
    }
  }

  switchFocusedAlbum (i) {
    this.props.setFocusedAlbum(i)
  }

  openMediaConsole () {
    this.props.openMediaConsole()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data.getUserAlbums !== this.props.data.getUserAlbums) {
      let albumsArr = nextProps.data.getUserAlbums
      this.props.initializeMediaConsole(albumsArr)
    }
  }

  componentDidMount () {
    if (this.props.data.getUserAlbums) {
      let albumsArr = this.props.data.getUserAlbums
      this.props.initializeMediaConsole(albumsArr)
    }
  }

  render () {
    if (this.props.data.loading) return <h1>Loading</h1>
    return (
      <div style={{width: '100%', height: 'calc(100vh - 270px)', padding: '15px 0 15px 0', boxSizing: 'border-box'}}>

        {this.props.mediaConsole.isOpen &&
          <MediaConsole />
        }

        <div style={{display: 'inline-block', width: '20%', height: '100%', verticalAlign: 'top', borderRight: '2px solid gray', paddingRight: '10px', overflow: 'scroll'}}>
          <h4 style={unfocusedTabStyle} onClick={() => this.openMediaConsole()}><strong>Album list </strong><i className='material-icons' style={{color: 'gray', verticalAlign: 'middle'}}>settings</i></h4>
          {this.props.mediaConsole.albums.map((album, i) => {
            let isFocusedAlbum = this.props.mediaConsole.focusedAlbum.id === album.id
            return (
              <h4 style={isFocusedAlbum ? focusedTabStyle : unfocusedTabStyle} key={i} onClick={() => this.switchFocusedAlbum(i)}>{album.title}</h4>
            )
          })}
        </div>

        <div style={{display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'flex-start', verticalAlign: 'top', width: '80%', height: '100%', boxSizing: 'border-box', paddingLeft: '12px', overflow: 'scroll'}}>
          {/* <iframe src={'https://www.youtube.com/embed/L5TRm2iADhE'} width='256px' height='144px' style={{margin: '0px 12px 24px 0px'}} frameBorder={0} allowFullScreen /> */}
          {/* <img src={'http://img.youtube.com/vi/L5TRm2iADhE/0.jpg'} width='256px' height='144px' style={{margin: '0px 12px 24px 0px'}} /> */}
          {this.props.mediaConsole.focusedAlbum.media.map((medium, i) => {
            // 256 X 144. 24px spacing
            if (medium.type === 'Photo') {
              return (
                <div key={i} style={{width: '256px', height: '144px', margin: '0px 12px 24px 0px'}}>
                  {/* NEED TO POSITION LANDSCAPE/PORTRAIT PROPERLY */}
                  <img src={medium.imageUrl} width='256px' height='144px' />
                </div>
              )
            } else if (medium.type === 'Youtube') {
              return (
                <iframe key={i} src={medium.youtubeUrl} width='256px' height='144px' style={{margin: '0px 12px 24px 0px'}} frameBorder={0} allowFullScreen />
              )
            }
          })}
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    mediaConsole: state.mediaConsole
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openMediaConsole: () => {
      dispatch(openMediaConsole())
    },
    initializeMediaConsole: (albums) => {
      dispatch(initializeMediaConsole(albums))
    },
    setFocusedAlbum: (index) => {
      dispatch(setFocusedAlbum(index))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(getUserAlbums)
)(MediaTab))
