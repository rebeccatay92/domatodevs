import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import { WithOutContext as ReactTags } from 'react-tag-input'
import moment from 'moment'

import DatePicker from 'react-datepicker'
import CustomDateInput from './CustomDateInput'
import 'react-datepicker/dist/react-datepicker.css'

import { connect } from 'react-redux'
import { updateItinerary } from '../../actions/planner/itineraryActions'

import countries from '../../data/countries.json'

class BottomBarItineraryInfoPanel extends Component {
  // constructor (props) {
  //   super(props)
  //   this.state = {
  //     name: props.itinerary.name || '',
  //     description: props.itinerary.description || '',
  //     days: props.itinerary.days,
  //     startDate: props.itinerary.startDate, // unix secs
  //     // countries: props.itinerary.countries
  //   }
  // }

  constructor (props) {
    super(props)

    this.state = {
      suggestions: countries.map(country => {
        return {
          ...country,
          ...{id: country.id.toString(), text: country.name}
        }
      })
    }
  }

  handleClickOutside () {
    this.props.closePanel()
  }

  handleChange (e, field) {
    // days, name, description
    if (field === 'days') {
      this.props.updateItinerary(field, parseInt(e.target.value))
    } else {
      this.props.updateItinerary(field, e.target.value)
    }
  }

  onDateChange (e) {
    if (e) {
      let unix = moment(e._d).unix()
      this.props.updateItinerary('startDate', unix)
    } else {
      this.props.updateItinerary('startDate', null)
    }
  }

  handleCountryAddition (tag) {
    if (this.props.itineraryDetails.countries.map(obj => obj.text).includes(tag.text) || this.state.suggestions.filter(country => country.text === tag.text).length < 1) return
    this.props.updateItinerary('countries', [...this.props.itineraryDetails.countries, ...[tag]])
  }

  handleCountryDelete (i, e) {
    if (e.keyCode === 8) return
    this.props.updateItinerary('countries', this.props.itineraryDetails.countries.filter((country, index) => index !== i))
  }

  render () {
    // console.log('itinerary details', this.props.itineraryDetails)
    return (
      <div style={{width: '334px', minhHeight: '340px', position: 'absolute', bottom: '51px', left: 'calc(50vw)', background: 'rgb(245, 245, 245)', padding: '0 8px', border: '1px solid rgba(60, 58, 68, 0.7)'}}>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', minHeight: '340px', boxSizing: 'border-box'}}>
          <h6 style={labelTextStyle}>Title</h6>
          <div style={{width: '100%', minHeight: '35px'}}>
            <input type='text' value={this.props.itineraryDetails.name} onChange={e => this.handleChange(e, 'name')} style={{background: 'rgb(245, 245, 245)', border: 'none', height: '35px', outline: 'none', fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', color: 'rgb(60, 58, 68)'}} />
          </div>
          <hr style={{margin: 0, border: '1px solid rgba(60, 58, 68, 0.1)'}} />
          <h6 style={labelTextStyle}>Countries</h6>
          <div className='itinerary-info-countries' style={{width: '100%', minHeight: '35px'}}>
            <ReactTags autofocus={false} suggestions={this.state.suggestions} delimiters={[13, 9]} inline placeholder='Add new country' tags={this.props.itineraryDetails.countries} handleDelete={(i, e) => this.handleCountryDelete(i, e)} handleAddition={(tag) => this.handleCountryAddition(tag)} />
          </div>
          {/* CALL CREATECOUNTRIESITINERARIES / DELETECOUNTRIESITINERARIES DIRECTLY? */}
          <hr style={{margin: 0, border: '1px solid rgba(60, 58, 68, 0.1)'}} />
          <h6 style={labelTextStyle}>Days</h6>
          <div style={{width: '100%', minHeight: '35px'}}>
            <input type='number' value={this.props.itineraryDetails.days} min='1' max='30' onChange={e => this.handleChange(e, 'days')} style={{background: 'rgb(245, 245, 245)', border: 'none', height: '35px', outline: 'none', fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', color: 'rgb(60, 58, 68)'}} />
          </div>
          <h6 style={labelTextStyle}>Start Date</h6>
          <DatePicker customInput={<CustomDateInput />} dateFormat={'ddd, DD MMM YYYY'} selected={this.props.itineraryDetails.startDate ? moment.unix(this.props.itineraryDetails.startDate).utc() : null} onChange={e => this.onDateChange(e)} isClearable />
          <hr style={{margin: 0, border: '1px solid rgba(60, 58, 68, 0.1)'}} />
          <h6 style={labelTextStyle}>Description</h6>
          <div style={{width: '100%', minHeight: '35px'}}>
            <textarea value={this.props.itineraryDetails.description} onChange={e => this.handleChange(e, 'description')} style={{width: '100%', height: '70px', background: 'rgb(245, 245, 245)', border: 'none', fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', lineHeight: '24px', color: 'rgb(60, 58, 68)', outline: 'none'}} />
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
