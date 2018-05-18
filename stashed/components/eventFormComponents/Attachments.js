import React, { Component } from 'react'
import { connect } from 'react-redux'
import { retrieveCloudStorageToken } from '../../actions/cloudStorageActions'

import ImagePreview from './ImagePreview'
import Thumbnail from './Thumbnail'

import Radium from 'radium'
import { primaryColor, attachmentStyle, addAttachmentBtnStyle, attachmentNameStyle, attachmentSizeStyle, attachmentDeleteBtnStyle, pdfLogoStyle, imageLogoStyle } from '../../Styles/styles'

const PDFJS = require('pdfjs-dist')

class Attachments extends Component {
  constructor (props) {
    super(props)
    this.state = {
      thumbnail: false,
      thumbnailUrl: null,
      hoveringOver: null, // determining which file's X icon to display
      preview: false,
      previewUrl: null
    }
  }

  thumbnailMouseEnter (event, i) {
    var fileName = this.props.attachments[i].fileName
    var fileType = this.props.attachments[i].fileType

    this.setState({hoveringOver: i})

    if (fileType === 'application/pdf') {
      var url = 'http://media.idownloadblog.com/wp-content/uploads/2016/04/52ff0e80b07d28b590bbc4b30befde52.png'
    } else {
      url = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}${fileName}`
    }
    this.setState({thumbnailUrl: url})
    this.setState({thumbnail: true})
  }

  thumbnailMouseLeave (event) {
    this.setState({thumbnail: false})
    this.setState({thumbnailUrl: null})
    this.setState({hoveringOver: null})
  }

  openPreview (event, i) {
    var fileName = this.props.attachments[i].fileName
    var fileType = this.props.attachments[i].fileType
    var url = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}${fileName}`

    // fileName = fileName.replace('/', '%2F')
    // fetch(`https://www.googleapis.com/storage/v1/b/domatodevs/o/${fileName}?alt=media`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${this.apiToken}`
    //   }
    // })
    // .then(response => {
    //   console.log('response', response)
    //   return response.blob()
    // })
    // .then(blob => {
    //   console.log(blob)
    //   var url = window.URL.createObjectURL(blob)
    //   // window.open(url)
    //   PDFJS.getDocument({url: url})
    //     .then(pdfdoc => {
    //       // console.log('pages', pdfdoc.numPages)
    //       pdfdoc.getPage(1)
    //         .then(page => {
    //           var viewport = page.getViewport(0.5)
    //           var renderContext = {
    //             canvasContext: document.getElementById('pdf-canvas').getContext('2d'),
    //             viewport: viewport
    //           }
    //           page.render(renderContext).then(function() {
    //             console.log('rendered')
    //           })
    //         })
    //     })
    // })

    if (fileType === 'application/pdf') {
      window.open(url)
    } else {
      this.setState({preview: true})
      this.setState({previewUrl: url})
    }
  }

