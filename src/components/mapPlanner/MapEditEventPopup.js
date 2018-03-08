import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clearCurrentlyFocusedEvent } from '../../actions/mapPlannerActions'

import MapDateTimePicker from './MapDateTimePicker'
import MapOpeningHoursDropdown from './MapOpeningHoursDropdown'
import MapArrivalSearchDropdown from './MapArrivalSearchDropdown'
import MapEventToggles from './MapEventToggles'

import moment from 'moment'
import { Button } from 'react-bootstrap'
const _ = require('lodash')

const mapInfoBoxButtonStyle = {marginRight: '8px', marginBottom: '8px', backgroundColor: 'white', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', color: 'rgba(60, 58, 68, 0.7)', height: '30px', fontSize: '12px', padding: '6px'}

class MapEditEventPopup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      eventType: 'Activity', // fixed event type
      googlePlaceData: null, // obj holding current marker location. might be location, or arrival or departure location. ie this is departureLocation for a transport start:true row.
      departureGooglePlaceData: null, // transport/flight
      arrivalGooglePlaceData: null,
      start: null, // is clickedMarker a startingRow?
      startDay: 1,
      endDay: 1,
      startTime: null,
      endTime: null,
      description: '', // activity, food, lodging
      showAllOpeningHours: false, // openingHours dropdown toggle
      openingHoursStr: ''
    }
  }

  componentDidMount () {
    var marker = this.props.marker
    var eventType = marker.eventType

    if (eventType !== 'Flight') {
      var event = this.props.marker.event
    } else {
      event = this.props.marker.event.FlightInstance
    }
    // console.log('marker', marker)
    // console.log('event row', event)

    var startDay = event.startDay
    var endDay = event.endDay
    var startTime = event.startTime
    var endTime = event.endTime
    if (eventType === 'Activity' || eventType === 'Food' || eventType === 'Lodging') {
      var description = event.description
      var googlePlaceData = marker.location
    }
    if (eventType === 'LandTransport' || eventType === 'Flight') {
      // check marker start is true or false to assign either departure or arrival to location.
      if (marker.start) {
        googlePlaceData = event.departureLocation
        var start = true
      } else {
        googlePlaceData = event.arrivalLocation
        start = false
      }
      var arrivalGooglePlaceData = event.arrivalLocation
      var departureGooglePlaceData = event.departureLocation
    }

    this.setState({
      eventType,
      startDay,
      endDay,
      startTime,
      endTime,
      description,
      googlePlaceData,
      arrivalGooglePlaceData,
      departureGooglePlaceData,
      start
    }, () => {
      this.findOpeningHoursText()
    })
  }

  toggleOpeningHoursInfo () {
    this.setState({showAllOpeningHours: !this.state.showAllOpeningHours})
  }

  findOpeningHoursText () {
    // datesArr here is in secs, not millisecs. cannot use helper.
    if (this.props.datesArr) {
      var dayInt = this.state.startDay
      var dateUnix = this.props.datesArr[dayInt - 1]
      var momentObj = moment.unix(dateUnix)
      var dayStr = momentObj.format('dddd')
      if (this.state.googlePlaceData.openingHoursText) {
        var textArr = this.state.googlePlaceData.openingHoursText.filter(e => {
          return e.indexOf(dayStr) > -1
        })
        var openingHoursStr = textArr[0]
      }
    } else {
      if (this.state.googlePlaceData.openingHoursText) {
        textArr = this.state.googlePlaceData.openingHoursText.filter(e => {
          return e.indexOf('Monday') > -1
        })
        openingHoursStr = textArr[0]
      }
    }
    // console.log('str', openingHoursStr)
    this.setState({openingHoursStr: openingHoursStr})
  }

  closePlannerPopup () {
    console.log('close planner popup. ie remove focus')
    this.props.clearCurrentlyFocusedEvent()
  }

  toggleEditEventForm () {
    console.log('open edit form')
  }

  handleSubmit () {
    // save edits. send apollo req
    console.log('save edits')
  }

  render () {
    if (!this.state.googlePlaceData) return <span>Loading</span>
    var place = this.state.googlePlaceData
    return (
      <div>
        <div style={{width: '100%'}}>
          {typeof (this.state.start) === 'boolean' && this.state.start &&
            <span style={{fontSize: '16px'}}>{place.name} (Departure)</span>
          }
          {typeof (this.state.start) === 'boolean' && !this.state.start &&
            <span style={{fontSize: '16px'}}>{place.name} (Arrival)</span>
          }
          {typeof (this.state.start) !== 'boolean' &&
            <span style={{fontSize: '16px'}}>{place.name}</span>
          }

          {/* OPENING HOURS */}
          <div>
            <h5 style={{display: 'inline-block', fontSize: '12px', marginRight: '10px'}}>Opening hours: </h5>
            {place.openingHoursText && place.openingHoursText.length &&
              <div style={{display: 'inline-block'}} onClick={() => this.toggleOpeningHoursInfo()}>
                <div style={{display: 'inline-block', cursor: 'pointer', width: '180px'}} className={'ignoreOpeningHoursDropdownArrow'}>
                  <span style={{fontSize: '10px'}}>{this.state.openingHoursStr}</span>
                  <i className='material-icons' style={{display: 'inline-block', verticalAlign: 'middle', float: 'right'}}>arrow_drop_down</i>
                </div>
                {this.state.showAllOpeningHours &&
                  <MapOpeningHoursDropdown textArr={place.openingHoursText} toggleOpeningHoursInfo={() => this.toggleOpeningHoursInfo()} outsideClickIgnoreClass={'ignoreOpeningHoursDropdownArrow'} />
                }
              </div>
            }
            {!place.openingHoursText &&
              <h5 style={{display: 'inline-block', fontSize: '12px'}}>Not Available</h5>
            }
          </div>

          {/* DESCRIPTION OR LOCATION INPUT */}

          <div style={{width: '100%'}}>
            {/* {(this.state.eventType === 'Activity' || this.state.eventType === 'Food' || this.state.eventType === 'Lodging') &&
              <div>
                <h5 style={{fontSize: '12px'}}>Description</h5>
                <input type='text' placeholder='Optional description' onChange={(e) => this.handleChange(e, 'description')} style={{backgroundColor: 'white', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', color: 'rgba(60, 58, 68, 1)', height: '30px', fontSize: '12px', padding: '6px', width: '100%'}} />
              </div>
            } */}

            {/* {this.state.eventType === 'LandTransport' &&
              <div>
                <h5 style={{fontSize: '12px'}}>Arrival Location</h5>
                <input type='text' placeholder='Search for an arrival location' value={this.state.arrivalSearch} onFocus={() => this.onArrivalSearchFocus()} onChange={(e) => this.handleChange(e, 'arrivalSearch')} onKeyUp={() => this.customDebounce()} style={{backgroundColor: 'white', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', color: 'rgba(60, 58, 68, 1)', height: '30px', fontSize: '12px', padding: '6px', width: '90%'}} className={'ignoreArrivalSearchInput'} />
                <i className='material-icons' style={{display: 'inline-block', fontSize: '20px', verticalAlign: 'middle', cursor: 'pointer'}} onClick={() => this.clearSearch()}>clear</i>

                {this.state.isArrivalSearching && this.state.arrivalSearchResults.length > 0 &&
                  <div style={{width: '100%', padding: '6px', maxHeight: '120px', overflowY: 'scroll', background: 'white', position: 'absolute', zIndex: '2', border: '1px solid grey'}}>

                    <MapArrivalSearchDropdown outsideClickIgnoreClass={'ignoreArrivalSearchInput'} arrivalSearchResults={this.state.arrivalSearchResults} closeSearchDropdown={() => this.closeSearchDropdown()} selectArrivalLocation={(place) => this.selectArrivalLocation(place)} />
                  </div>
                }
              </div>
            } */}
          </div>

          {/* START / END DATE/DAY/TIME */}
          {/* <MapDateTimePicker daysArr={this.props.daysArr} datesArr={this.props.datesArr} startDay={this.state.startDay} endDay={this.state.endDay} handleChange={(e, field) => this.handleChange(e, field)} /> */}
        </div>

        <MapEventToggles formType={'edit'} eventType={this.state.eventType} />

        <div style={{position: 'absolute', right: '0', bottom: '0'}}>
          <Button bsStyle='danger' style={mapInfoBoxButtonStyle} onClick={() => this.handleSubmit()}>Submit</Button>
          <Button bsStyle='default' style={mapInfoBoxButtonStyle} onClick={() => this.closePlannerPopup()}>Cancel</Button>
          <Button bsStyle='default' style={mapInfoBoxButtonStyle} onClick={() => this.toggleEditEventForm()} >More</Button>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearCurrentlyFocusedEvent: () => {
      dispatch(clearCurrentlyFocusedEvent())
    }
  }
}

export default connect(null, mapDispatchToProps)(MapEditEventPopup)
