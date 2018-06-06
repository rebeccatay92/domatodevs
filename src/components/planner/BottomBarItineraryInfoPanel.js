import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import CustomDateInput from './CustomDateInput'
import 'react-datepicker/dist/react-datepicker.css'

class BottomBarItineraryInfoPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: props.itinerary.name || '',
      description: props.itinerary.description || '',
      days: props.itinerary.days,
      startDate: props.itinerary.startDate, // unix secs
      // countries: props.itinerary.countries
    }
  }

  handleClickOutside () {
    this.props.onClickOutside()
  }

  handleChange (e, field) {
    this.setState({
      [field]: e.target.value
    })
  }

  onDateChange (e) {
    if (e) {
      let unix = moment(e._d).unix()
      // console.log('unix', unix)
      this.setState({
        startDate: unix
      })
    } else {
      this.setState({
        startDate: null
      })
    }
  }

  render () {
    // console.log('itinerary', this.props.itinerary)
    return (
      <div style={{width: '334px', minhHeight: '340px', position: 'absolute', bottom: '51px', left: 'calc(50vw)', background: 'rgb(245, 245, 245)', padding: '0 8px', border: '1px solid rgba(60, 58, 68, 0.7)'}}>
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', minHeight: '340px', boxSizing: 'border-box'}}>
          <h6 style={labelTextStyle}>Title</h6>
          <div style={{width: '100%', minHeight: '35px'}}>
            <input type='text' value={this.state.name} onChange={e => this.handleChange(e, 'name')} />
          </div>
          <hr style={{margin: 0, border: '1px solid rgba(60, 58, 68, 0.1)'}} />
          <h6 style={labelTextStyle}>Countries</h6>
          <div style={{width: '100%', minHeight: '35px'}}>
            {this.props.itinerary.countries.map((country, i) => {
              return <button key={i}>{country.name}</button>
            })}
          </div>
          <hr style={{margin: 0, border: '1px solid rgba(60, 58, 68, 0.1)'}} />
          <h6 style={labelTextStyle}>Days</h6>
          <div style={{width: '100%', minHeight: '35px'}}>
            <input type='number' value={this.state.days} onChange={e => this.handleChange(e, 'days')} />
          </div>
          <h6 style={labelTextStyle}>Start Date</h6>
          <DatePicker customInput={<CustomDateInput />} dateFormat={'ddd, DD MMM YYYY'} selected={this.state.startDate ? moment.unix(this.state.startDate).utc() : null} onChange={e => this.onDateChange(e)} isClearable />
          <hr style={{margin: 0, border: '1px solid rgba(60, 58, 68, 0.1)'}} />
          <h6 style={labelTextStyle}>Description</h6>
          <div style={{width: '100%', minHeight: '35px'}}>
            <textarea value={this.state.description} onChange={e => this.handleChange(e, 'description')} style={{width: '100%', height: '70px'}} />
          </div>
        </div>
        <div style={{width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '10px solid rgb(245, 245, 245)', position: 'absolute', left: '160px', zIndex: 2}} />
        <div style={{width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '10px solid rgba(60, 58, 68, 0.7)', position: 'absolute', left: '160px', bottom: '-11px', zIndex: 1}} />
      </div>
    )
  }
}

export default onClickOutside(BottomBarItineraryInfoPanel)

const labelTextStyle = {
  margin: '8px 0 0 0',
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 300,
  fontSize: '14px',
  color: 'rgba(60, 58, 68, 0.7)'
}
