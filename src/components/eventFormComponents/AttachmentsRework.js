import React, { Component } from 'react'
import { connect } from 'react-redux'
import { retrieveCloudStorageToken } from '../../actions/cloudStorageActions'

import Radium from 'radium'
import ImagePreview from './ImagePreview'
import Thumbnail from './Thumbnail'
// import { addAttachmentBtnStyle } from '../../Styles/styles'
import AttachmentOptionsDropdown from './AttachmentOptionsDropdown'

class AttachmentsRework extends Component {
  constructor (props) {
    super(props)
    this.state = {
      thumbnail: false,
      thumbnailUrl: null,
      // hoveringOver: null, // determining which file's X icon to display
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

  setBackground (i) {
    var file = this.props.attachments[i]
    var fileName = file.fileName
    var url = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}${fileName}`
    // DEAL WITH SPECIAL CHARACTERS
    url = url.replace(/ /gi, '%20')
    this.props.setBackground(url)
  }

  thumbnailMouseEnter (event, i) {
    var fileName = this.props.attachments[i].fileName
    var fileType = this.props.attachments[i].fileType

    // this.setState({hoveringOver: i})

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
    // this.setState({hoveringOver: null})
  }

  openPreview () {
    console.log('open preview overlay?')
  }

  componentDidMount () {
    this.props.retrieveCloudStorageToken()

    this.props.cloudStorageToken.then(obj => {
      this.apiToken = obj.token
    })
  }

  toggleDropdown (i) {
    console.log('toggle dropdown', i)
    this.setState({dropdown: !this.state.dropdown, dropdownIndex: i})
  }

  // NO CLICK TO OPEN PREVIEW YET. THUMBNAIL FLASHES
  render () {
    // console.log('attachments props', this.props)
    return (
      <div>
        {/* LIST OF ATTACHMENTS */}
        {!this.state.preview && this.props.attachments.map((info, i) => {
          return (
            <div key={'thumbnail' + i} style={{width: '100%'}} onMouseEnter={(event) => this.thumbnailMouseEnter(event, i)} onMouseLeave={(event) => this.thumbnailMouseLeave(event)}>
              <div style={{cursor: 'pointer', display: 'inline-block'}} onClick={() => this.openPreview()}>
                {info.fileType === 'application/pdf' &&
                <i className='material-icons' style={{color: 'rgb(237, 15, 135)', fontSize: '20px', marginRight: '2px'}}>picture_as_pdf</i>}
                {info.fileType !== 'application/pdf' &&
                <i className='material-icons' style={{color: 'rgb(43, 201, 217)', fontSize: '20px'}}>photo</i>}
                <h5 style={{display: 'inline-block'}}>{info.fileAlias}</h5>
              </div>

              <div style={{display: 'inline-block', position: 'relative', float: 'right'}}>
                <i className='material-icons'>file_download</i>
                <i className='material-icons ignoreMoreVert' style={{cursor: 'pointer'}} onClick={() => this.toggleDropdown(i)}>more_vert</i>
                {this.state.dropdown && this.state.dropdownIndex === i &&
                  <AttachmentOptionsDropdown toggleDropdown={() => this.toggleDropdown()} index={i} outsideClickIgnoreClass={'ignoreMoreVert'} setBackground={() => this.setBackground(i)} removeUpload={() => this.removeUpload(i, this.props.formType)} file={info} />
                }
              </div>
            </div>
          )
        })}
        {/* ADD ATTACHMENT ICON */}
        {this.props.attachments.length <= 5 &&
          <label style={{display: 'inline-block', color: 'black', cursor: 'pointer'}}>
            <i key='attachmentAdd' className='material-icons'>file_upload</i>
            Click here to upload files
            <input type='file' name='file' accept='.jpeg, .jpg, .png, .pdf' onChange={(e) => {
              this.handleFileUpload(e)
            }} style={{display: 'none'}} />
          </label>
        }
        {this.props.attachments.length > 5 &&
          <div style={{width: '50px'}}>
            <span style={{color: 'black'}}>Upload maxed</span>
          </div>
        }

        {/* THUMBNAIL ON HOVER */}
        {this.state.thumbnail && !this.state.dropdown &&
          <Thumbnail thumbnailUrl={this.state.thumbnailUrl} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Radium(AttachmentsRework))
