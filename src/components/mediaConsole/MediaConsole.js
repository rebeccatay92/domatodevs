import React, { Component } from 'react'
import Radium, { Style } from 'radium'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { closeMediaConsole, initializeMediaConsoleAlbums, setFocusedAlbumId, clickCheckbox, clearSelectedMedia, uncheckAllInAlbum, checkAllInAlbum, setSelectedMedia } from '../../actions/mediaConsoleActions'
import { updateActivePage } from '../../actions/blogEditorActivePageActions'
import { openConfirmWindow } from '../../actions/confirmWindowActions'

import { getUserAlbums, updateAlbum, createAlbum, deleteAlbum } from '../../apollo/album'
import { createMedia, deleteMedia } from '../../apollo/media'
import _ from 'lodash'

class MediaConsole extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: '',
      title: '',
      description: '',
      pendingRefetchFocusedAlbumId: null,
      isAddYoutubeComponentOpen: false,
      youtubeUrl: ''
    }
  }

  setFocusedAlbum (id) {
    this.props.setFocusedAlbumId(id)

    // also close add youtube component
    this.setState({isAddYoutubeComponentOpen: false})
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
    if (field === 'youtubeUrl') {
      this.setState({youtubeUrl: e.target.value})
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
    // console.log('files', files)

    // FileList is not an Array. Make it an array in es6.
    let filesArr = Array.from(files)
    console.log('filesArr', filesArr)

    let fileUploadPromiseArr = []
    filesArr.forEach(file => {
      // check if file is img
      if ((file.type).indexOf('image') > -1) {
        // console.log('type', file.type)

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
            // console.log('json', json)
            let publicUrl = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}${json.name}`
            // console.log('public url', publicUrl)
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
          })
      })
  }

  displayAddYoutubeComponent () {
    this.setState({
      isAddYoutubeComponentOpen: true
    })
  }

  onYoutubeInputKeyDown (e) {
    if (e.key === 'Escape') {
      this.setState({isAddYoutubeComponentOpen: false})
    }
    if (e.key === 'Enter') {
      this.addYoutubeVideo()
    }
  }

  // onMediaConsoleKeyDown (e) {
  //   if (e.key === 'Escape') {
  //     console.log('esc in media console')
  //     if (this.state.isAddYoutubeComponentOpen) {
  //       this.setState({isAddYoutubeComponentOpen: false})
  //     }
  //   }
  // }

  addYoutubeVideo () {
    /* possible video links
    share link
    https://youtu.be/yyIZOLKui8o
    playlist link to 1 video
    https://www.youtube.com/watch?v=yyIZOLKui8o&index=13&list=RD6xkX7wAclaQ
    direct url for 1 video
    https://www.youtube.com/watch?v=DY8oOxqPu9g
    embed iframe (not done yet)
    <iframe width="560" height="315" src="https://www.youtube.com/embed/DY8oOxqPu9g" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    */
    let url = this.state.youtubeUrl
    if (url !== undefined || url !== '') {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/
      var match = url.match(regExp)
      if (match && match[2].length === 11) {
        // if valid send to backend
        // console.log('match videoid', match[2])
        let youtubeUrl = `https://www.youtube.com/embed/${match[2]}`
        let imageUrl = `http://img.youtube.com/vi/${match[2]}/0.jpg`
        console.log('urls to send backend', youtubeUrl, imageUrl)
        this.props.createMedia({
          variables: {
            AlbumId: this.state.id,
            media: [{type: 'Youtube', youtubeUrl: youtubeUrl, imageUrl: imageUrl}]
          },
          refetchQueries: [{
            query: getUserAlbums
          }]
        })
          .then(returning => {
            console.log('returning', returning)
            this.setState({isAddYoutubeComponentOpen: false})
          })
      } else {
        console.log('not valid')
      }
    }
  }

  onCheckboxClick (id) {
    console.log('medium id clicked', id)
    this.props.clickCheckbox(id)
  }

  uncheckAll () {
    let AlbumId = this.state.id
    this.props.uncheckAllInAlbum(AlbumId)
  }

  checkAll () {
    let AlbumId = this.state.id
    this.props.checkAllInAlbum(AlbumId)
  }

  confirmDeleteMedia () {
    console.log('open confirm window')
    let selectedMediaLength = this.props.mediaConsole.selectedMedia.length
    if (selectedMediaLength <= 0) return
    this.props.openConfirmWindow({
      message: 'Are you sure you want to delete all selected media? Deleted media will no longer be viewable in any posts you may have',
      secondaryMessage: `You have ${selectedMediaLength} media selected`,
      confirmMessage: 'Proceed'
    })
  }

  deleteSelectedMedia () {
    // console.log('delete all selected', this.props.mediaConsole.selectedMedia)
    // clear selectedMedia arr in redux
    this.props.clearSelectedMedia()
    let selectedMedia = this.props.mediaConsole.selectedMedia
    // leave all the logic to the backend. pass an arr of ID.
    // backend will loop thru n remove photos from cloud storage, then delete all join table rows
    let inputArr = selectedMedia.map(e => {
      return e.id
    })
    this.props.deleteMedia({
      variables: {
        input: inputArr
      },
      refetchQueries: [{
        query: getUserAlbums
      }]
    })
  }

  deleteAlbum () {
    let AlbumId = this.state.id
    let albumsArr = this.props.mediaConsole.albums
    // after deleting focusedAlbum, need to set new focusedAlbum. check if focusedAlbumId is first in albumsArr. if yes, set it the second. else set to the first. There might be no albums left after delete

    let firstAlbumId = albumsArr[0].id

    if (AlbumId === firstAlbumId) {
      if (albumsArr.length > 1) {
        this.props.setFocusedAlbumId(albumsArr[1].id)
      } else {
        this.props.setFocusedAlbumId('')
      }
    } else {
      this.props.setFocusedAlbumId(albumsArr[0].id)
    }

    // remove all album media from selectedMedia
    this.props.uncheckAllInAlbum(AlbumId)
    // let backend handle the logic for cloud.
    this.props.deleteAlbum({
      variables: {id: AlbumId},
      refetchQueries: [{
        query: getUserAlbums
      }]
    })
      .then(returning => {
        console.log('returning', returning)
      })
  }

  updateActivePageMedia () {
    // compare old media and current selectedMedia
    let previousMediaArr = this.props.page.media
    let selectedMedia = this.props.mediaConsole.selectedMedia // does not hv load seq, caption

    let oldMedia = _.intersectionBy(previousMediaArr, selectedMedia, 'id')
    let newlySelectedMedia = _.differenceBy(selectedMedia, previousMediaArr, 'id')


    let mediaToAdd = newlySelectedMedia.map(e => {
      return {...e, loadSequence: null, caption: ''}
    })
    let concatArr = oldMedia.concat(mediaToAdd)

    // assign new load seq
    let finalMediaArr = concatArr.map((medium, i) => {
      return {...medium, loadSequence: i + 1}
    })
    console.log('finalarr', finalMediaArr)


    this.props.updateActivePage('media', finalMediaArr)
    this.props.closeMediaConsole()
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (prevState.pendingRefetchFocusedAlbumId) {
      let isNewAlbumPresent = _.find(this.props.mediaConsole.albums, e => {
        return (e.id === prevState.pendingRefetchFocusedAlbumId)
      })

      if (isNewAlbumPresent) {
        // console.log('albums arr', this.props.mediaConsole.albums)
        // console.log('AlbumId to focus', prevState.pendingRefetchFocusedAlbumId)
        this.props.setFocusedAlbumId(prevState.pendingRefetchFocusedAlbumId)
        this.setState({pendingRefetchFocusedAlbumId: null})
      }
    }
  }

  componentDidMount () {
    let openedFrom = this.props.mediaConsole.openedFrom

    // console.log('mount props', this.props.mediaConsole)
    // check openedFrom. if dashboard, focusedAlbumId was whatever is focused in MediaTab (take from redux state). If editor, setFocusedAlbumId to be first album if there are albums

    let albumsArr = this.props.data.getUserAlbums
    if (openedFrom === 'dashboard') {
      console.log('didmount, from dashboard')
      if (albumsArr.length) {
        this.props.initializeMediaConsoleAlbums(albumsArr)
      }

      let focusedAlbumId = this.props.mediaConsole.focusedAlbumId
      let focusedAlbum = this.props.mediaConsole.albums.find(e => {
        return e.id === focusedAlbumId
      })
      // console.log('focusedAlbum', focusedAlbum)
      if (focusedAlbum) {
        this.setState({
          id: focusedAlbum.id,
          title: focusedAlbum.title,
          description: focusedAlbum.description || ''
        })
      }
    } else if (openedFrom === 'editor') {
      console.log('didmount, from editor')
      if (albumsArr && albumsArr.length) {
        this.props.setFocusedAlbumId(albumsArr[0].id)
      }
      console.log('preexisting media in active page', this.props.page.media) // has load sequence and caption (mediaObj for blog/post), not just the Medium table row
      // scrub arr of MediaObject to form arr of selectedMedia (remove load seq, caption)
      let preselectedMedia = this.props.page.media.map(e => {
        return _.omit(e, ['loadSequence', 'caption'])
      })
      console.log('preselectedMedia', preselectedMedia)
      // let media console hv preselected media
      this.props.setSelectedMedia(preselectedMedia)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.mediaConsole.focusedAlbumId !== this.props.mediaConsole.focusedAlbumId) {
      // console.log('albums', nextProps.mediaConsole.albums)
      let focusedAlbum = nextProps.mediaConsole.albums.find(e => {
        return e.id === nextProps.mediaConsole.focusedAlbumId
      })
      // console.log('receiveprops next focusedAlbum', focusedAlbum)
      if (focusedAlbum) {
        this.setState({
          id: focusedAlbum.id,
          title: focusedAlbum.title,
          description: focusedAlbum.description || ''
        })
      }
    }

    // check if albums arr has changed
    if (this.props.data.getUserAlbums !== nextProps.data.getUserAlbums) {
      console.log('willreceiveprops, albums changed')
      this.props.initializeMediaConsoleAlbums(nextProps.data.getUserAlbums)

      // only set focusedAlbum if receiving albums arr from backend for first time, and if albumsArr has a length.
      if (!this.props.data.getUserAlbums && nextProps.data.getUserAlbums) {
        if (nextProps.data.getUserAlbums.length) {
          this.props.setFocusedAlbumId(nextProps.data.getUserAlbums[0].id)
        }
      }
    }
  }

  componentWillUnmount () {
    this.props.clearSelectedMedia()
  }

  render () {
    // console.log('focusedAlbumId in redux state', this.props.mediaConsole.focusedAlbumId)
    // console.log('selectedMedia', this.props.mediaConsole.selectedMedia)
    let focusedAlbum = this.props.mediaConsole.albums.find(e => {
      return e.id === this.props.mediaConsole.focusedAlbumId
    })
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
              <div style={{width: 'calc(100% - 8px)', height: '287px', paddingRight: '16px', marginLeft: '8px', boxSizing: 'border-box', overflow: 'scroll', display: 'flex', flexFlow: 'column nowrap', justifyContent: 'flex-start'}}>
                {this.props.mediaConsole.albums.map((album, i) => {
                  if (focusedAlbum) {
                    var isFocusedAlbum = album.id === focusedAlbum.id
                  } else {
                    isFocusedAlbum = false
                  }
                  // count num of selected media in each album
                  let selectedArrBelongingToAlbum = _.filter(this.props.mediaConsole.selectedMedia, e => {
                    return e.AlbumId === album.id
                  })
                  let selectedMediaCount = selectedArrBelongingToAlbum.length
                  return (
                    <div key={i} style={isFocusedAlbum ? focusedAlbumStyle : unfocusedAlbumStyle} onClick={() => this.setFocusedAlbum(album.id)}>
                      <span key={i} style={albumNameStyle}>{album.title}</span>
                      {selectedMediaCount > 0 &&
                        <React.Fragment>
                          <hr style={{flexGrow: '1', color: 'rgb(255, 255, 255, 0.3)', margin: '0 5px 0 5px'}} />
                          <span style={albumNameStyle}>{selectedMediaCount}</span>
                        </React.Fragment>
                      }
                    </div>
                  )
                })}
              </div>
            </div>

            <hr style={{margin: '0px 16px 0px 16px', color: 'rgba(255, 255, 255, 0.3)'}} />

            {/* ALBUM INFO */}
            {focusedAlbum &&
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
          {this.props.mediaConsole.focusedAlbumId &&
            <div style={{width: '864px', height: '100%'}}>

              {/* TOP SECTION -> THUMBNAILS */}
              <div style={mediaConsoleThumbnailContainerStyle}>
                {!this.state.isAddYoutubeComponentOpen &&
                  <div style={mediaConsoleAddMediumContainerStyle}>
                    <label key={'mediaConsoleAddPhotoButton'} style={mediaConsoleAddMediumButtonStyle}>
                      <h5 style={{height: '10px', width: '100%', visibility: 'hidden'}}>flex spacing</h5>
                      <i className='material-icons' style={{color: 'gray', fontSize: '32px'}}>collections</i>
                      <h5 style={mediaConsoleAddMediumTextStyle}>Add a photo</h5>
                      <input type='file' multiple accept='.jpeg, .jpg, .png' style={{display: 'none'}} onChange={e => this.uploadPhotos(e)} />
                    </label>
                    <div key={'mediaConsoleAddYoutubeButton'} style={mediaConsoleAddMediumButtonStyle} onClick={() => this.displayAddYoutubeComponent()}>
                      <h5 style={{height: '10px', width: '100%', visibility: 'hidden'}}>flex spacing</h5>
                      <i className='material-icons' style={{color: 'gray', fontSize: '32px'}}>videocam</i>
                      <h5 style={mediaConsoleAddMediumTextStyle}>Embed Youtube video</h5>
                    </div>
                  </div>
                }
                {this.state.isAddYoutubeComponentOpen &&
                  <div style={{position: 'relative', width: '256px', height: '144px', margin: '12px', border: '2px solid rgba(60, 58, 68, 0.5)'}}>
                    <label>
                      Paste youtube link here
                      <input type='text' style={{width: '90%', margin: '0 auto'}} autoFocus onChange={e => this.handleChange(e, 'youtubeUrl')} onKeyDown={e => this.onYoutubeInputKeyDown(e)} />
                      <button onClick={() => this.setState({isAddYoutubeComponentOpen: false})}>Cancel</button>
                      <button onClick={() => this.addYoutubeVideo()}>Add</button>
                    </label>
                  </div>
                }
                {focusedAlbum && focusedAlbum.media.map((medium, i) => {
                  // 256 X 144. 24px spacing
                  // find medium obj in selectedMedia arr
                  let isSelectedMedia = _.find(this.props.mediaConsole.selectedMedia, e => {
                    return e.id === medium.id
                  })
                  return (
                    <div key={i} style={{position: 'relative', width: '256px', height: '144px', margin: '12px'}}>
                      {medium.type === 'Photo' &&
                        <img src={medium.imageUrl} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                      }
                      {medium.type === 'Youtube' &&
                        <iframe key={i} src={`${medium.youtubeUrl}?modestbranding=1&rel=0`} width='256px' height='144px' style={{margin: '0px 24px 24px 0px'}} frameBorder={0} allowFullScreen />
                      }
                      <div style={mediaConsoleThumbnailCheckboxContainerStyle} onClick={() => this.onCheckboxClick(medium)}>
                        <div key={`mediaThumbnailUnchecked${i}`} style={isSelectedMedia ? mediaConsoleThumbnailCheckedStyle : mediaConsoleThumbnailUncheckedStyle}>
                          <i className='material-icons' style={{color: 'white'}}>done</i>
                        </div>
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
                    <button key={'mediaButton1'} style={mediaButtonLeftStyle} onClick={() => this.confirmDeleteMedia()}>Delete</button>
                    <button key={'mediaButton2'} style={mediaButtonLeftStyle}>Download</button>
                    <button key={'mediaButton3'} style={mediaButtonLeftStyle}>Shift album</button>
                    <button key={'mediaButton4'} style={mediaButtonLeftStyle} onClick={() => this.deleteAlbum()}>Delete album</button>
                  </div>
                  <div>
                    <button key={'mediaButton5'} style={mediaButtonRightStyle} onClick={() => this.uncheckAll()}>Uncheck all</button>
                    <button key={'mediaButton6'} style={mediaButtonRightStyle} onClick={() => this.checkAll()}>Check all</button>
                    {this.props.mediaConsole.openedFrom === 'editor' &&
                    <button key={'mediaButton7'} style={mediaButtonRightStyle} onClick={() => this.updateActivePageMedia()}>Post</button>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
          {!this.props.mediaConsole.focusedAlbumId &&
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

const mediaButtonLeftStyle = {border: 'none', fontFamily: 'Roboto, sans-serif', fontWeight: '300', fontSize: '13px', color: 'rgba(60, 58, 68, 0.7)', padding: 0, outline: 'none', ':hover': {color: 'rgba(60, 58, 68, 1)'}, marginRight: '24px'}
const mediaButtonRightStyle = {...mediaButtonLeftStyle, marginRight: '0', marginLeft: '24px'}

const unfocusedAlbumStyle = {display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '4px', cursor: 'pointer', marginTop: '8px', marginBottom: '8px', borderLeft: '4px solid transparent', minHeight: '15px'}
const focusedAlbumStyle = {...unfocusedAlbumStyle, borderLeft: '4px solid white'}
const albumNameStyle = {fontFamily: 'Roboto, sans-serif', fontSize: '13px', fontWeight: '300', lineHeight: '15px', width: 'auto', padding: '0', margin: '0'}

const editAlbumHeaderStyle = {margin: 0, padding: 0, fontFamily: 'Roboto, sans-serif', fontSize: '13px', lineHeight: '15px', fontWeight: '400', color: 'white'}
const editAlbumInputFieldStyle = {margin: '16px 0 16px 0', padding: '8px', fontFamily: 'Roboto, sans-serif', fontSize: '13px', lineHeight: '15px', fontWeight: '300', color: 'rgba(60, 58, 68, 0.7)', width: '100%', height: '31px'}
const editAlbumDescriptionStyle = {margin: '16px 0 16px 0', padding: '8px', fontFamily: 'Roboto, sans-serif', fontSize: '13px', fontWeight: '300', color: 'rgba(60, 58, 68, 0.7)', width: '100%', height: '121px', lineHeight: '18px', resize: 'none'}
const editAlbumButtonStyle = {fontFamily: 'Roboto, sans-serif', fontSize: '13px', lineHeight: '15px', fontWeight: '300', color: 'rgba(255,255,255,0.3)', background: 'none', float: 'right', marginLeft: '8px', cursor: 'pointer', ':hover': {color: 'rgba(255,255,255,1)'}}

const mediaConsoleContainerStyle = {position: 'fixed', left: 'calc((100vw - 1138px)/2)', top: '10vh', width: '1138px', height: '744px', background: 'white', boxSizing: 'border-box', boxShadow: '2px 2px 10px 2px rgba(0, 0, 0, .2)', display: 'inline-flex'}
const mediaConsoleThumbnailContainerStyle = {display: 'inline-flex', flexFlow: 'row wrap', alignContent: 'flex-start', width: '100%', height: '696px', boxSizing: 'border-box', paddingLeft: '12px', paddingTop: '12px', overflowY: 'scroll'}

const mediaConsoleThumbnailCheckboxContainerStyle = {position: 'absolute', right: '8px', top: '8px', width: '35px', height: '35px', background: 'rgba(60, 58, 68, 0.7)', border: '2px solid white', boxSizing: 'border-box', borderRadius: '50%', cursor: 'pointer'}

const mediaConsoleThumbnailCheckedStyle = {width: '100%', height: '100%', borderRadius: '50%', background: 'rgb(67, 132, 150)', opacity: '1', display: 'flex', alignItems: 'center', justifyContent: 'center'}
const mediaConsoleThumbnailUncheckedStyle = {...mediaConsoleThumbnailCheckedStyle, opacity: 0}

const mapStateToProps = (state) => {
  return {
    mediaConsole: state.mediaConsole,
    userProfile: state.userProfile,
    googleCloudToken: state.googleCloudToken,
    page: state.blogEditorActivePage,
    confirmWindow: state.confirmWindow
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
    setFocusedAlbumId: (id) => {
      dispatch(setFocusedAlbumId(id))
    },
    clickCheckbox: (id) => {
      dispatch(clickCheckbox(id))
    },
    clearSelectedMedia: () => {
      dispatch(clearSelectedMedia())
    },
    uncheckAllInAlbum: (AlbumId) => {
      dispatch(uncheckAllInAlbum(AlbumId))
    },
    checkAllInAlbum: (AlbumId) => {
      dispatch(checkAllInAlbum(AlbumId))
    },
    setSelectedMedia: (mediaArr) => {
      dispatch(setSelectedMedia(mediaArr))
    },
    updateActivePage: (property, value) => {
      dispatch(updateActivePage(property, value))
    },
    openConfirmWindow: (input) => {
      dispatch(openConfirmWindow(input))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(getUserAlbums),
  graphql(updateAlbum, {name: 'updateAlbum'}),
  graphql(createAlbum, {name: 'createAlbum'}),
  graphql(createMedia, {name: 'createMedia'}),
  graphql(deleteMedia, {name: 'deleteMedia'}),
  graphql(deleteAlbum, {name: 'deleteAlbum'})
)(Radium(MediaConsole)))
