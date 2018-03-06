import React, { Component } from 'react'

const labelStyle = {
  fontSize: '1.2037037037vh',
  fontWeight: '400',
  display: 'block',
  marginBottom: '1.48148148148vh',
  lineHeight: '1.38888888889vh'
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
            <input style={{width: '10.625vw', fontSize: '1.2037037037vh', padding: '0.74074074074vh 0.41666666666vw', fontWeight: '300'}} type='text' name='bookedThrough' value={this.props.bookedThrough} onChange={(e) => this.props.handleChange(e, 'bookedThrough')} />
            <label style={labelStyle}>
              Confirmation Number
            </label>
            <input style={{width: '10.625vw', fontSize: '1.2037037037vh', padding: '0.74074074074vh 0.41666666666vw', fontWeight: '300'}} type='text' name='bookingConfirmation' value={this.props.bookingConfirmation} onChange={(e) => this.props.handleChange(e, 'bookingConfirmation')} />
          </div>
          <div style={{display: 'inline-block', width: '50%', verticalAlign: 'top'}}>
            <label style={labelStyle}>
              Cost:
            </label>
            <select style={{height: '2.31481481481vh', borderRight: '0', background: 'white', width: '30%'}} name='currency' value={this.props.currency} onChange={(e) => this.props.handleChange(e, 'currency')}>
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
            <input style={{color: 'rgba(60, 58, 68, 0.7)', width: '10.4166666667vw', fontSize: '1.2037037037vh', padding: '0.74074074074vh 0.41666666666vw', fontWeight: '300', height: '2.87037037037vh', marginBottom: '1.48148148148vh'}} type='text' name='bookedThrough' value={this.props.bookedThrough} onChange={(e) => this.props.handleChange(e, 'bookedThrough')} />
          </div>
          <div style={{display: 'inline-block', marginLeft: '1.25vw'}}>
            <label style={labelStyle}>
              Amount:
            </label>
            <select style={{color: 'rgba(60, 58, 68, 0.7)', height: '2.87037037037vh', outline: '1px solid rgba(60, 58, 68, 0.2)', border: 'none', background: 'white', width: '3.28125vw', padding: '0 0.41666666666vw', fontSize: '1.2037037037vh', fontWeight: '300'}} name='currency' value={this.props.currency} onChange={(e) => this.props.handleChange(e, 'currency')}>
              {this.props.currencyList.map((e, i) => {
                return <option key={i}>{e}</option>
              })}
            </select>
            <input style={{color: 'rgba(60, 58, 68, 0.7)', width: '7.13541666667vw', fontSize: '1.2037037037vh', padding: '0.74074074074vh 0.41666666666vw', fontWeight: '300', height: '2.87037037037vh', marginBottom: '1.48148148148vh'}} type='number' name='cost' value={this.props.cost} onChange={(e) => this.props.handleChange(e, 'cost')} />
          </div>
          <div>
            <label style={labelStyle}>
              Confirmation Number
            </label>
            <input style={{color: 'rgba(60, 58, 68, 0.7)', width: '100%', fontSize: '1.2037037037vh', padding: '0.74074074074vh 0.41666666666vw', fontWeight: '300', height: '2.87037037037vh', marginBottom: '1.48148148148vh'}} type='text' name='bookingConfirmation' value={this.props.bookingConfirmation} onChange={(e) => this.props.handleChange(e, 'bookingConfirmation')} />
          </div>
        </div>
      )
    }
  }
}

export default BookingDetails
