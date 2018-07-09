import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'

import { graphql } from 'react-apollo'
import { createBucket } from '../../apollo/bucket'

class SaveToBucketMenu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      notes: '',
      eventType: this.props.eventType || '',
      bucketCategory: 'Location'
    }
  }

  handleClickOutside (evt) {
    // console.log('click outside', evt)
    this.setState({
      notes: '',
      eventType: '',
      bucketCategory: 'Location'
    })
    this.props.closeSaveToBucketMenu()
  }

  handleSaveToBucket () {
    // console.log('props post', this.props.post)
    // send req to backend with UserId, LocationId, eventType, notes, bucketCategory, thumbnailUrl
    let {location, media} = this.props.post
    let thumbnailUrl
    if (location) {
      // console.log('location id', location.id)
      if (media.length) {
        // console.log('thumbnailUrl', media[0].imageUrl)
        thumbnailUrl = media[0].imageUrl
      }
      let bucketObj = {
        // let user id depend on context
        LocationId: location.id,
        notes: this.state.notes,
        eventType: this.state.eventType,
        bucketCategory: this.state.bucketCategory,
        thumbnailUrl: thumbnailUrl
      }
      // console.log('bucketObj', bucketObj)

      this.props.createBucket({
        variables: bucketObj
      })
        .then(response => {
          console.log('response', response)
        })
    }
  }

  render () {
    return (
      <div style={{width: '336px', height: '181px', background: 'white', border: '1px solid rgb(219, 219, 219)', position: 'absolute', left: '25px', padding: '12px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16)'}}>
        <h6 style={{margin: 0, fontFamily: 'Roboto, sans-serif', fontSize: '16px', fontWeight: 400, lineHeight: '26px', color: 'rgb(95, 93, 102)'}}>Write a note</h6>
        <input type='text' value={this.state.notes} onChange={e => this.setState({notes: e.target.value})} placeholder={'Notes'} style={{width: '100%', fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '13px', lineHeight: '26px', color: 'rgb(60, 58, 68)', outline: 'none', borderBottom: '1px solid rgb(219, 219, 219)'}} />
        <h6 style={{margin: '14px 0 0 0', fontFamily: 'Roboto, sans-serif', fontSize: '16px', fontWeight: 400, lineHeight: '26px', color: 'rgb(95, 93, 102)'}}>Event</h6>
        <input type='text' value={this.state.eventType} onChange={e => this.setState({eventType: e.target.value})} placeholder={'Type of event'} style={{display: 'inline-block', width: '213px', fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '13px', lineHeight: '26px', color: 'rgb(60, 58, 68)', outline: 'none', borderBottom: '1px solid rgb(219, 219, 219)'}} />
        <select value={this.state.bucketCategory} onChange={e => this.setState({bucketCategory: e.target.value})} style={{fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '13px', border: 'none', outline: 'none', color: 'rgb(60, 58, 68)', background: 'transparent'}}>
          <option value='Location'>Location</option>
          <option value='Activity'>Activity</option>
          <option value='Food'>Food</option>
          <option value='Lodging'>Lodging</option>
          <option value='Flight'>Flight</option>
          <option value='Transport'>Transport</option>
        </select>

        <button style={{fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '13px', marginTop: '17px', background: 'transparent', border: 'none', color: 'rgb(250, 51, 82)', outline: 'none'}} onClick={() => this.handleSaveToBucket()}>Save</button>
        <button style={{fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: '13px', marginTop: '17px', background: 'transparent', border: 'none', color: 'rgb(60, 58, 68)', outline: 'none'}} onClick={() => this.handleClickOutside()}>Cancel</button>
      </div>
    )
  }
}

export default graphql(createBucket, {name: 'createBucket'})(onClickOutside(SaveToBucketMenu))