  changePreview (event, i) {
    var fileName = this.props.attachments[i].fileName
    var fileType = this.props.attachments[i].fileType
    var url = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}${fileName}`
    if (fileType === 'application/pdf') {
      window.open(url)
    } else {
      this.setState({previewUrl: url})
    }
  }

  closePreview () {
    this.setState({
      previewUrl: null,
      preview: false
    })
  }

  handleFileUpload (e) {
    e.preventDefault()
    var file = e.target.files[0]

    if (file) {
      var ItineraryId = this.props.ItineraryId
      var timestamp = Date.now()
      var uriBase = process.env.REACT_APP_CLOUD_UPLOAD_URI
      var uriFull = `${uriBase}Itinerary${ItineraryId}/${file.name}_${timestamp}`
      fetch(uriFull,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': file.type,
            'Content-Length': file.size
          },
          body: file
        }
      )
      .then(response => {
        return response.json()
      })
      .then(json => {
        console.log('json', json)
        if (json.name) {
          var kilobytes = json.size / 1000
          if (kilobytes >= 1000) {
            var megabytes = kilobytes / 1000
            megabytes = Math.round(megabytes * 10) / 10
            var fileSizeStr = megabytes + 'MB'
          } else {
            kilobytes = Math.round(kilobytes)
            fileSizeStr = kilobytes + 'KB'
          }
          var attachmentInfo = {
            fileName: json.name,
            fileAlias: file.name,
            fileSize: fileSizeStr,
            fileType: file.type
          }
          this.props.handleFileUpload(attachmentInfo)
        }
      })
      .catch(err => {
        console.log('err', err)
      })
    }
    // this.props.handleFileUpload(e)
  }

  removeUpload (index, formType) {
    // if props formtype = 'edit', block the http req and just pass index up. editEventForm will compare against holding area and delete/delay till form submit/cancel action.
    if (formType === 'edit') {
      this.props.removeUpload(index)
      return
    }

    var objectName = this.props.attachments[index].fileName
    objectName = objectName.replace('/', '%2F')
    var uriBase = process.env.REACT_APP_CLOUD_DELETE_URI
    var uriFull = uriBase + objectName

    fetch(uriFull, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`
      }
    })
    .then(response => {
      if (response.status === 204) {
        console.log('delete from cloud storage succeeded')
        this.props.removeUpload(index)
      }
    })
    .catch(err => {
      console.log(err)
    })
  }

  componentDidMount () {
    this.props.retrieveCloudStorageToken()

    this.props.cloudStorageToken.then(obj => {
      this.apiToken = obj.token
    })
  }

  render () {
    // if (this.apiToken) { console.log(this.apiToken) }
    return (
      <div>
        {/* <canvas id='pdf-canvas' width='200' /> */}
        {/* UPLOADED FILE NAMES */}
        {!this.state.preview && this.props.attachments.map((info, i) => {
          return <div onMouseEnter={(event) => this.thumbnailMouseEnter(event, i)} onMouseLeave={(event) => this.thumbnailMouseLeave(event)} style={attachmentStyle} key={'thumbnail' + i}>
            <div onClick={(e) => this.openPreview(e, i)} style={{display: 'inline-block', cursor: 'pointer'}}>
              {info.fileType === 'application/pdf' &&
              <i className='material-icons' style={pdfLogoStyle}>picture_as_pdf</i>}
              {info.fileType !== 'application/pdf' &&
              <i className='material-icons' style={imageLogoStyle}>photo</i>}
            </div>
            <div onClick={(e) => this.openPreview(e, i)} style={{display: 'inline-block', cursor: 'pointer', maxWidth: '70%'}}>
              <h4 style={attachmentNameStyle}>{info.fileAlias}</h4>
              <h4 style={attachmentSizeStyle}>{info.fileSize}</h4>
            </div>
            <div style={{display: 'inline-block', cursor: 'pointer', position: 'absolute', bottom: '-5px', right: '0'}}>
              <i key={'attachmentDelete' + i} className='material-icons' value={i} onClick={() => {
                this.setState({hoveringOver: null})
                this.removeUpload(i, this.props.formType)
              }} style={attachmentDeleteBtnStyle(this.state.hoveringOver, i)}>clear</i>
            </div>

            {/* THUMBNAIL ON HOVER */}
            {this.state.thumbnail && this.state.hoveringOver === i &&
              <Thumbnail thumbnailUrl={this.state.thumbnailUrl} />
            }
          </div>
        })}

        {/* UPLOAD ICON IF FILES < 6 */}
        {(this.props.attachments.length <= 5) &&
          <label style={{display: 'inline-block', color: 'black'}}>
            <i key='attachmentAdd' style={addAttachmentBtnStyle} className='material-icons'>add</i>
            <input type='file' name='file' accept='.jpeg, .jpg, .png, .pdf' onChange={(e) => {
              this.handleFileUpload(e)
            }} style={{display: 'none'}} />
          </label>
        }

        {/* MAXED UPLOAD WHEN FILES > 6 */}
        {this.props.attachments.length > 5 &&
          <div style={{width: '50px'}}>
            <span style={{color: 'black'}}>Upload maxed</span>
          </div>
        }

        {/* PREVIEW OVERLAY WITH ITS OWN FILE NAMES */}
        {this.state.preview &&
          <div>
            <div style={{position: 'fixed', bottom: 0, right: 0, top: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 5555}} />
              {!this.state.previewUrl.match('.pdf') &&
              <div>
                <ImagePreview previewUrl={this.state.previewUrl} setBackground={(url) => this.props.setBackground(url)} />
              </div>
              }
            <div style={{position: 'fixed', left: '10%', top: '90%', zIndex: 9999, height: '5%', width: '80%', marginTop: '5px'}}>
              <i key='exitImgPreview' id='exitImgPreview' className='material-icons' onClick={() => this.closePreview()} style={{cursor: 'pointer', fontSize: '30px'}}>arrow_back</i>

              {/* SIMILAR TO ABOVE BUT NO DELETE UPLOAD, OPENPREVIEW BECOMES CHANGE PREVIEW */}
              {this.props.attachments.map((info, i) => {
                return (
                  <div style={{...attachmentStyle, ...{backgroundColor: 'grey'}}} key={'preview' + i}>
                    <div style={{display: 'inline-block', cursor: 'pointer'}}>
                      {info.fileType === 'application/pdf' &&
                      <i className='material-icons' style={pdfLogoStyle}>picture_as_pdf</i>}
                      {info.fileType !== 'application/pdf' &&
                      <i className='material-icons' style={imageLogoStyle}>photo</i>}
                    </div>
                    <div style={{display: 'inline-block', cursor: 'pointer', maxWidth: '70%'}}>
                      <h4 onClick={(e) => this.changePreview(e, i)} style={{...attachmentNameStyle, ...{color: 'white'}}}>{info.fileAlias}</h4>
                      <h4 style={{...attachmentSizeStyle, ...{color: 'white'}}}>{info.fileSize}</h4>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    cloudStorageToken: state.cloudStorageToken
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    retrieveCloudStorageToken: () => {
      dispatch(retrieveCloudStorageToken())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Attachments))
