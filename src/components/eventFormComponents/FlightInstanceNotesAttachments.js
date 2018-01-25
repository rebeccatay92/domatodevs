import React, { Component } from 'react'
import { connect } from 'react-redux'
import Notes from '../eventFormComponents/Notes'
import AttachmentsRework from '../eventFormComponents/AttachmentsRework'
import { retrieveCloudStorageToken } from '../../actions/cloudStorageActions'

class FlightInstanceNotesAttachments extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // departureNotes: '',
      // arrivalNotes: '',
      attachments: []
    }
  }

  handleChange (e, field) {
    var instance = this.props.instance
    // replace the respective notes with the new value, then pass the new instance up to form
    if (field === 'departureNotes' || field === 'arrivalNotes') {
      var updatedInstance = Object.assign({[`${field}`]: e.target.value}, instance)
      console.log('updatedInstance', updatedInstance)
    }
  }

  componentDidMount () {
    this.props.retrieveCloudStorageToken()

    this.props.cloudStorageToken.then(obj => {
      this.apiToken = obj.token
    })
  }

  render () {
    console.log('PROPS', this.props.instance)
    return (
      <div>
        <div>
          <Notes handleChange={(e) => this.handleChange(e, 'departureNotes')} label={`Departure: ${this.props.instance.departureLocation}`} />
          <AttachmentsRework attachments={this.state.attachments.filter(e => { return e.arrivalDeparture === 'departure' })} />
        </div>
        <div>
          <Notes handleChange={(e) => this.handleChange(e, 'arrivalNotes')} label={`Arrival: ${this.props.instance.arrivalLocation}`} />
          <AttachmentsRework attachments={this.state.attachments.filter(e => { return e.arrivalDeparture === 'arrival' })} />
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
