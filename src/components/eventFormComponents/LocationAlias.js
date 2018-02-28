import React, { Component } from 'react'

class LocationAlias extends Component {
  render () {
    return (
      <div>
        {this.props.placeholder &&
          <span>
            <label style={{fontSize: '13px', fontWeight: '400', marginBottom: '16px'}}>{this.props.placeholder}</label>
            <i style={{fontSize: '13px', verticalAlign: 'text-bottom', marginLeft: '8px', color: 'rgba(60, 58, 68, 0.3)'}} className='material-icons'>help_outline</i>
          </span>
        }
        {!this.props.placeholder &&
        <label>Location</label>
        }
        <input className='form-input' style={{width: '100%', color: 'rgba(60, 58, 68, 0.7)', fontSize: '13px', padding: '8px', fontWeight: '300', height: '31px', marginBottom: '16px'}} type='text' name='locationAlias' placeholder='(Optional)' value={this.props.locationAlias} onChange={(e) => this.props.handleChange(e)} />
      </div>
    )
  }
}

export default LocationAlias
