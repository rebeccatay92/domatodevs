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
    // clone n update instance to pass up to form
    var instanceClone = JSON.parse(JSON.stringify(this.props.instance))
    instanceClone.attachments = instanceClone.attachments.concat([attachmentInfo])
    console.log('instanceClone', instanceClone)
    this.props.handleFlightInstanceChange(instanceClone)
  }

  removeUpload (index) {
    var instanceClone = JSON.parse(JSON.stringify(this.props.instance))
    var fileToRemove = instanceClone.attachments[index]
    var fileNameToRemove = fileToRemove.fileName
    if (this.props.backgroundImage.indexOf(fileNameToRemove) > -1) {
      this.props.setBackground(defaultBackground)
    }
    var files = instanceClone.attachments
    var newFilesArr = (files.slice(0, index)).concat(files.slice(index + 1))
    instanceClone.attachments = newFilesArr
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
      <div style={{overflow: 'scroll'}}>
        <div>
          <Notes notes={this.props.instance.departureNotes} handleChange={(e) => this.handleChange(e, 'departureNotes')} label={`Departure: ${this.props.instance.departureAirport}`} />
          <AttachmentsRework ItineraryId={this.props.ItineraryId} attachments={this.props.instance.attachments.filter(e => { return e.arrivalDeparture === 'departure' })} handleFileUpload={(e) => this.handleFileUpload(e, 'departure')} removeUpload={i => this.removeUpload(i)} setBackground={url => this.props.setBackground(url)} />
        </div>
        <div>
          <Notes notes={this.props.instance.arrivalNotes} handleChange={(e) => this.handleChange(e, 'arrivalNotes')} label={`Arrival: ${this.props.instance.arrivalAirport}`} />
          <AttachmentsRework ItineraryId={this.props.ItineraryId} attachments={this.props.instance.attachments.filter(e => { return e.arrivalDeparture === 'arrival' })} handleFileUpload={(e) => this.handleFileUpload(e, 'arrival')} removeUpload={i => this.removeUpload(i)} setBackground={url => this.props.setBackground(url)} />
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
