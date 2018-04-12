import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { getUserAlbums } from '../../apollo/album'
import { openMediaConsole, initializeMediaConsoleAlbums, setFocusedAlbum } from '../../actions/mediaConsoleActions'
import MediaConsole from '../mediaConsole/MediaConsole'
import { setStickyTabs } from '../../actions/userDashboardActions'

const coreTabStyle = {paddingLeft: '4px', cursor: 'pointer', color: 'rgba(60, 58, 68, 1)', fontFamily: 'EB Garamond, serif', fontSize: '16px', fontWeight: '400', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', height: '21px', marginTop: '24px'}
const unfocusedTabStyle = {...coreTabStyle, borderLeft: '4px solid transparent'}
const focusedTabStyle = {...coreTabStyle, borderLeft: '4px solid rgba(60, 58, 68, 1)'}

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
    document.removeEventListener('scroll', this.handleScrollBound)
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
      <div className={'mediaTabComponent'} style={{width: '100%', height: 'calc(100vh - 270px)', boxSizing: 'border-box'}}>

        {mediaConsole.isOpen &&
          <MediaConsole />
        }

        {/* ENTIRE LEFT TABS COLUMN */}
        <div style={{display: 'inline-block', width: '265px', height: 'calc(100vh - 110px)', verticalAlign: 'top', paddingTop: '24px', paddingBottom: '24px', paddingLeft: '2px', border: '1px solid red'}}>
          {/* HIGHLIGHTED LINE DIV */}
          <div style={{borderRight: '1px solid rgba(60, 58, 68, 0.1)', width: '100%', height: '100%'}}>

            <div style={{display: 'flex', alignItems: 'center', height: '24px'}}>
              <h4 style={{paddingLeft: '8px', fontSize: '24px', fontFamily: 'EB Garamond, serif', fontWeight: '400'}} onClick={() => this.openMediaConsole()}>Album list</h4>
              <i className='material-icons' style={{color: 'rgba(60, 58, 68, 0.3)', marginLeft: '10px'}}>settings</i>
            </div>

            {mediaConsole.albums.map((album, i) => {
              let isFocusedAlbum = mediaConsole.focusedAlbum.id === album.id
              console.log('albumid', album.id, 'isFocus', isFocusedAlbum)
              return (
                <h4 style={isFocusedAlbum ? focusedTabStyle : unfocusedTabStyle} key={i} onClick={() => this.switchFocusedAlbum(album.id)}>{album.title}</h4>
              )
            })}
          </div>
        </div>

        <div className={'mediaTabContent'} style={{display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'flex-start', verticalAlign: 'top', width: 'calc(100% - 265px)', height: '100%', boxSizing: 'border-box', paddingLeft: '12px'}}>
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
