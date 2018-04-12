import React, { Component } from 'react'
import Radium, { Style } from 'radium'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { closeMediaConsole, initializeMediaConsoleAlbums, setFocusedAlbum } from '../../actions/mediaConsoleActions'

import { getUserAlbums, updateAlbum, createAlbum } from '../../apollo/album'

const _ = require('lodash')

class MediaConsole extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: '',
      title: '',
      description: '',
      pendingRefetchFocusedAlbumId: null
    }
  }

  setFocusedAlbum (id) {
    this.props.setFocusedAlbum(id)
  }

  handleChange (e, field) {
    this.setState({
      [field]: e.target.value
    })
  }

  cancelEditAlbum () {
    // dont send backend request, reset this.state with redux state focusedAlbum
    this.setState({
      title: this.props.mediaConsole.focusedAlbum.title,
      description: this.props.mediaConsole.focusedAlbum.description
    })
  }

  editAlbum () {
    let updatesObj = {
      id: this.state.id,
      title: this.state.title,
      description: this.state.description
    }
    console.log('edit album info', updatesObj)

    this.props.updateAlbum({
      variables: updatesObj
    })
      .then(returning => {
        console.log('returning', returning)
        // check if focused album stays the same
      })
  }

  createNewAlbum () {
    this.props.createAlbum({
      variables: {
        UserId: this.props.userProfile.id
      },
      refetchQueries: [{
        query: getUserAlbums
      }]
    })
      .then(returning => {
        // console.log('returning', returning)
        let AlbumId = returning.data.createAlbum.id
        // console.log('album id', AlbumId)
        // refetch query hasnt returned yet. need to setFocusedAlbum on newly created album only after updated albums arr returns
        this.setState({pendingRefetchFocusedAlbumId: AlbumId})
      })
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (prevState.pendingRefetchFocusedAlbumId) {
      let isNewAlbumPresent = _.find(this.props.mediaConsole.albums, e => {
        return (e.id === prevState.pendingRefetchFocusedAlbumId)
      })

      if (isNewAlbumPresent) {
        // console.log('albums arr', this.props.mediaConsole.albums)
        // console.log('AlbumId to focus', prevState.pendingRefetchFocusedAlbumId)
        this.props.setFocusedAlbum(prevState.pendingRefetchFocusedAlbumId)
        this.setState({pendingRefetchFocusedAlbumId: null})
      }
    }
  }

  componentDidMount () {
    // console.log(this.props.data.getUserAlbums)
    let albumsArr = this.props.data.getUserAlbums
    // this.props.initializeMediaConsole(albumsArr)

    // mount focusedAlbum will be {} from redux default state
    // console.log('mount focusedAlbum', this.props.mediaConsole.focusedAlbum)
    let focusedAlbum = this.props.mediaConsole.focusedAlbum
    // console.log('focusedAlbum', focusedAlbum)
    this.setState({
      id: focusedAlbum.id,
      title: focusedAlbum.title,
      description: focusedAlbum.description || ''
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.mediaConsole.focusedAlbum !== this.props.mediaConsole.focusedAlbum) {
      let focusedAlbum = nextProps.mediaConsole.focusedAlbum
      // console.log('receiveprops next focusedAlbum', focusedAlbum)
      this.setState({
        id: focusedAlbum.id,
        title: focusedAlbum.title,
        description: focusedAlbum.description || ''
      })
    }
  }

  render () {
    // console.log('focusedAlbum in redux state', this.props.mediaConsole.focusedAlbum)

    return (
      <div style={{backgroundColor: 'rgba(180, 180, 180, 0.5)', position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, zIndex: 999, overflow: 'auto', maxHeight: '100vh', maxWidth: '100vw'}}>
        <Style rules={{html: {overflowY: 'hidden'}}} />

        <i className='material-icons' style={{position: 'fixed', top: '10vh', left: 'calc((100vw - 1134px)/2 - 50px)', fontSize: '36px', cursor: 'pointer'}} onClick={() => this.props.closeMediaConsole()}>close</i>

        <div style={{position: 'fixed', left: 'calc((100vw - 1134px)/2)', top: '10vh', width: '1138px', height: '744px', background: 'white', boxShadow: '2px 2px 10px 2px rgba(0, 0, 0, .2)'}}>

          {/* MEDIA CONSOLE LEFT COL */}
          <div style={{display: 'inline-block', width: '274px', height: '100%', background: 'rgb(25, 143, 143)', padding: '15px', color: 'white'}}>

            <h3 style={{margin: '0 0 10px 0', padding: '0 0 5px 0'}}>Album List</h3>
            <div style={{fontSize: '18px', border: '1px solid white', padding: '5px 0 5px 0', cursor: 'pointer', ':hover': {background: 'rgb(25, 155, 155)'}}} onClick={() => this.createNewAlbum()}>
              <i className='material-icons' style={{verticalAlign: 'top'}}>add</i>
              <span>New Album</span>
            </div>

            <div style={{height: '40%', boxSizing: 'border-box', overflowY: 'scroll'}}>
              {this.props.mediaConsole.albums.map((album, i) => {
                let isFocusedAlbum = album.id === this.props.mediaConsole.focusedAlbum.id
                return (
                  <h5 key={i} style={isFocusedAlbum ? focusedAlbumStyle : unfocusedAlbumStyle} onClick={() => this.setFocusedAlbum(album.id)}>{album.title}</h5>
                )
              })}
            </div>

            <hr style={{margin: '10px 0 10px 0'}} />

            {/* ALBUM INFO */}
            {this.props.mediaConsole.focusedAlbum.id &&
              <div style={{height: '45%', width: '100%'}}>
                <label style={{width: '100%'}}>
                  <h5>Album Title</h5>
                  <input type='text' value={this.state.title} placeholder={'Untitled Album'} style={{width: '100%', height: '25px', border: 'none', color: 'black'}} onChange={e => this.handleChange(e, 'title')} />
                </label>
                <label style={{width: '100%'}}>
                  <h5>Album Description</h5>
                  <textarea value={this.state.description} placeholder={'No description available'} style={{width: '100%', height: '100px', border: 'none', color: 'black', resize: 'none'}} onChange={e => this.handleChange(e, 'description')} />
                </label>
                <label style={{width: '100%'}}>
                  <h5>Location / Tags</h5>
                  <input type='text' style={{width: '100%', height: '25px', border: 'none', color: 'black'}} />
                </label>
                <button key={'albumButton1'} style={{marginTop: '10px', height: '30px', float: 'right', border: 'none', outline: 'none', background: 'transparent', color: 'white', ':hover': {color: 'red'}}} onClick={() => this.editAlbum()}>Save changes</button>
                <button key={'albumButton2'} style={{marginTop: '10px', height: '30px', float: 'right', border: 'none', outline: 'none', background: 'transparent', color: 'white', ':hover': {color: 'red'}}} onClick={() => this.cancelEditAlbum()}>Cancel</button>
              </div>
            }
          </div>

          {/* MEDIA CONSOLE RIGHT SIDE. 864 NOT 860. for even margin */}
          {this.props.mediaConsole.focusedAlbum.id &&
            <div style={{display: 'inline-block', width: '864px', height: '100%', verticalAlign: 'top'}}>

              {/* TOP SECTION -> THUMBNAILS */}
              <div style={{display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'flex-start', verticalAlign: 'top', width: '100%', height: '93%', boxSizing: 'border-box', paddingLeft: '12px', paddingTop: '12px', overflowY: 'scroll'}}>
                <div style={{position: 'relative', width: '256px', height: '144px', margin: '12px', display: 'flex', justifyContent: 'space-between'}}>
                  <div style={{width: '45%', height: '100%', border: '2px solid gray', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>
                    <h5 style={{height: '10px', width: '100%', visibility: 'hidden'}}>flex spacing</h5>
                    <i className='material-icons' style={{color: 'gray', fontSize: '32px'}}>collections</i>
                    <h5 style={{height: '30px', width: '100%'}}>Add a photo</h5>
                  </div>
                  <div style={{width: '45%', height: '100%', border: '2px solid gray', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>
                    <h5 style={{height: '10px', width: '100%', visibility: 'hidden'}}>flex spacing</h5>
                    <i className='material-icons' style={{color: 'gray', fontSize: '32px'}}>videocam</i>
                    <h5 style={{height: '30px', width: '100%'}}>Embed Youtube video</h5>
                  </div>
                </div>
                {this.props.mediaConsole.focusedAlbum.media.map((medium, i) => {
                  // 256 X 144. 24px spacing
                  if (medium.type === 'Photo') {
                    return (
                      <div key={i} style={{position: 'relative', width: '256px', height: '144px', margin: '12px'}}>
                        {/* NEED TO POSITION LANDSCAPE/PORTRAIT PROPERLY */}
                        <img src={medium.imageUrl} width='256px' height='144px' />
                        <div style={{position: 'absolute', right: '10px', top: '10px', width: '30px', height: '30px', background: 'rgba(0, 0, 0, 0.7)', border: '2px solid white', borderRadius: '50%', cursor: 'pointer'}} />
                      </div>
                    )
                  } else if (medium.type === 'Youtube') {
                    return (
                      <div key={i} style={{position: 'relative', width: '256px', height: '144px', margin: '12px'}}>
                        <iframe src={medium.youtubeUrl} width='256px' height='144px' frameBorder={0} allowFullScreen />
                        <div style={{position: 'absolute', right: '10px', top: '10px', width: '30px', height: '30px', background: 'rgba(0, 0, 0, 0.7)', border: '2px solid white', borderRadius: '50%', cursor: 'pointer'}} />
                      </div>
                    )
                  }
                })}
              </div>

              {/* BOTTOM BAR -> ACTION BUTTONS */}
              <div style={{width: '100%', height: '7%', padding: '0 24px 0 24px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%', borderTop: '2px solid grey'}}>
                  {/* DISPLAY THESE ONLY IF STUFF IS TICKED */}
                  <div>
                    <button key={'mediaButton1'} style={mediaButtonStyle}>Delete</button>
                    <button key={'mediaButton2'} style={mediaButtonStyle}>Download</button>
                    <button key={'mediaButton3'} style={mediaButtonStyle}>Move to</button>
                  </div>
                  <div>
                    <button key={'mediaButton4'} style={mediaButtonStyle}>Uncheck all</button>
                    <button key={'mediaButton5'} style={mediaButtonStyle}>Check all</button>
                    {/* <button key={'mediaButton6'} style={mediaButtonStyle}>Post</button> */}
                  </div>
                </div>
              </div>
            </div>
          }
          {!this.props.mediaConsole.focusedAlbum.id &&
            <div style={{display: 'inline-block', width: '864px', height: '100%', verticalAlign: 'top'}}>
              You don't have any albums.
            </div>
          }
        </div>
      </div>
    )
  }
}

const mediaButtonStyle = {border: 'none', padding: '0 10px', fontWeight: 'bold', ':hover': {color: 'red'}}

const unfocusedAlbumStyle = {borderLeft: '5px solid transparent', paddingLeft: '10px', cursor: 'pointer', margin: '10px 0', height: '20px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Roboto, sans-serif'}
const focusedAlbumStyle = {borderLeft: '5px solid white', paddingLeft: '10px', cursor: 'pointer', margin: '10px 0', height: '20px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Roboto, sans-serif'}

const mapStateToProps = (state) => {
  return {
    mediaConsole: state.mediaConsole,
    userProfile: state.userProfile
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeMediaConsole: () => {
      dispatch(closeMediaConsole())
    },
    initializeMediaConsoleAlbums: (albums) => {
      dispatch(initializeMediaConsoleAlbums(albums))
    },
    setFocusedAlbum: (id) => {
      dispatch(setFocusedAlbum(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(getUserAlbums),
  graphql(updateAlbum, {name: 'updateAlbum'}),
  graphql(createAlbum, {name: 'createAlbum'})
)(Radium(MediaConsole)))
