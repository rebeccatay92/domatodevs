import React, { Component } from 'react'
import { connect } from 'react-redux'

import Radium from 'radium'
// import ImagePreview from './ImagePreview'
import Thumbnail from './Thumbnail'
// import { addAttachmentBtnStyle } from '../../Styles/styles'
import AttachmentOptionsDropdown from './AttachmentOptionsDropdown'

class AttachmentsRework extends Component {
  constructor (props) {
    super(props)
    this.state = {
      thumbnail: false,
      thumbnailUrl: null,
      hoveringOverIndex: null,
      preview: false,
      previewUrl: null,
      dropdown: false,
      dropdownIndex: null
    }
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
            'Authorization': `Bearer ${this.props.googleCloudToken.token}`,
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
          // DOES NOT HANDLE ARRIVAL, DEPARTURE
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
  }

  removeUpload (index, formType) {
    this.setState({
      hoverIndex: null,
      dropdown: false,
      dropdownIndex: null
    })

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
        'Authorization': `Bearer ${this.props.googleCloudToken.token}`
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

  setBackground (i) {
    var file = this.props.attachments[i]
    var fileName = file.fileName
    var url = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}${fileName}`
    // DEAL WITH SPECIAL CHARACTERS
    url = url.replace(/ /gi, '%20')
    this.props.setBackground(url)
  }

  thumbnailMouseEnter (event, i) {
    // console.log('mouse enter', i)
    var fileName = this.props.attachments[i].fileName
    var fileType = this.props.attachments[i].fileType

    if (fileType === 'application/pdf') {
      var url = 'http://media.idownloadblog.com/wp-content/uploads/2016/04/52ff0e80b07d28b590bbc4b30befde52.png'
    } else {
      url = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}${fileName}`
    }
    this.setState({hoveringOverIndex: i})
    this.setState({thumbnailUrl: url})
    this.setState({thumbnail: true})
  }

  thumbnailMouseLeave (event) {
    this.setState({hoveringOverIndex: null})
    this.setState({thumbnail: false})
    this.setState({thumbnailUrl: null})
  }

  openPreview (i) {
    // console.log('open preview overlay?')
    var fileName = this.props.attachments[i].fileName
    // var fileType = this.props.attachments[i].fileType
    var url = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}${fileName}`
    window.open(url)
  }

  // componentDidMount () {
  //   this.props.retrieveCloudStorageToken()
  //
  //   this.props.cloudStorageToken.then(obj => {
  //     this.apiToken = obj.token
  //   })
  // }

  toggleDropdown (i) {
    console.log('toggle dropdown', i)
    this.setState({dropdown: !this.state.dropdown, dropdownIndex: i})
  }

  // NO CLICK TO OPEN PREVIEW YET. THUMBNAIL FLASHES
  render () {
    return (
      <div>
        {/* LIST OF ATTACHMENTS */}
        <label style={{fontSize: '13px', fontWeight: '400', marginBottom: '14px', display: 'block', lineHeight: '15px'}}>Attachments</label>
        {!this.state.preview && this.props.attachments.map((info, i) => {
          // console.log('length', this.props.attachments.length, 'i+1', i + 1)
          var fileName = info.fileName
          var url = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}${fileName}`
          url = url.replace(/ /gi, '%20')
          console.log('filename', fileName, 'bg image', this.props.backgroundImage)
          return (
            <div onMouseOver={() => this.setState({hoverIndex: i})} onMouseOut={() => this.setState({hoverIndex: null})} key={'thumbnail' + i} style={{width: '100%', position: 'relative'}} onMouseEnter={(event) => this.thumbnailMouseEnter(event, i)} onMouseLeave={(event) => this.thumbnailMouseLeave(event)}>
              <div style={{marginBottom: '8px', height: '18px'}}>
                <div style={{cursor: 'pointer', display: 'inline-block'}} onClick={() => this.openPreview(i)}>
                  {info.fileType === 'application/pdf' &&
                  <i className='material-icons' style={{color: '#df386b', fontSize: '21px', lineHeight: '18px', marginRight: '8px', verticalAlign: 'middle'}}>picture_as_pdf</i>}
                  {info.fileType !== 'application/pdf' &&
                  <i className='material-icons' style={{color: '#438496', fontSize: '21px', lineHeight: '18px', marginRight: '8px', verticalAlign: 'middle'}}>photo</i>}
                  <h5 style={{display: 'inline-block', maxWidth: '367px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', verticalAlign: 'middle', color: 'rgba(60, 58, 68, 0.7)', fontWeight: '300', fontSize: '13px', margin: '0px'}}>{info.fileAlias}</h5>
                </div>

                <div style={{display: 'inline-block', position: 'absolute', right: '-18px', top: '2px'}}>
                  {this.props.backgroundImage && (this.props.backgroundImage.indexOf(info.fileName) > -1) &&
                    <i className='material-icons' style={{color: 'rgba(60, 58, 68, 0.7)', fontSize: '21px', lineHeight: '18px'}}>assignment_ind</i>
                  }
                  <a href={url} download='testing.png'><i className='material-icons' style={{color: 'rgba(60, 58, 68, 0.7)', fontSize: '21px', lineHeight: '18px'}}>file_download</i></a>
                  <i className='material-icons ignoreMoreVert' style={{color: 'rgba(60, 58, 68, 0.7)', cursor: 'pointer', fontSize: '21px', lineHeight: '18px', position: 'relative', top: '-1px', opacity: this.state.hoverIndex === i || this.state.dropdownIndex === i ? '1' : '0'}} onClick={() => this.toggleDropdown(i)}>more_vert</i>
                  {this.state.dropdown && this.state.dropdownIndex === i &&
                    <AttachmentOptionsDropdown toggleDropdown={() => this.toggleDropdown()} index={i} outsideClickIgnoreClass={'ignoreMoreVert'} setBackground={() => this.setBackground(i)} removeUpload={() => this.removeUpload(i, this.props.formType)} file={info} />
                  }
                </div>
              </div>

              {/* THUMBNAIL ON HOVER */}
              {this.state.hoveringOverIndex === i && this.state.thumbnail && !this.state.dropdown &&
                <Thumbnail thumbnailUrl={url} />
              }
              {(this.props.attachments.length !== i + 1) &&
                <hr style={{margin: '0 0 8px 0'}} />
              }
            </div>
          )
        })}
        {/* ADD ATTACHMENT ICON */}
        {this.props.attachments.length <= 5 &&
          <label style={{display: 'inline-block', color: 'black', cursor: 'pointer', marginTop: this.props.attachments.length > 0 ? '8px' : 0}}>
            <i key='attachmentAdd' className='material-icons' style={{verticalAlign: 'text-bottom', fontSize: '21px', lineHeight: '18px', color: 'rgba(60, 58, 68, 0.7)'}}>file_upload</i>
            <span style={{fontSize: '13px', fontWeight: 300, marginLeft: '16px', color: 'rgba(60, 58, 68, 0.7)'}}>Click here to upload file</span>
            <input type='file' name='file' accept='.jpeg, .jpg, .png, .pdf' onChange={(e) => {
              this.handleFileUpload(e)
            }} style={{display: 'none'}} />
          </label>
        }
        {/* {this.props.attachments.length > 5 &&
          <div>
            <span style={{color: 'black'}}>Upload maxed</span>
          </div>
        } */}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    googleCloudToken: state.googleCloudToken
  }
}

export default connect(mapStateToProps)(Radium(AttachmentsRework))
