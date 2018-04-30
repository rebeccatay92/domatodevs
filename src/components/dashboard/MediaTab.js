import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { getUserAlbums } from '../../apollo/album'
import { openMediaConsole, initializeMediaConsoleAlbums, setFocusedAlbumId } from '../../actions/mediaConsoleActions'
import MediaConsole from '../mediaConsole/MediaConsole'
import { setStickyTabs, setStickySidebar } from '../../actions/userDashboardActions'

import { MediaTabStyles as styles } from '../../Styles/MediaTabStyles'

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
    if (distFromTop >= 108 && this.props.userDashboard.stickyTabs) {
      this.props.setStickyTabs(false)
      this.props.setStickySidebar(false)
    }
    if (distFromTop < 108 && !this.props.userDashboard.stickySidebar) {
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
      <div className={'mediaTabComponent'} style={styles.mediaTabContainer}>

        {mediaConsole.isOpen &&
          <MediaConsole />
        }

        {/* STICKY SIDEBAR SPACER DIV */}
        {stickySidebar &&
          <div style={{display: 'inline-block', width: '265px', height: 'calc(100vh - 108px)'}} />
        }

        {/* ENTIRE LEFT TABS COLUMN */}
        <div style={stickySidebar ? styles.leftColumnSticky : styles.leftColumnNonSticky}>
          {/* HIGHLIGHTED LINE DIV */}
          <div style={styles.leftColumnRightBorderDiv}>

            <div style={styles.albumListHeaderContainer} onClick={() => this.openMediaConsole()}>
              <h4 style={styles.albumListHeaderText}>Album list</h4>
              <i className='material-icons' style={styles.albumListHeaderIcon}>settings</i>
            </div>

            <div style={styles.albumListContainer}>
              {mediaConsole.albums.map((album, i) => {
                let isFocusedAlbum = mediaConsole.focusedAlbumId === album.id
                return (
                  <h4 style={isFocusedAlbum ? styles.clickedTab : styles.unclickedTab} key={i} onClick={() => this.switchFocusedAlbum(album.id)}>{album.title}</h4>
                )
              })}
            </div>
          </div>
        </div>

        <div style={styles.rightColumn}>
          {/* <iframe src={'https://www.youtube.com/embed/L5TRm2iADhE'} width='256px' height='144px' style={{margin: '0px 12px 24px 0px'}} frameBorder={0} allowFullScreen /> */}
          {/* <img src={'http://img.youtube.com/vi/L5TRm2iADhE/0.jpg'} width='256px' height='144px' style={{margin: '0px 12px 24px 0px'}} /> */}
          {focusedAlbum && focusedAlbum.media.map((medium, i) => {
            // 256 X 144. 24px spacing
            return (
              <div key={i} style={styles.mediaThumbnailContainer}>
                {medium.type === 'Photo' &&
                  <img src={medium.imageUrl} style={styles.imageThumbnail} />
                }
                {medium.type === 'Youtube' &&
                  <iframe key={i} src={`${medium.youtubeUrl}?modestbranding=1&rel=0`} width='256px' height='144px' frameBorder={0} allowFullScreen />
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
