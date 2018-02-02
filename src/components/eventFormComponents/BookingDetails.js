import React, { Component } from 'react'

const labelStyle = {
  fontSize: '13px',
  display: 'block',
  margin: '5px',
  lineHeight: '26px'
}

class BookingDetails extends Component {
  render () {
    if (this.props.flight) {
      return (
        <div>
          <div style={{display: 'inline-block', width: '50%'}}>
            <label style={labelStyle}>
              Booking Service
            </label>
            <input style={{width: '90%'}} type='text' name='bookedThrough' value={this.props.bookedThrough} onChange={(e) => this.props.handleChange(e, 'bookedThrough')} />
            <label style={labelStyle}>
              Confirmation Number
            </label>
            <input style={{width: '90%'}} type='text' name='bookingConfirmation' value={this.props.bookingConfirmation} onChange={(e) => this.props.handleChange(e, 'bookingConfirmation')} />
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
          <div style={{display: 'inline-block', width: '50%'}}>
            <label style={labelStyle}>
              Booking Service
            </label>
            <input style={{width: '90%'}} type='text' name='bookedThrough' value={this.props.bookedThrough} onChange={(e) => this.props.handleChange(e, 'bookedThrough')} />
          </div>
          <div style={{display: 'inline-block', width: '50%'}}>
            <label style={labelStyle}>
              Amount:
            </label>
            <select style={{height: '25px', borderRight: '0', background: 'white', width: '30%'}} name='currency' value={this.props.currency} onChange={(e) => this.props.handleChange(e, 'currency')}>
              {this.props.currencyList.map((e, i) => {
                return <option key={i}>{e}</option>
              })}
            </select>
            <input style={{width: '70%'}} type='number' name='cost' value={this.props.cost} onChange={(e) => this.props.handleChange(e, 'cost')} />
          </div>
          <div>
            <label style={labelStyle}>
              Confirmation Number
            </label>
            <input style={{width: '100%'}} type='text' name='bookingConfirmation' value={this.props.bookingConfirmation} onChange={(e) => this.props.handleChange(e, 'bookingConfirmation')} />
          </div>
        </div>
      )
    }
  }
}

export default BookingDetails
