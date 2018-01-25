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
    // console.log('handlechange field', field)
    // replace the respective notes with the new value, then pass the new instance up to form
    if (field === 'departureNotes' || field === 'arrivalNotes') {
      // deep clone even the objs inside
      var instanceClone = JSON.parse(JSON.stringify(this.props.instance))
      instanceClone[field] = e.target.value
      console.log('updatedInstance', instanceClone)
      // hoist the updated instance up to form
      this.props.handleFlightInstanceChange(instanceClone)
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
    if (!this.props.instance) return null
    return (
      <div>
        <div>
          <Notes handleChange={(e) => this.handleChange(e, 'departureNotes')} label={`Departure: ${this.props.instance.departureAirport}`} />
          <AttachmentsRework attachments={this.state.attachments.filter(e => { return e.arrivalDeparture === 'departure' })} />
        </div>
        <div>
          <Notes handleChange={(e) => this.handleChange(e, 'arrivalNotes')} label={`Arrival: ${this.props.instance.arrivalAirport}`} />
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
