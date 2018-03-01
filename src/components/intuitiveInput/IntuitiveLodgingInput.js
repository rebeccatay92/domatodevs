import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import Radium from 'radium'
import LocationSearch from '../location/LocationSearch'

import DateTimePicker from '../eventFormComponents/DateTimePicker'
import { constructGooglePlaceDataObj } from '../../helpers/location'
import { allCurrenciesList } from '../../helpers/countriesToCurrencyList'
import newEventLoadSeqAssignment from '../../helpers/newEventLoadSeqAssignment'
import { activityIconStyle, createEventBoxStyle, intuitiveDropdownStyle, primaryColor } from '../../Styles/styles'

import { createLodging } from '../../apollo/lodging'
import { changingLoadSequence } from '../../apollo/changingLoadSequence'
import { queryItinerary, updateItineraryDetails } from '../../apollo/itinerary'

const defaultBackground = `${process.env.REACT_APP_CLOUD_PUBLIC_URI}lodgingDefaultBackground.jpg`

class IntuitiveLodgingInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      googlePlaceData: {name: ''},
      search: '',
      checkInDay: this.props.day,
      checkInTime: 0,
      checkOutDay: this.props.day,
      checkOutTime: 0,
      checkInTimeString: '',
      checkOutTimeString: ''
    }
  }

  handleKeydown (e) {
    if (e.keyCode === 13) {
      this.handleSubmit()
    }
  }

  handleSelect (type, day, time) {
    if (type === 'checkInTime') {
      this.setState({
        checkInDay: day,
        checkInTime: time
      }, () => console.log(this.state))
    } else if (type === 'checkOutTime') {
      this.setState({
        checkOutDay: day,
        checkOutTime: time
      }, () => console.log(this.state))
    }
  }

  handleChange (e, field) {
    if (field === 'checkInDay' || field === 'checkOutDay') {
      this.setState({
        [field]: e.target.value
      })
    }
    // if changing checkin day and it is later than checkout day, change checkout day
    if (field === 'checkInDay' && e.target.value > this.state.checkOutDay) {
      this.setState({checkOutDay: e.target.value})
    }

    // if changing time, convert string to unix
    if (field === 'checkInTime' || field === 'checkOutTime') {
      this.setState({
        [`${field}String`]: e.target.value
      })
      var timestring = e.target.value
      var hours = timestring.split(':')[0]
      var mins = timestring.split(':')[1]
      var unix = (hours * 60 * 60) + (mins * 60)
      this.setState({
        [field]: unix
      }, () => console.log('dateless change time', this.state))
    }
  }

  handleSubmit () {
    const validations = [
      {
        type: 'googlePlaceData',
        notification: 'locRequired'
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

    var newLodging = {
      ItineraryId: parseInt(this.props.itineraryId, 10),
      startDay: this.props.day,
      endDay: this.state.checkOutDay,
      startTime: this.state.checkInTime,
      endTime: this.state.checkOutTime,
      currency: this.state.currency,
      bookingStatus: false,
      backgroundImage: defaultBackground
    }
    if (this.state.googlePlaceData.placeId) {
      newLodging.googlePlaceData = this.state.googlePlaceData
    }
    if (newLodging.startDay === newLodging.endDay && newLodging.endTime < newLodging.startTime) {
      newLodging.endDay = newLodging.startDay + 1
    }
    console.log(newLodging)

    var helperOutput = newEventLoadSeqAssignment(this.props.events, 'Lodging', newLodging)
    console.log('helper output', helperOutput)

    newLodging = helperOutput.newEvent

    this.props.changingLoadSequence({
      variables: {
        input: helperOutput.loadSequenceInput
      }
    })

    this.props.createLodging({
      variables: newLodging,
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.itineraryId }
      }]
    })

    this.resetState()
    this.props.toggleIntuitiveInput()
  }

  selectLocation (location) {
    var googlePlaceData = constructGooglePlaceDataObj(location)
    googlePlaceData
    .then(resolved => {
      console.log('resolved', resolved)
      this.setState({googlePlaceData: resolved})
    })
  }

  resetState () {
    this.setState({
      googlePlaceData: {name: ''},
      search: '',
      checkInDay: this.props.day,
      checkInTime: 0,
      checkOutDay: this.props.day,
      checkOutTime: 0
    })
  }

  componentDidMount () {
    var currencyList = allCurrenciesList()
    this.setState({currency: currencyList[0]})
  }

  render () {
    return (
      <div onKeyDown={(e) => this.handleKeydown(e)} tabIndex='0' style={{...createEventBoxStyle, ...{width: '100%', padding: '10px 0'}}}>
        <div style={{display: 'inline-block'}}>
          {this.state.locRequired && <span style={{fontWeight: 'bold', position: 'absolute', top: '-20px'}}>(Required)</span>}
          <LocationSearch intuitiveInput selectLocation={location => this.selectLocation(location)} placeholder={'Lodging'} currentLocation={this.state.googlePlaceData} />
        </div>
        <div style={{display: 'inline-block'}}>
          <div>
            <input type='text' placeholder='Room Description' style={{width: '499px', height: '31px', fontSize: '13px', padding: '8px', marginLeft: '8px'}} onChange={(e) => this.handleChange(e, 'description')} />
          </div>
        </div>
        <div style={{display: 'inline-block'}}>
          <div style={{position: 'relative'}}>
            {!this.state.startTime && !this.state.editingStartTime && <input type='text' placeholder='Start Time' style={{width: '86px', fontSize: '13px', height: '31px', padding: '8px', marginLeft: '8px', textAlign: 'center'}} onFocus={(e) => this.setState({editingStartTime: true})} />}
            {(this.state.startTime || this.state.editingStartTime) && <input autoFocus type='time' style={{width: '86px', fontSize: '13px', height: '31px', padding: '8px', marginLeft: '8px', textAlign: 'center'}} onChange={(e) => this.handleChange(e, 'startTime')} onBlur={(e) => this.setState({editingStartTime: false})} />}
            {!this.state.endTime && !this.state.editingEndTime && <input type='text' placeholder='End Time' style={{width: '86px', fontSize: '13px', height: '31px', padding: '8px', marginLeft: '8px', textAlign: 'center'}} onFocus={(e) => this.setState({editingEndTime: true})} />}
            {(this.state.endTime || this.state.editingEndTime) && <input autoFocus type='time' style={{width: '86px', fontSize: '13px', height: '31px', padding: '8px', marginLeft: '8px', textAlign: 'center'}} onChange={(e) => this.handleChange(e, 'endTime')} onBlur={(e) => this.setState({editingEndTime: false})} />}
            {!this.state.endDate && !this.state.editingEndDate && <input type='text' placeholder='End Date' style={{width: '86px', fontSize: '13px', height: '31px', padding: '8px', marginLeft: '8px', textAlign: 'center'}} onFocus={(e) => this.setState({editingEndDate: true})} />}
            {(this.state.endDate || this.state.editingEndDate) && <div style={{display: 'inline-block', width: '86px', marginLeft: '8px'}} className='quickInputCalender'>
              <DatePicker
                autoFocus
                selected={this.state.endDate}
                onChange={(e) => this.setState({endDate: moment(e._d)})}
                onBlur={(e) => this.setState({editingEndDate: false})}
                minDate={moment(this.props.date)}
                maxDate={moment(this.props.dates[this.props.dates.length - 1])}
              />
            </div> }
          </div>
        </div>
        {/* <div style={{display: 'inline-block', width: '30%'}}> */}
          {/* IF DATES ARE PRESENT, USE DATETIMEPICKER */}
          {/* {this.props.dates &&
            <DateTimePicker intuitiveInput type='checkInTime' dates={this.props.dates} date={this.props.date} handleSelect={(type, day, time) => this.handleSelect(type, day, time)} />
          } */}
          {/* ELSE USE DROPDOWN FOR DAYS */}
          {/* {!this.props.dates &&
            <div>
              <select onChange={(e) => this.handleChange(e, 'checkInDay')} value={this.props.checkInDay}>
                {this.props.daysArr.map((day, i) => {
                  return (
                    <option key={i} value={day}>Day {day}</option>
                  )
                })}
              </select>
              <input type='time' value={this.state.checkInTimeString} onChange={(e) => this.handleChange(e, 'checkInTime')} />
            </div>
          }
        </div> */}
        {/* <div style={{display: 'inline-block', width: '30%'}}>
          <div style={{position: 'relative'}}>
            {this.props.dates &&
              <DateTimePicker intuitiveInput type='checkOutTime' dates={this.props.dates} date={this.props.date} handleSelect={(type, day, time) => this.handleSelect(type, day, time)} />
            }
            {!this.props.dates &&
              <div>
                <select onChange={(e) => this.handleChange(e, 'checkOutDay')} value={this.props.checkOutDay}>
                  {this.props.daysArr.map((day, i) => {
                    if (day >= this.state.checkInDay) {
                      return (
                        <option key={i} value={day}>Day {day}</option>
                      )
                    }
                  })}
                </select>
                <input type='time' value={this.state.checkOutTimeString} onChange={(e) => this.handleChange(e, 'checkOutTime')} />
              </div>
            }
          </div>
        </div> */}
        <div style={{marginTop: '6px', display: 'inline-block', textAlign: 'right', width: '100%'}}>
          <button onClick={() => this.handleSubmit()} style={{marginRight: '8px', backgroundColor: '#ed685a', border: 'none', color: 'white', height: '31px', fontSize: '13px', padding: '8px'}}>Submit</button>
          <button onClick={() => this.props.toggleIntuitiveInput()} style={{marginRight: '8px', backgroundColor: 'white', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', color: 'rgba(60, 58, 68, 0.7)', height: '31px', fontSize: '13px', padding: '8px'}}>Cancel</button>
          <button onClick={() => this.props.handleCreateEventClick('Lodging')} style={{backgroundColor: 'white', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', color: 'rgba(60, 58, 68, 0.7)', height: '31px', fontSize: '13px', padding: '8px'}}>More</button>
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
  graphql(createLodging, {name: 'createLodging'}),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'}),
  graphql(updateItineraryDetails, {name: 'updateItineraryDetails'})
)(Radium(IntuitiveLodgingInput)))
