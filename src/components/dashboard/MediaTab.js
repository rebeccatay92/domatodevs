import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { getUserAlbums } from '../../apollo/album'
import { openMediaConsole, initializeMediaConsoleAlbums, setFocusedAlbumId } from '../../actions/mediaConsoleActions'
import MediaConsole from '../mediaConsole/MediaConsole'
import { setStickyTabs, setStickySidebar } from '../../actions/userDashboardActions'

const unfocusedTabStyle = {paddingLeft: '4px', cursor: 'pointer', color: 'rgba(60, 58, 68, 1)', fontFamily: 'EB Garamond, serif', fontSize: '16px', lineHeight: '21px', fontWeight: '400', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', height: '21px', marginTop: '24px', borderLeft: '4px solid transparent'}
const focusedTabStyle = {...unfocusedTabStyle, borderLeft: '4px solid rgba(60, 58, 68, 1)'}

class MediaTab extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // no need internal state. takes from redux state props.mediaConsole
    }
    this.handleScrollBound = (e) => this.handleScroll(e)
  }

  switchFocusedAlbum (id) {
    this.props.setFocusedAlbumId(id)
  }

  openMediaConsole () {
    this.props.openMediaConsole('dashboard')
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data.getUserAlbums !== this.props.data.getUserAlbums) {
      let albumsArr = nextProps.data.getUserAlbums
      this.props.initializeMediaConsoleAlbums(albumsArr)
      if (!nextProps.mediaConsole.isOpen) {
        if (albumsArr.length) {
          this.props.setFocusedAlbumId(albumsArr[0].id)
        }
      }
    }
  }

  componentDidMount () {
    if (this.props.data.getUserAlbums) {
      let albumsArr = this.props.data.getUserAlbums
      this.props.initializeMediaConsoleAlbums(albumsArr)
      if (!this.props.mediaConsole.isOpen) {
        if (albumsArr.length) {
          this.props.setFocusedAlbumId(albumsArr[0].id)
        }
      }
    }
    document.addEventListener('scroll', this.handleScrollBound)
  }

  componentWillUnmount () {
    document.removeEventListener('scroll', this.handleScrollBound)
  }

  handleScroll (e) {
    const el = document.querySelector('.mediaTabComponent')
    if (!el) return
    const rect = el.getBoundingClientRect()
    const distFromTop = rect.top
    // console.log('componnet distFromTop', distFromTop)
    if (distFromTop >= 110 && this.props.userDashboard.stickyTabs) {
      this.props.setStickyTabs(false)
      this.props.setStickySidebar(false)
    }
    if (distFromTop < 110 && !this.props.userDashboard.stickySidebar) {
      this.props.setStickySidebar(true)
    }
  }

  render () {
    if (this.props.data.loading) return <h1>Loading</h1>
    let mediaConsole = this.props.mediaConsole
    let albumsArr = mediaConsole.albums
    let focusedAlbumId = mediaConsole.focusedAlbumId
    // find focusedAlbum from albums arr. if not found (initially no id '' in redux state), it is undef
    let focusedAlbum = albumsArr.find(e => {
      return e.id === focusedAlbumId
    })
    // let media = mediaConsole.focusedAlbum.media

    let stickySidebar = this.props.userDashboard.stickySidebar

    return (
      <div className={'mediaTabComponent'} style={{width: '100%', height: 'calc(100vh - 270px)', boxSizing: 'border-box'}}>

        {mediaConsole.isOpen &&
          <MediaConsole />
        }

        {/* STICKY SIDEBAR SPACER DIV */}
        {stickySidebar &&
          <div style={{display: 'inline-block', width: '265px', height: 'calc(100vh - 110px)'}} />
        }

        {/* ENTIRE LEFT TABS COLUMN */}
        <div style={{display: 'inline-block', width: '265px', height: 'calc(100vh - 110px)', verticalAlign: 'top', paddingTop: '24px', paddingBottom: '24px', paddingLeft: '2px', background: 'white', position: stickySidebar ? 'fixed' : 'relative', top: stickySidebar ? '106px' : '0', left: stickySidebar ? 'calc((100vw - 1265px)/2)' : '0'}}>
          {/* HIGHLIGHTED LINE DIV */}
          <div style={{borderRight: '1px solid rgba(60, 58, 68, 0.3)', width: '100%', height: '100%'}}>

            <div style={{display: 'flex', alignItems: 'center', height: '24px', cursor: 'pointer'}} onClick={() => this.openMediaConsole()}>
              <h4 style={{paddingLeft: '8px', fontSize: '24px', fontFamily: 'EB Garamond, serif', fontWeight: '400'}}>Album list</h4>
              <i className='material-icons' style={{color: 'rgba(60, 58, 68, 0.3)', marginLeft: '10px'}}>settings</i>
            </div>

            <div style={{width: '100%', height: 'calc(100% - 24px)', overflow: 'scroll'}}>
              {mediaConsole.albums.map((album, i) => {
                let isFocusedAlbum = mediaConsole.focusedAlbumId === album.id
                return (
                  <h4 style={isFocusedAlbum ? focusedTabStyle : unfocusedTabStyle} key={i} onClick={() => this.switchFocusedAlbum(album.id)}>{album.title}</h4>
                )
              })}
            </div>
          </div>
        </div>

        <div style={{display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignContent: 'flex-start', verticalAlign: 'top', width: 'calc(100% - 265px)', height: '100%', boxSizing: 'border-box', paddingLeft: '24px', paddingTop: '24px'}}>
          {/* <iframe src={'https://www.youtube.com/embed/L5TRm2iADhE'} width='256px' height='144px' style={{margin: '0px 12px 24px 0px'}} frameBorder={0} allowFullScreen /> */}
          {/* <img src={'http://img.youtube.com/vi/L5TRm2iADhE/0.jpg'} width='256px' height='144px' style={{margin: '0px 12px 24px 0px'}} /> */}
          {focusedAlbum && focusedAlbum.media.map((medium, i) => {
            // 256 X 144. 24px spacing
            return (
              <div key={i} style={{width: '256px', height: '144px', margin: '0px 24px 24px 0px'}}>
                {medium.type === 'Photo' &&
                  <img src={medium.imageUrl} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                }
                {medium.type === 'Youtube' &&
                  <iframe key={i} src={`${medium.youtubeUrl}?modestbranding=1&rel=0`} width='256px' height='144px' style={{margin: '0px 24px 24px 0px'}} frameBorder={0} allowFullScreen />
                }
              </div>
            )
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
    openMediaConsole: (openedFrom) => {
      dispatch(openMediaConsole(openedFrom))
    },
    initializeMediaConsoleAlbums: (albums) => {
      dispatch(initializeMediaConsoleAlbums(albums))
    },
    setFocusedAlbumId: (id) => {
      dispatch(setFocusedAlbumId(id))
    },
    setStickyTabs: (sticky) => {
      dispatch(setStickyTabs(sticky))
    },
    setStickySidebar: (sticky) => {
      dispatch(setStickySidebar(sticky))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(getUserAlbums)
)(MediaTab))
