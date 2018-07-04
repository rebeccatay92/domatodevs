import React, { Component } from 'react'
import Radium, { Style } from 'radium'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import { closeMediaConsole, initializeMediaConsoleAlbums, setFocusedAlbumId, clickCheckbox, clearSelectedMedia, uncheckAllInAlbum, checkAllInAlbum, setSelectedMedia } from '../../actions/mediaConsoleActions'
import { updateActivePage } from '../../actions/blogEditorActivePageActions'
import { openConfirmWindow } from '../../actions/confirmWindowActions'

import { getUserAlbums, updateAlbum, createAlbum, deleteAlbum } from '../../apollo/album'
import { createMedia, deleteMedia, moveMediaToAlbum } from '../../apollo/media'
import _ from 'lodash'

import { MediaConsoleStyles as styles } from '../../Styles/MediaConsoleStyles'

class MediaConsole extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: '',
      title: '',
      description: '',
      pendingRefetchFocusedAlbumId: null,
      isAddYoutubeComponentOpen: false,
      isMoveToAlbumDropdownOpen: false,
      moveToAlbumId: '',
      youtubeUrl: '',
      confirmIsFor: ''
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

  onMediaConsoleKeyDown (e) {
    if (e.key === 'Escape') {
      console.log('esc in media console')
      if (this.state.isAddYoutubeComponentOpen) {
        this.setState({isAddYoutubeComponentOpen: false})
      }
    }
  }

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
    this.props.clickCheckbox(id)
  }

  uncheckAll () {
    let AlbumId = this.state.id
    // console.log('uncheckAll', AlbumId)
    this.props.uncheckAllInAlbum(AlbumId)
  }

  checkAll () {
    let AlbumId = this.state.id
    // console.log('checkAll', AlbumId)
    this.props.checkAllInAlbum(AlbumId)
  }

  confirmDeleteMedia () {
    // console.log('open confirm window')
    let selectedMediaLength = this.props.mediaConsole.selectedMedia.length
    if (selectedMediaLength <= 0) return
    this.setState({confirmIsFor: 'deleteMedia'})
    this.props.openConfirmWindow({
      message: 'Are you sure you want to delete all selected media? Deleted media will no longer be viewable in any posts you may have',
      secondaryMessage: `You have ${selectedMediaLength} media selected`,
      confirmMessage: 'Proceed'
    })
  }

  confirmDeleteAlbum () {
    this.setState({confirmIsFor: 'deleteAlbum'})
    let albumTitle = this.state.title
    this.props.openConfirmWindow({
      message: 'Are you sure you want to delete this album? All media within will no longer be viewable in any posts you may have',
      secondaryMessage: `You are about to delete the album named ${albumTitle}`,
      confirmMessage: 'Proceed'
    })
  }

  deleteSelectedMedia () {
    // console.log('delete all selected', this.props.mediaConsole.selectedMedia)
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
    // clear selectedMedia arr in redux
    this.props.clearSelectedMedia()
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
    // need to rename selectedMedia redux arr (id -> back to MediumId).
    let renamedSelectedMedia = selectedMedia.map(e => {
      let renamedObj = {...e, MediumId: e.id}
      return _.omit(renamedObj, 'id')
    })
    // console.log('renamedSelectedMedia', renamedSelectedMedia)

    let oldMedia = _.intersectionBy(previousMediaArr, renamedSelectedMedia, 'MediumId')
    // console.log('oldMedia', oldMedia)
    let newlySelectedMedia = _.differenceBy(renamedSelectedMedia, previousMediaArr, 'MediumId')
    // console.log('newlySelectedMedia', newlySelectedMedia)

    let mediaToAdd = newlySelectedMedia.map(e => {
      return {...e, loadSequence: null, caption: ''}
    })
    let concatArr = oldMedia.concat(mediaToAdd)

    // assign new load seq
    let finalMediaArr = concatArr.map((medium, i) => {
      return {...medium, loadSequence: i + 1}
    })
    // console.log('finalarr', finalMediaArr)


    this.props.updateActivePage('media', finalMediaArr)
    this.props.closeMediaConsole()
  }

  toggleMoveToAlbumDropdown () {
    this.setState({isMoveToAlbumDropdownOpen: !this.state.isMoveToAlbumDropdownOpen})
  }

  confirmMoveToAlbum (id) {
    this.setState({moveToAlbumId: id, confirmIsFor: 'moveToAlbum'}) // store album id while waiting for confirmation status
    let destinationAlbum = this.props.mediaConsole.albums.find(e => {
      return e.id === id
    })
    let albumTitle = destinationAlbum.title
    let selectedMediaLength = this.props.mediaConsole.selectedMedia.length

    this.props.openConfirmWindow({
      message: `Are you sure you want to move media to the album titled ${albumTitle}?`,
      secondaryMessage: `You have selected ${selectedMediaLength} media to be moved`,
      confirmMessage: 'Proceed'
    })
  }

  moveToAlbum () {
    let AlbumId = this.state.moveToAlbumId
    let mediaArr = this.props.mediaConsole.selectedMedia.map(e => {
      return e.id
    })
    this.props.moveMediaToAlbum({
      variables: {
        AlbumId: AlbumId,
        media: mediaArr
      },
      refetchQueries: [{
        query: getUserAlbums
      }]
    })
      .then(returning => {
        this.setState({moveToAlbumId: '', confirmIsFor: '', isMoveToAlbumDropdownOpen: false})
        this.props.clearSelectedMedia()
        this.props.setFocusedAlbumId(AlbumId)
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
        // console.log('set focused album id', albumsArr[0].id)
        this.props.setFocusedAlbumId(albumsArr[0].id)
        this.setState({
          id: albumsArr[0].id,
          title: albumsArr[0].title,
          description: albumsArr[0].description
        })
      }
      // console.log('active page', this.props.page)
      // console.log('preexisting media in active page', this.props.page.media) // has load sequence and caption (mediaObj for blog/post), not just the Medium table row
      // scrub arr of MediaObject to form arr of selectedMedia (remove load seq, caption. rename MediumId to id)
      let preselectedMedia = this.props.page.media.map(e => {
        let formedObj = {
          id: e.MediumId, // selectedMedia.id should be the MediumId, while post.id is the join table id.
          AlbumId: e.AlbumId,
          type: e.type,
          objectName: e.objectName,
          imageUrl: e.imageUrl,
          youtubeUrl: e.youtubeUrl
        }
        // return _.omit(e, ['loadSequence', 'caption'])
        return formedObj
      })
      console.log('scrubbed media arr for preselected', preselectedMedia)
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
      // console.log('willreceiveprops, albums changed')
      this.props.initializeMediaConsoleAlbums(nextProps.data.getUserAlbums)

      // only set focusedAlbum if receiving albums arr from backend for first time, and if albumsArr has a length.
      if (!this.props.data.getUserAlbums && nextProps.data.getUserAlbums) {
        if (nextProps.data.getUserAlbums.length) {
          this.props.setFocusedAlbumId(nextProps.data.getUserAlbums[0].id)
        }
      }
    }

    // listen to confirm window redux state
    if (nextProps.confirmWindow !== this.props.confirmWindow) {
      // console.log('nextProps confirmWindow', nextProps.confirmWindow)
      // first open of confirmWindow does not return property confirmClicked
      // if confirmClicked is true, proceed with whatever fxn
      if (!nextProps.confirmWindow.open && nextProps.confirmWindow.confirmClicked) {
        // console.log('state confirmIsFor', this.state.confirmIsFor)
        if (this.state.confirmIsFor === 'deleteMedia') {
          this.deleteSelectedMedia()
        }
        if (this.state.confirmIsFor === 'deleteAlbum') {
          this.deleteAlbum()
        }
        if (this.state.confirmIsFor === 'moveToAlbum') {
          this.moveToAlbum()
        }
        this.setState({confirmIsFor: ''})
      } else if (!nextProps.confirmWindow.open && !nextProps.confirmWindow.confirmClicked) {
        this.setState({confirmIsFor: '', isMoveToAlbumDropdownOpen: false, moveToAlbumId: ''})
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
      <div style={styles.mediaConsoleGrayTint} tabIndex='0' onKeyDown={e => this.onMediaConsoleKeyDown(e)}>
        <Style rules={{html: {overflowY: 'hidden'}}} />

        <i className='material-icons' style={styles.closeConsoleIcon} onClick={() => this.props.closeMediaConsole()}>close</i>

        <div style={styles.mediaConsoleContainer}>

          {/* MEDIA CONSOLE LEFT COL */}
          <div style={styles.leftColumnContainer}>

            {/* TOP SECTION */}
            <div style={styles.topSectionContainer}>
              {/* ALBUM LIST AND + ICON */}
              <div style={styles.albumListHeaderContainer}>
                <span style={styles.albumListHeaderText}>Album List</span>
                <i className='material-icons' style={styles.addAlbumIcon} onClick={() => this.createNewAlbum()}>add</i>
              </div>

              {/* DIV TO CONTAIN ALBUM NAMES WITH BORDER LEFT */}
              <div className={'dashboardDivs'} style={styles.albumListContainer}>
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
                    <div key={i} style={isFocusedAlbum ? styles.focusedAlbumDiv : styles.unfocusedAlbumDiv} onClick={() => this.setFocusedAlbum(album.id)}>
                      <span key={i} style={styles.albumNameText}>{album.title}</span>
                      {selectedMediaCount > 0 &&
                        <React.Fragment>
                          <hr style={styles.albumNameLine} />
                          <span style={styles.albumNameText}>{selectedMediaCount}</span>
                        </React.Fragment>
                      }
                    </div>
                  )
                })}
              </div>
            </div>

            <hr style={styles.leftColumnHorizontalRule} />

            {/* ALBUM INFO */}
            {focusedAlbum &&
              <div style={styles.albumInfoContainer}>
                <label style={styles.albumInfoInputFieldLabel}>
                  <h5 style={styles.albumInfoHeader}>Album Title</h5>
                  <input type='text' value={this.state.title} placeholder={'Untitled Album'} style={styles.albumInfoInputField} onChange={e => this.handleChange(e, 'title')} />
                </label>
                <label style={styles.albumInfoInputFieldLabel}>
                  <h5 style={styles.albumInfoHeader}>Location / Tags</h5>
                  <input type='text' style={styles.albumInfoInputField} />
                </label>
                <label style={styles.albumInfoInputFieldLabel}>
                  <h5 style={styles.albumInfoHeader}>Album Description</h5>
                  <textarea value={this.state.description} placeholder={'No description available'} style={styles.albumInfoTextArea} onChange={e => this.handleChange(e, 'description')} />
                </label>
                <span key={'albumButton1'} style={styles.albumInfoButton} onClick={() => this.editAlbum()}>Save changes</span>
                <span key={'albumButton2'} style={styles.albumInfoButton} onClick={() => this.cancelEditAlbum()}>Cancel</span>

              </div>
            }

          </div>

          {/* MEDIA CONSOLE RIGHT SIDE */}
          {this.props.mediaConsole.focusedAlbumId &&
            <div style={styles.rightColumnContainer}>

              {/* TOP SECTION -> THUMBNAILS */}
              <div style={styles.thumbnailsSectionContainer}>
                {!this.state.isAddYoutubeComponentOpen &&
                  <div style={styles.addMediumContainer}>
                    <label key={'mediaConsoleAddPhotoButton'} style={styles.addMediumButton}>
                      <h5 style={{height: '10px', width: '100%', visibility: 'hidden'}}>flex spacing</h5>
                      <i className='material-icons' style={styles.addMediumIcon}>collections</i>
                      <h5 style={styles.addMediumButtonText}>Add a photo</h5>
                      <input type='file' multiple accept='.jpeg, .jpg, .png' style={{display: 'none'}} onChange={e => this.uploadPhotos(e)} />
                    </label>
                    <div key={'mediaConsoleAddYoutubeButton'} style={styles.addMediumButton} onClick={() => this.displayAddYoutubeComponent()}>
                      <h5 style={{height: '10px', width: '100%', visibility: 'hidden'}}>flex spacing</h5>
                      <i className='material-icons' style={styles.addMediumIcon}>videocam</i>
                      <h5 style={styles.addMediumButtonText}>Embed Youtube video</h5>
                    </div>
                  </div>
                }
                {this.state.isAddYoutubeComponentOpen &&
                  <div style={styles.addYoutubeContainer}>
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
                  let isSelectedMedia = _.find(this.props.mediaConsole.selectedMedia, e => {
                    return e.id === medium.id
                  })
                  return (
                    <div key={i} style={styles.thumbnailContainer}>
                      {medium.type === 'Photo' &&
                        <img src={medium.imageUrl} style={styles.imageThumbnail} />
                      }
                      {medium.type === 'Youtube' &&
                        <iframe key={i} src={`${medium.youtubeUrl}?modestbranding=1&rel=0`} width='256px' height='144px' frameBorder={0} allowFullScreen />
                      }
                      <div style={styles.checkboxContainer} onClick={() => this.onCheckboxClick(medium)}>
                        <div key={`mediaThumbnailUnchecked${i}`} style={isSelectedMedia ? styles.checkboxTicked : styles.checkboxUnticked}>
                          <i className='material-icons' style={{color: 'white'}}>done</i>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* BOTTOM BAR -> ACTION BUTTONS */}
              <div style={styles.actionBarContainer}>
                <div style={styles.actionBar}>
                  <div style={{position: 'relative'}}>
                    <button key={'mediaButton1'} style={styles.actionBarLeftButtons} onClick={() => this.confirmDeleteMedia()}>Delete</button>
                    {/* <button key={'mediaButton2'} style={styles.actionBarLeftButtons}>Download</button> */}
                    <button key={'mediaButton3'} style={styles.actionBarLeftButtons} onClick={() => this.toggleMoveToAlbumDropdown()}>Move to</button>
                    {this.state.isMoveToAlbumDropdownOpen &&
                      <div style={styles.shiftAlbumDropdown}>
                        <h4>Select an album</h4>
                        {this.props.mediaConsole.albums.map((album, i) => {
                          return (
                            <h4 key={i} style={{cursor: 'pointer'}} onClick={() => this.confirmMoveToAlbum(album.id)}>{album.title}</h4>
                          )
                        })}
                      </div>
                    }
                    <button key={'mediaButton4'} style={styles.actionBarLeftButtons} onClick={() => this.confirmDeleteAlbum()}>Delete album</button>
                  </div>
                  <div>
                    <button key={'mediaButton5'} style={styles.actionBarRightButtons} onClick={() => this.uncheckAll()}>Uncheck all</button>
                    <button key={'mediaButton6'} style={styles.actionBarRightButtons} onClick={() => this.checkAll()}>Check all</button>
                    {this.props.mediaConsole.openedFrom === 'editor' &&
                    <button key={'mediaButton7'} style={styles.actionBarRightButtons} onClick={() => this.updateActivePageMedia()}>Post</button>
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
  graphql(deleteAlbum, {name: 'deleteAlbum'}),
  graphql(moveMediaToAlbum, {name: 'moveMediaToAlbum'})
)(Radium(MediaConsole)))
