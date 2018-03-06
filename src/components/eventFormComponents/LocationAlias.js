import React, { Component } from 'react'

class LocationAlias extends Component {
  render () {
    return (
      <div>
        {this.props.placeholder &&
          <span>
            <label style={{fontSize: '1.2037037037vh', fontWeight: '400', marginBottom: '1.48148148148vh', lineHeight: '1.38888888889vh'}}>{this.props.placeholder}</label>
            <i style={{cursor: 'default', fontSize: '1.2037037037vh', verticalAlign: 'text-bottom', marginLeft: '0.41666666666vw', color: 'rgba(60, 58, 68, 0.3)'}} className='material-icons'>help_outline</i>
          </span>
        }
        {!this.props.placeholder &&
        <label>Location</label>
        }
        <input className='form-input' style={{width: '100%', color: 'rgba(60, 58, 68, 0.7)', fontSize: '1.2037037037vh', padding: '0.74074074074vh 0.41666666666vw', fontWeight: '300', height: '2.87037037037vh', marginBottom: '1.48148148148vh'}} type='text' name='locationAlias' placeholder='(Optional)' value={this.props.locationAlias} onChange={(e) => this.props.handleChange(e)} />
      </div>
    )
  }
}

export default LocationAlias
