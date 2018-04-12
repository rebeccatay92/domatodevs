import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { getUserAlbums } from '../../apollo/album'
import { openMediaConsole, initializeMediaConsoleAlbums, setFocusedAlbum } from '../../actions/mediaConsoleActions'
import MediaConsole from '../mediaConsole/MediaConsole'
import { setStickyTabs } from '../../actions/userDashboardActions'

const focusedTabStyle = {minHeight: '30px', paddingLeft: '10px', paddingTop: '5px', paddingBottom: '5px', borderLeft: '5px solid black', margin: '0px 0 20px 0', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}
const unfocusedTabStyle = {minHeight: '30px', paddingLeft: '10px', paddingTop: '5px', paddingBottom: '5px', borderLeft: '5px solid transparent', margin: '0px 0 20px 0', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}

class MediaTab extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // no need internal state. takes from redux state props.mediaConsole
    }
    this.handleScrollBound = (e) => this.handleScroll(e)
  }

  switchFocusedAlbum (id) {
    this.props.setFocusedAlbum(id)
  }

  openMediaConsole () {
    this.props.openMediaConsole()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data.getUserAlbums !== this.props.data.getUserAlbums) {
      let albumsArr = nextProps.data.getUserAlbums
      console.log('albumsArr', albumsArr)
      this.props.initializeMediaConsoleAlbums(albumsArr)
      if (!nextProps.mediaConsole.isOpen) {
        if (albumsArr.length) {
          this.props.setFocusedAlbum(albumsArr[0].id)
        }
      }
    }
  }

  componentDidMount () {
    if (this.props.data.getUserAlbums) {
      let albumsArr = this.props.data.getUserAlbums
      console.log('albumsArr', albumsArr)
      this.props.initializeMediaConsoleAlbums(albumsArr)
      if (!this.props.mediaConsole.isOpen) {
        if (albumsArr.length) {
          this.props.setFocusedAlbum(albumsArr[0].id)
        }
      }
    }
    document.addEventListener('scroll', this.handleScrollBound)
  }

  componentWillUnmount () {
    document.removeEventListener('scroll', this.handScrollBound)
  }

  handleScroll (e) {
    const el = document.querySelector('.mediaTabComponent')
    const rect = el.getBoundingClientRect()
    const distFromTop = rect.top
    // console.log('componnet distFromTop', distFromTop)
    if (distFromTop >= 110 && this.props.userDashboard.stickyTabs) {
      this.props.setStickyTabs(false)
    }
  }

  render () {
    if (this.props.data.loading) return <h1>Loading</h1>
    let mediaConsole = this.props.mediaConsole
    let media = mediaConsole.focusedAlbum.media

    return (
      <div className={'mediaTabComponent'} style={{width: '100%', height: 'calc(100vh - 270px)', padding: '15px 0 15px 0', boxSizing: 'border-box', border: '1px solid blue'}}>

        {mediaConsole.isOpen &&
          <MediaConsole />
        }

        <div style={{display: 'inline-block', width: '20%', height: '100%', verticalAlign: 'top', borderRight: '2px solid gray', paddingRight: '10px', overflow: 'scroll'}}>
          <h4 style={unfocusedTabStyle} onClick={() => this.openMediaConsole()}><strong>Album list</strong> <i className='material-icons' style={{color: 'gray', verticalAlign: 'middle'}}>settings</i></h4>
          {mediaConsole.albums.map((album, i) => {
            let isFocusedAlbum = mediaConsole.focusedAlbum.id === album.id
            return (
              <h4 style={isFocusedAlbum ? focusedTabStyle : unfocusedTabStyle} key={i} onClick={() => this.switchFocusedAlbum(album.id)}>{album.title}</h4>
            )
          })}
        </div>

        <div className={'mediaTabContent'} style={{display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'flex-start', verticalAlign: 'top', width: '80%', height: '100%', boxSizing: 'border-box', paddingLeft: '12px'}}>
          {/* <iframe src={'https://www.youtube.com/embed/L5TRm2iADhE'} width='256px' height='144px' style={{margin: '0px 12px 24px 0px'}} frameBorder={0} allowFullScreen /> */}
          {/* <img src={'http://img.youtube.com/vi/L5TRm2iADhE/0.jpg'} width='256px' height='144px' style={{margin: '0px 12px 24px 0px'}} /> */}
          {mediaConsole.albums.length && media.map((medium, i) => {
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
          {!mediaConsole.albums.length &&
            <h3>You don't have any albums!</h3>
          }
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    mediaConsole: state.mediaConsole,
    userDashboard: state.userDashboard
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openMediaConsole: () => {
      dispatch(openMediaConsole())
    },
    initializeMediaConsoleAlbums: (albums) => {
      dispatch(initializeMediaConsoleAlbums(albums))
    },
    setFocusedAlbum: (id) => {
      dispatch(setFocusedAlbum(id))
    },
    setStickyTabs: (sticky) => {
      dispatch(setStickyTabs(sticky))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(getUserAlbums)
)(MediaTab))
