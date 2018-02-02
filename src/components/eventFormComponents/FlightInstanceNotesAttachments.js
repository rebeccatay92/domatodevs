import React, { Component } from 'react'
import { connect } from 'react-redux'
import Notes from '../eventFormComponents/Notes'
import AttachmentsRework from '../eventFormComponents/AttachmentsRework'
import { retrieveCloudStorageToken } from '../../actions/cloudStorageActions'

const defaultBackground = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}flightDefaultBackground.jpg`

class FlightInstanceNotesAttachments extends Component {
  // constructor (props) {
  //   super(props)
  // }

  handleChange (e, field) {
    if (field === 'departureNotes' || field === 'arrivalNotes') {
      var instanceClone = JSON.parse(JSON.stringify(this.props.instance))
      instanceClone[field] = e.target.value
      this.props.handleFlightInstanceChange(instanceClone)
    }
  }

  handleFileUpload (attachmentInfo, arrivalDeparture) {
    attachmentInfo.arrivalDeparture = arrivalDeparture
    var instanceClone = JSON.parse(JSON.stringify(this.props.instance))
    instanceClone.attachments = instanceClone.attachments.concat([attachmentInfo])
    // for create form, and for changed flights, use attachments arr. if edit form but flight didnt change, use holders as well
    if (this.props.formType === 'edit' && !this.props.changedFlight) {
      instanceClone.holderNewAttachments.push(attachmentInfo)
    }
    console.log('instanceClone', instanceClone)
    this.props.handleFlightInstanceChange(instanceClone)
  }

  removeUpload (index) {
    var instanceClone = JSON.parse(JSON.stringify(this.props.instance))

    var files = instanceClone.attachments
    var holderNew = instanceClone.holderNewAttachments

    var fileToDelete = files[index]
    var fileNameToRemove = fileToDelete.fileName
    if (this.props.backgroundImage.indexOf(fileNameToRemove) > -1) {
      this.props.setBackground(defaultBackground)
      // this.setState({backgroundImage: defaultBackground})
    }

    var uriBase = process.env.REACT_APP_CLOUD_DELETE_URI
    fileNameToRemove = fileNameToRemove.replace('/', '%2F')
    var uriFull = uriBase + fileNameToRemove

    if (this.props.formType === 'edit' && !this.props.changedFlight) {
      // if remove attachments from edit form (flight not changed), remove from holderNewAttachments too
      var newFilesArr = (files.slice(0, index)).concat(files.slice(index + 1))
      instanceClone.attachments = newFilesArr

      // if recent upload, remove from cloud n holder new, else add to holder delete
      var isRecentUpload = holderNew.includes(fileToDelete)
      if (isRecentUpload) {
        var holdingIndex = holderNew.indexOf(fileToDelete)
        var newArr = (holderNew.slice(0, holdingIndex)).concat(holderNew.slice(holdingIndex + 1))
        this.setState({holderNewAttachments: newArr})

        fetch(uriFull, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.apiToken}`
          }
        })
        .then(response => {
          if (response.status === 204) {
            console.log('delete from cloud storage succeeded')
          }
        })
        .catch(err => {
          console.log(err)
        })
      } else {
        instanceClone.holderDeleteAttachments.push(fileToDelete)
      }
    } else if (this.props.formType !== 'edit' || this.props.changedFlight) {
      // if create form, or a changed flight in edit form. only attachments arr, and not the holders are used
      // since attachments does not delete from cloud if formType is edit, we handle the fetch here
      newFilesArr = (files.slice(0, index)).concat(files.slice(index + 1))
      instanceClone.attachments = newFilesArr
      fetch(uriFull, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      })
      .then(response => {
        if (response.status === 204) {
          console.log('delete from cloud storage succeeded')
        }
      })
      .catch(err => {
        console.log(err)
      })
    }

    this.props.handleFlightInstanceChange(instanceClone)
  }

  componentDidMount () {
    this.props.retrieveCloudStorageToken()

    this.props.cloudStorageToken.then(obj => {
      this.apiToken = obj.token
    })
  }

  render () {
    if (!this.props.instance) return null
    return (
      <div>
        <div>
          <h5>Departure: {this.props.instance.departureAirport}</h5>
          <div style={{width: '50%', display: 'inline-block'}}>
            <Notes notes={this.props.instance.departureNotes} handleChange={(e) => this.handleChange(e, 'departureNotes')} />
          </div>
          <div style={{width: '50%', display: 'inline-block', float: 'right'}}>
            <AttachmentsRework ItineraryId={this.props.ItineraryId} attachments={this.props.instance.attachments.filter(e => { return e.arrivalDeparture === 'departure' })} handleFileUpload={(e) => this.handleFileUpload(e, 'departure')} removeUpload={i => this.removeUpload(i)} setBackground={url => this.props.setBackground(url)} formType={this.props.formType} backgroundImage={this.props.backgroundImage} />
          </div>
        </div>

        <hr />

        <div>
          <h5>Departure: {this.props.instance.arrivalAirport}</h5>
          <div style={{width: '50%', display: 'inline-block'}}>
            <Notes notes={this.props.instance.arrivalNotes} handleChange={(e) => this.handleChange(e, 'arrivalNotes')} />
          </div>
          <div style={{width: '50%', display: 'inline-block', float: 'right'}}>
            <AttachmentsRework ItineraryId={this.props.ItineraryId} attachments={this.props.instance.attachments.filter(e => { return e.arrivalDeparture === 'arrival' })} handleFileUpload={(e) => this.handleFileUpload(e, 'arrival')} removeUpload={i => this.removeUpload(i)} setBackground={url => this.props.setBackground(url)} formType={this.props.formType} backgroundImage={this.props.backgroundImage} />
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(FlightInstanceNotesAttachments)
