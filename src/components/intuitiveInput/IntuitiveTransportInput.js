import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import moment from 'moment'
import Radium from 'radium'
import LocationSearch from '../location/LocationSearch'

import { constructGooglePlaceDataObj } from '../../helpers/location'
import { allCurrenciesList } from '../../helpers/countriesToCurrencyList'
import newEventLoadSeqAssignment from '../../helpers/newEventLoadSeqAssignment'
import { activityIconStyle, createEventBoxStyle, intuitiveDropdownStyle, primaryColor } from '../../Styles/styles'

import { createLandTransport } from '../../apollo/landtransport'
import { createTrain } from '../../apollo/train'
import { createSeaTransport } from '../../apollo/seatransport'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { queryItinerary, updateItineraryDetails } from '../../apollo/itinerary'

const defaultBackground = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}landTransportDefaultBackground.jpg`

class IntuitiveTransportInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      search: '',
      searching: false,
      departureGooglePlaceData: {name: ''},
      arrivalGooglePlaceData: {name: ''}
    }
  }

  selectLocation (location, type) {
    this.setState({[`${type}GooglePlaceData`]: constructGooglePlaceDataObj(location)})
  }

  handleChange (e, field) {
    this.setState({
      [field]: e.target.value
    })
  }

  handleKeydown (e) {
    if (e.keyCode === 13) {
      this.handleSubmit()
    }
  }

  handleSubmit () {
    const validations = [
      {
        type: 'departureGooglePlaceData',
        notification: 'departRequired'
      },
      {
        type: 'arrivalGooglePlaceData',
        notification: 'arriveRequired'
      },
      {
        type: 'startTime',
        notification: 'startTimeRequired'
      },
      {
        type: 'endTime',
        notification: 'endTimeRequired'
      }
    ]
    let validated = true
    validations.forEach((validation) => {
      if (this.state[validation.type]) {
        this.setState({
          [validation.notification]: false
        })
      }
      if (!this.state[validation.type]) {
        this.setState({
          [validation.notification]: true
        })
        validated = false
      }
    })
    if (!validated) return

    var startHours = this.state.startTime.split(':')[0]
    var startMins = this.state.startTime.split(':')[1]
    var startUnix = (startHours * 60 * 60) + (startMins * 60)
    var endHours = this.state.endTime.split(':')[0]
    var endMins = this.state.endTime.split(':')[1]
    var endUnix = (endHours * 60 * 60) + (endMins * 60)

    const startDay = this.props.day
    const newTransport = {
      ItineraryId: parseInt(this.props.itineraryId, 10),
      startDay: startDay,
      endDay: endUnix < startUnix ? startDay + 1 : startDay,
      startTime: startUnix,
      endTime: endUnix,
      description: this.state.description,
      currency: this.state.currency,
      bookingStatus: false,
      backgroundImage: defaultBackground
    }

    if (this.state.departureGooglePlaceData.placeId && this.state.arrivalGooglePlaceData.placeId) {
      newTransport.departureGooglePlaceData = this.state.departureGooglePlaceData
      newTransport.arrivalGooglePlaceData = this.state.arrivalGooglePlaceData
    } else {
      return
    }

    // TESTING LOAD SEQUENCE ASSIGNMENT (ASSUMING ALL START/END TIMES ARE PRESENT)
    var helperOutput = newEventLoadSeqAssignment(this.props.events, this.props.type, newTransport)
    // console.log('helper output', helperOutput)

    this.props.changingLoadSequence({
      variables: {
        input: helperOutput.loadSequenceInput
      }
    })

    if (newTransport.endDay > this.props.daysArr.length) {
      this.props.updateItineraryDetails({
        variables: {
          id: this.props.itineraryId,
          days: this.props.daysArr.length + 1
        }
      })
    }

    const mutation = `create${this.props.type}`

    this.props[mutation]({
      variables: helperOutput.newEvent,
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.itineraryId }
      }]
    })

    this.resetState()
    this.props.toggleIntuitiveInput()
  }

  resetState () {
    this.setState({
      departureGooglePlaceData: {name: ''},
      arrivalGooglePlaceData: {name: ''},
      search: ''
    })
  }

  componentDidMount () {
    var currencyList = allCurrenciesList()
    this.setState({currency: currencyList[0]})
  }

  render () {
    const endStyle = {
      WebkitTextStroke: '1px ' + primaryColor,
      WebkitTextFillColor: primaryColor
    }
    return (
      <div onKeyDown={(e) => this.handleKeydown(e)} tabIndex='0' style={{...createEventBoxStyle, ...{width: '100%', paddingBottom: '10px', top: '-1.5vh'}}}>
        <div style={{display: 'inline-block', width: '35%'}}>
          {this.state.departRequired && <span style={{fontWeight: 'bold', position: 'absolute', top: '-20px'}}>(Required)</span>}
          <LocationSearch intuitiveInput selectLocation={location => this.selectLocation(location, 'departure')} placeholder={'Departure Location'} currentLocation={this.state.departureGooglePlaceData} />
        </div>
        <div style={{display: 'inline-block', width: '35%'}}>
          {this.state.arriveRequired && <span style={{fontWeight: 'bold', position: 'absolute', top: '-20px'}}>(Required)</span>}
          <LocationSearch intuitiveInput selectLocation={location => this.selectLocation(location, 'arrival')} placeholder={'Arrival Location'} currentLocation={this.state.arrivalGooglePlaceData} />
        </div>
        <div style={{display: 'inline-block', width: '30%'}}>
          {(this.state.startTimeRequired || this.state.endTimeRequired) && <span style={{fontWeight: 'bold', position: 'absolute', top: '-20px'}}>(Both Fields Required)</span>}
          <div style={{position: 'relative'}}>
            <i key='more' onClick={() => this.props.handleCreateEventClick(this.props.type)} className='material-icons' style={{position: 'absolute', right: '0%', color: '#ed685a', cursor: 'pointer'}}>more_horiz</i>
            <input type='time' style={{width: '40%'}} onChange={(e) => this.handleChange(e, 'startTime')} />
            <span>{' '}to{' '}</span>
            <input type='time' style={{width: '40%'}} onChange={(e) => this.handleChange(e, 'endTime')} />
          </div>
        </div>
        <div style={{marginTop: '5px', display: 'inline-block', textAlign: 'right', width: '96%'}}>
          <button onClick={() => this.handleSubmit()} style={{marginRight: '5px', backgroundColor: 'white', border: '1px solid #9FACBC'}}>Submit</button>
          <button onClick={() => this.props.toggleIntuitiveInput()} style={{backgroundColor: 'white', border: '1px solid #9FACBC'}}>Cancel</button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.plannerActivities
  }
}

export default connect(mapStateToProps)(compose(
  graphql(createLandTransport, {name: 'createLandTransport'}),
  graphql(createSeaTransport, {name: 'createSeaTransport'}),
  graphql(createTrain, {name: 'createTrain'}),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'}),
  graphql(updateItineraryDetails, {name: 'updateItineraryDetails'})
)(Radium(IntuitiveTransportInput)))
