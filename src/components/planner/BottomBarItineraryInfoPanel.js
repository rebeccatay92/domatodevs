import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import moment from 'moment'

import DatePicker from 'react-datepicker'
import CustomDateInput from './CustomDateInput'
import 'react-datepicker/dist/react-datepicker.css'

import { connect } from 'react-redux'
import { updateItinerary } from '../../actions/planner/itineraryActions'

class BottomBarItineraryInfoPanel extends Component {
  constructor (props) {
    super(props)
    // this.state = {
    //   name: props.itinerary.name || '',
    //   description: props.itinerary.description || '',
    //   days: props.itinerary.days,
    //   startDate: props.itinerary.startDate, // unix secs
    //   // countries: props.itinerary.countries
    // }
  }

  handleClickOutside () {
    this.props.closePanel()
  }

  handleChange (e, field) {
    // days, name, description
    this.props.updateItinerary(field, e.target.value)
  }

  onDateChange (e) {
    if (e) {
      let unix = moment(e._d).unix()
      // console.log('unix', unix)
      // this.setState({
      //   startDate: unix
      // })
      this.props.updateItinerary('startDate', unix)
    } else {
      // this.setState({
      //   startDate: null
      // })
      this.props.updateItinerary('startDate', null)
    }
  }

  render () {
    // console.log('itinerary details', this.props.itineraryDetails)
    return (
      <div style={{width: '334px', minhHeight: '340px', position: 'absolute', bottom: '51px', left: 'calc(50vw)', background: 'rgb(245, 245, 245)', padding: '0 8px', border: '1px solid rgba(60, 58, 68, 0.7)'}}>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', minHeight: '340px', boxSizing: 'border-box'}}>
          <h6 style={labelTextStyle}>Title</h6>
          <div style={{width: '100%', minHeight: '35px'}}>
            <input type='text' value={this.props.itineraryDetails.name} onChange={e => this.handleChange(e, 'name')} />
          </div>
          <hr style={{margin: 0, border: '1px solid rgba(60, 58, 68, 0.1)'}} />
          <h6 style={labelTextStyle}>Countries</h6>
          <div style={{width: '100%', minHeight: '35px'}}>
            {this.props.itineraryDetails.countries.map((country, i) => {
              return <button key={i}>{country.name}</button>
            })}
          </div>
          {/*CALL CREATECOUNTRIESITINERARIES / DELETECOUNTRIESITINERARIES DIRECTLY? */}
          <hr style={{margin: 0, border: '1px solid rgba(60, 58, 68, 0.1)'}} />
          <h6 style={labelTextStyle}>Days</h6>
          <div style={{width: '100%', minHeight: '35px'}}>
            <input type='number' value={this.props.itineraryDetails.days} onChange={e => this.handleChange(e, 'days')} />
          </div>
          <h6 style={labelTextStyle}>Start Date</h6>
          <DatePicker customInput={<CustomDateInput />} dateFormat={'ddd, DD MMM YYYY'} selected={this.props.itineraryDetails.startDate ? moment.unix(this.props.itineraryDetails.startDate).utc() : null} onChange={e => this.onDateChange(e)} isClearable />
          <hr style={{margin: 0, border: '1px solid rgba(60, 58, 68, 0.1)'}} />
          <h6 style={labelTextStyle}>Description</h6>
          <div style={{width: '100%', minHeight: '35px'}}>
            <textarea value={this.props.itineraryDetails.description} onChange={e => this.handleChange(e, 'description')} style={{width: '100%', height: '70px'}} />
          </div>
        </div>
        <div style={{width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '10px solid rgb(245, 245, 245)', position: 'absolute', left: '160px', zIndex: 2}} />
        <div style={{width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '10px solid rgba(60, 58, 68, 0.7)', position: 'absolute', left: '160px', bottom: '-11px', zIndex: 1}} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    itineraryDetails: state.itineraryDetails
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateItinerary: (field, value) => {
      dispatch(updateItinerary(field, value))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(onClickOutside(BottomBarItineraryInfoPanel))

const labelTextStyle = {
  margin: '8px 0 0 0',
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 300,
  fontSize: '14px',
  color: 'rgba(60, 58, 68, 0.7)'
}
