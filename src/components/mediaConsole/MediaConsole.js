import React, { Component } from 'react'
import Radium, { Style } from 'radium'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { closeMediaConsole, initializeMediaConsoleAlbums, setFocusedAlbum } from '../../actions/mediaConsoleActions'

import { getUserAlbums, updateAlbum, createAlbum } from '../../apollo/album'
import { createMedia } from '../../apollo/media'

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
    if (field === 'title') {
      if (e.target.value.length <= 28) {
        this.setState({title: e.target.value})
      }
    }
    if (field === 'description') {
      this.setState({description: e.target.value})
    }
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

  uploadPhotos (e) {
    // console.log('token', this.props.googleCloudToken)
    let googleCloudToken = this.props.googleCloudToken.token

    let files = e.target.files
    console.log('files', files)

    // FileList is not an Array. Make it an array in es6.
    let filesArr = Array.from(files)
    console.log('filesArr', filesArr)

    let fileUploadPromiseArr = []
    filesArr.forEach(file => {
      // check if file is img
      if ((file.type).indexOf('image') > -1) {
        console.log('type', file.type)

        let UserId = this.props.userProfile.id
        let timestamp = Date.now()
        let uriBase = process.env.REACT_APP_CLOUD_UPLOAD_URI
        let objectName = `${UserId}/media/${timestamp}`
        let uploadEndpoint = `${uriBase}${objectName}`
        let uploadPromise = fetch(uploadEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${googleCloudToken}`,
            'Content-Type': file.type,
            'Content-Length': file.size
          },
          body: file
        })
          .then(response => {
            return response.json()
          })
          .then(json => {
            console.log('json', json)
            let publicUrl = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}${json.name}`
            console.log('public url', publicUrl)
            return {type: 'Photo', objectName: json.name, imageUrl: publicUrl}
          })
          .catch(err => {
            console.log('err', err)
          })
        fileUploadPromiseArr.push(uploadPromise)
      }
    })
    Promise.all(fileUploadPromiseArr)
      .then(values => {
        let mediaInputArr = values
        console.log('mediaInputArr', mediaInputArr)

        // dispatch apollo req to createMedia
        this.props.createMedia({
          variables: {
            AlbumId: this.state.id,
            media: mediaInputArr
          },
          refetchQueries: [{
            query: getUserAlbums
          }]
        })
          .then(returning => {
            console.log('returning', returning)
            // state not updating to uploaded media
          })
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

        <div style={mediaConsoleContainerStyle}>

          {/* MEDIA CONSOLE LEFT COL */}
          <div style={{width: '274px', height: '100%', background: 'rgba(67, 132, 150, 1)', paddingTop: '24px', paddingBottom: '24px', color: 'white'}}>

            {/* TOP SECTION */}
            <div style={{width: '274px', height: '324px', padding: 0, margin: 0}}>
              {/* ALBUM LIST AND + ICON */}
              <div style={{display: 'flex', height: '29px', width: '100%', paddingLeft: '16px', marginBottom: '8px'}}>
                <span style={{fontFamily: 'Roboto, sans-serif', fontSize: '24px', lineHeight: '29px', fontWeight: '300'}}>Album List</span>
                <i className='material-icons' style={{marginLeft: '10px', cursor: 'pointer', lineHeight: '29px'}} onClick={() => this.createNewAlbum()}>add</i>
              </div>

              {/* DIV TO CONTAIN ALBUM NAMES WITH BORDER LEFT */}
              <div style={{width: 'calc(100% - 8px)', height: '287px', paddingRight: '16px', marginLeft: '8px', boxSizing: 'border-box', overflow: 'scroll', display: 'flex', flexDirection: 'column'}}>
                {this.props.mediaConsole.albums.map((album, i) => {
                  let isFocusedAlbum = album.id === this.props.mediaConsole.focusedAlbum.id
                  return (
                    <div key={i} style={isFocusedAlbum ? focusedAlbumStyle : unfocusedAlbumStyle}>
                      <span key={i} style={albumNameStyle} onClick={() => this.setFocusedAlbum(album.id)}>{album.title}</span>
                      <hr style={{flexGrow: '1', color: 'rgb(255, 255, 255, 0.3)', margin: '0 5px 0 5px'}} />
                      <span style={albumNameStyle}>13</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <hr style={{margin: '0px 16px 0px 16px', color: 'rgba(255, 255, 255, 0.3)'}} />

            {/* ALBUM INFO */}
            {this.props.mediaConsole.focusedAlbum.id &&
              <div style={{width: '100%', height: '372px', padding: '24px 16px 0 16px'}}>
                <label style={{width: '100%', margin: 0, padding: 0}}>
                  <h5 style={editAlbumHeaderStyle}>Album Title</h5>
                  <input type='text' value={this.state.title} placeholder={'Untitled Album'} style={editAlbumInputFieldStyle} onChange={e => this.handleChange(e, 'title')} />
                </label>
                <label style={{width: '100%', margin: 0, padding: 0}}>
                  <h5 style={editAlbumHeaderStyle}>Location / Tags</h5>
                  <input type='text' style={editAlbumInputFieldStyle} />
                </label>
                <label style={{width: '100%', margin: 0, padding: 0}}>
                  <h5 style={editAlbumHeaderStyle}>Album Description</h5>
                  <textarea value={this.state.description} placeholder={'No description available'} style={editAlbumDescriptionStyle} onChange={e => this.handleChange(e, 'description')} />
                </label>
                <span key={'albumButton1'} style={editAlbumButtonStyle} onClick={() => this.editAlbum()}>Save changes</span>
                <span key={'albumButton2'} style={editAlbumButtonStyle} onClick={() => this.cancelEditAlbum()}>Cancel</span>

              </div>
            }

          </div>

          {/* MEDIA CONSOLE RIGHT SIDE */}
          {this.props.mediaConsole.focusedAlbum.id &&
            <div style={{width: '864px', height: '100%'}}>

              {/* TOP SECTION -> THUMBNAILS */}
              <div style={{display: 'inline-flex', flexFlow: 'row wrap', alignContent: 'flex-start', width: '100%', height: '696px', boxSizing: 'border-box', paddingLeft: '12px', paddingTop: '12px', overflowY: 'scroll'}}>
                <div style={mediaConsoleAddMediumContainerStyle}>
                  <label key={'mediaConsoleAddPhotoButton'} style={mediaConsoleAddMediumButtonStyle}>
                    <h5 style={{height: '10px', width: '100%', visibility: 'hidden'}}>flex spacing</h5>
                    <i className='material-icons' style={{color: 'gray', fontSize: '32px'}}>collections</i>
                    <h5 style={mediaConsoleAddMediumTextStyle}>Add a photo</h5>
                    <input type='file' multiple accept='.jpeg, .jpg, .png' style={{display: 'none'}} onChange={e => this.uploadPhotos(e)} />
                  </label>
                  <div key={'mediaConsoleAddYoutubeButton'} style={mediaConsoleAddMediumButtonStyle}>
                    <h5 style={{height: '10px', width: '100%', visibility: 'hidden'}}>flex spacing</h5>
                    <i className='material-icons' style={{color: 'gray', fontSize: '32px'}}>videocam</i>
                    <h5 style={mediaConsoleAddMediumTextStyle}>Embed Youtube video</h5>
                  </div>
                </div>
                {this.props.mediaConsole.focusedAlbum.media.map((medium, i) => {
                  // 256 X 144. 24px spacing
                  return (
                    <div key={i} style={{position: 'relative', maxWidth: '256px', maxHeight: '144px', margin: '12px'}}>
                      {medium.type === 'Photo' &&
                        <img src={medium.imageUrl} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                      }
                      {medium.type === 'Youtube' &&
                        <iframe key={i} src={medium.youtubeUrl} width='256px' height='144px' style={{margin: '0px 24px 24px 0px'}} frameBorder={0} allowFullScreen />
                      }
                      <div style={mediaConsoleThumbnailCheckboxContainerStyle}>
                        {/* IF NOT SELECTED. SHOW TICK ON HOVER */}
                        <div key={`mediaThumbnailUnchecked${i}`} style={{width: '100%', height: '100%', borderRadius: '50%', background: 'rgb(67, 132, 150)', opacity: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', ':hover': {opacity: '1'}}}>
                          <i className='material-icons' style={{color: 'white'}}>done</i>
                        </div>
                        {/* IF SELECTED. SHOW NUMBER */}
                        {/* <div key={`mediaThumbnailChecked${i}`} style={{width: '100%', height: '100%', borderRadius: '50%', background: 'rgb(67, 132, 150)', opacity: '1', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <span style={{fontFamily: 'Roboto, sans-serif', fontSize: '13px', lineHeight: '15px', fontWeight: '300', color: 'white'}}>130</span>
                        </div> */}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* BOTTOM BAR -> ACTION BUTTONS */}
              <div style={{width: '100%', height: '47px', padding: '0 24px 0 24px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%', padding: '0 8px 0 8px', borderTop: '2px solid rgba(60, 58, 68, 0.3)'}}>
                  {/* DISPLAY THESE ONLY IF STUFF IS TICKED */}
                  <div>
                    <button key={'mediaButton1'} style={mediaButtonLeftStyle}>Delete</button>
                    <button key={'mediaButton2'} style={mediaButtonLeftStyle}>Download</button>
                    <button key={'mediaButton3'} style={mediaButtonLeftStyle}>Shift album</button>
                    <button key={'mediaButton4'} style={mediaButtonLeftStyle}>Delete album</button>
                  </div>
                  <div>
                    <button key={'mediaButton5'} style={mediaButtonRightStyle}>Uncheck all</button>
                    <button key={'mediaButton6'} style={mediaButtonRightStyle}>Check all</button>
                    {/* <button key={'mediaButton7'} style={mediaButtonRightStyle}>Post</button> */}
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

const mediaConsoleAddMediumContainerStyle = {position: 'relative', width: '256px', height: '144px', margin: '12px', display: 'flex', justifyContent: 'space-between'}
const mediaConsoleAddMediumButtonStyle = {width: '45%', height: '100%', border: '2px solid rgba(60, 58, 68, 0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', ':hover': {border: '2px solid rgba(60, 58, 68, 0.5)'}}
const mediaConsoleAddMediumTextStyle = {height: '30px', lineHeight: '15px', fontSize: '13px', width: '100%', fontFamily: 'Roboto, sans-serif', fontWeight: '400', color: 'rgba(60, 58, 68, 0.7)'}

const mediaButtonLeftStyle = {border: 'none', fontFamily: 'Roboto, sans-serif', fontWeight: '300', fontSize: '13px', color: 'rgba(60, 58, 68, 0.7)', padding: 0, ':hover': {color: 'rgba(60, 58, 68, 1)'}, marginRight: '24px'}
const mediaButtonRightStyle = {...mediaButtonLeftStyle, marginRight: '0', marginLeft: '24px'}

const unfocusedAlbumStyle = {display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '4px', cursor: 'pointer', marginTop: '8px', marginBottom: '8px', height: '15px', borderLeft: '4px solid transparent'}
const focusedAlbumStyle = {...unfocusedAlbumStyle, borderLeft: '4px solid white'}
const albumNameStyle = {fontFamily: 'Roboto, sans-serif', fontSize: '13px', fontWeight: '300', lineHeight: '15px', width: 'auto', padding: '0', margin: '0', verticalAlign: 'top'}

const editAlbumHeaderStyle = {margin: 0, padding: 0, fontFamily: 'Roboto, sans-serif', fontSize: '13px', lineHeight: '15px', fontWeight: '400', color: 'white'}
const editAlbumInputFieldStyle = {margin: '16px 0 16px 0', padding: '8px', fontFamily: 'Roboto, sans-serif', fontSize: '13px', lineHeight: '15px', fontWeight: '300', color: 'rgba(60, 58, 68, 0.7)', width: '100%', height: '31px'}
const editAlbumDescriptionStyle = {margin: '16px 0 16px 0', padding: '8px', fontFamily: 'Roboto, sans-serif', fontSize: '13px', fontWeight: '300', color: 'rgba(60, 58, 68, 0.7)', width: '100%', height: '121px', lineHeight: '18px', resize: 'none'}
const editAlbumButtonStyle = {fontFamily: 'Roboto, sans-serif', fontSize: '13px', lineHeight: '15px', fontWeight: '300', color: 'rgba(255,255,255,0.3)', background: 'none', float: 'right', marginLeft: '8px', cursor: 'pointer', ':hover': {color: 'rgba(255,255,255,1)'}}

const mediaConsoleContainerStyle = {position: 'fixed', left: 'calc((100vw - 1138px)/2)', top: '10vh', width: '1138px', height: '744px', background: 'white', boxSizing: 'border-box', boxShadow: '2px 2px 10px 2px rgba(0, 0, 0, .2)', display: 'inline-flex'}

const mediaConsoleThumbnailCheckboxContainerStyle = {position: 'absolute', right: '8px', top: '8px', width: '35px', height: '35px', background: 'rgba(60, 58, 68, 0.7)', border: '2px solid white', boxSizing: 'border-box', borderRadius: '50%', cursor: 'pointer'}

const mapStateToProps = (state) => {
  return {
    mediaConsole: state.mediaConsole,
    userProfile: state.userProfile,
    googleCloudToken: state.googleCloudToken
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
  graphql(createAlbum, {name: 'createAlbum'}),
  graphql(createMedia, {name: 'createMedia'})
)(Radium(MediaConsole)))
