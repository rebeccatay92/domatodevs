import React, { Component } from 'react'

const labelStyle = {
  fontSize: '13px',
  fontWeight: '400',
  display: 'block',
  marginBottom: '16px',
  lineHeight: '15px'
}

class BookingDetails extends Component {
  render () {
    if (this.props.flight) {
      return (
        <div>
          <div style={{display: 'inline-block'}}>
            <label style={labelStyle}>
              Booking Service
            </label>
            <input style={{width: '204px', fontSize: '13px', padding: '8px', fontWeight: '300'}} type='text' name='bookedThrough' value={this.props.bookedThrough} onChange={(e) => this.props.handleChange(e, 'bookedThrough')} />
            <label style={labelStyle}>
              Confirmation Number
            </label>
            <input style={{width: '204px', fontSize: '13px', padding: '8px', fontWeight: '300'}} type='text' name='bookingConfirmation' value={this.props.bookingConfirmation} onChange={(e) => this.props.handleChange(e, 'bookingConfirmation')} />
          </div>
          <div style={{display: 'inline-block', width: '50%', verticalAlign: 'top'}}>
            <label style={labelStyle}>
              Cost:
            </label>
            <select style={{height: '25px', borderRight: '0', background: 'white', width: '30%'}} name='currency' value={this.props.currency} onChange={(e) => this.props.handleChange(e, 'currency')}>
              {this.props.currencyList.map((e, i) => {
                return <option key={i}>{e}</option>
              })}
            </select>
            <input style={{width: '70%'}} type='number' name='cost' value={this.props.cost} onChange={(e) => this.props.handleChange(e, 'cost')} />
          </div>
          <hr />
        </div>
      )
    } else {
      return (
        <div>
          <div style={{display: 'inline-block'}}>
            <label style={labelStyle}>
              Booking Service
            </label>
            <input style={{color: 'rgba(60, 58, 68, 0.7)', width: '200px', fontSize: '13px', padding: '8px', fontWeight: '300', height: '31px', marginBottom: '16px'}} type='text' name='bookedThrough' value={this.props.bookedThrough} onChange={(e) => this.props.handleChange(e, 'bookedThrough')} />
          </div>
          <div style={{display: 'inline-block', marginLeft: '24px'}}>
            <label style={labelStyle}>
              Amount:
            </label>
            <select style={{color: 'rgba(60, 58, 68, 0.7)', height: '31px', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', background: 'white', width: '63px', padding: '8px', fontSize: '13px', fontWeight: '300'}} name='currency' value={this.props.currency} onChange={(e) => this.props.handleChange(e, 'currency')}>
              {this.props.currencyList.map((e, i) => {
                return <option key={i}>{e}</option>
              })}
            </select>
            <input style={{color: 'rgba(60, 58, 68, 0.7)', width: '137px', fontSize: '13px', padding: '8px', fontWeight: '300', height: '31px', marginBottom: '16px'}} type='number' name='cost' value={this.props.cost} onChange={(e) => this.props.handleChange(e, 'cost')} />
          </div>
          <div>
            <label style={labelStyle}>
              Confirmation Number
            </label>
            <input style={{color: 'rgba(60, 58, 68, 0.7)', width: '100%', fontSize: '13px', padding: '8px', fontWeight: '300', height: '31px', marginBottom: '16px'}} type='text' name='bookingConfirmation' value={this.props.bookingConfirmation} onChange={(e) => this.props.handleChange(e, 'bookingConfirmation')} />
          </div>
        </div>
      )
    }
  }
}

export default BookingDetails
