import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'

import { graphql, compose } from 'react-apollo'
import { updateBucket, getUserBucketList, deleteBucket } from '../../apollo/bucket'

import { connect } from 'react-redux'
import { openConfirmWindow } from '../../actions/confirmWindowActions'

import { BucketRowStyles as styles } from '../../Styles/BucketRowStyles'

class BucketRow extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editing: false,
      bucketCategory: '',
      visited: false,
      eventType: '',
      notes: '',
      thumbnailUrl: '',
      locationName: ''
    }
  }

  handleClickOutside () {
    if (this.state.editing && !this.props.confirmWindow.open) {
      // click outside behaviour only if user is editing. confirm window clicking is not considered outside
      console.log('click outside. undo changes')
      this.setState({
        editing: false,
        bucketCategory: this.props.bucket.bucketCategory,
        eventType: this.props.bucket.eventType || '',
        visited: this.props.bucket.visited || false,
        notes: this.props.bucket.notes || '',
        thumbnailUrl: this.props.bucket.thumbnailUrl || '',
        locationName: this.props.bucket.location.name
      })
    }
  }

  enableEditing () {
    this.setState({editing: true})
  }

  saveChanges () {
    let updatesObj = {
      id: this.props.bucket.id,
      bucketCategory: this.state.bucketCategory,
      eventType: this.state.eventType,
      notes: this.state.notes,
      visited: this.state.visited
    }
    // console.log('updates for backend', updatesObj)
    this.props.updateBucket({
      variables: updatesObj,
      refetchQueries: [{
        query: getUserBucketList
      }]
    })
      .then(response => {
        console.log('response', response)
      })

    this.setState({
      editing: false
    })
  }

  confirmDelete () {
    this.props.openConfirmWindow({
      message: 'Are you sure you want to remove this from your bucket list?',
      secondaryMessage: '',
      confirmMessage: 'Yes'
    })
  }

  deleteBucket () {
    if (this.state.editing) {
      // only the currently editing row is the one to be deleted
      // prevents all rows from triggering?
      console.log('send backend to delete, id is', this.props.bucket.id)
      this.props.deleteBucket({
        variables: {
          id: this.props.bucket.id
        },
        refetchQueries: [{
          query: getUserBucketList
        }]
      })
        .then(() => {
          this.setState({
            editing: false
          })
        })
    }
  }

  componentDidMount () {
    let bucket = this.props.bucket
    this.setState({
      bucketCategory: bucket.bucketCategory,
      eventType: bucket.eventType || '',
      visited: bucket.visited || false,
      notes: bucket.notes || '',
      thumbnailUrl: bucket.thumbnailUrl || '',
      locationName: bucket.location.name
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.bucket !== this.props.bucket) {
      this.setState({
        bucketCategory: nextProps.bucket.bucketCategory,
        eventType: nextProps.bucket.eventType || '',
        visited: nextProps.bucket.visited || false,
        notes: nextProps.bucket.notes || '',
        thumbnailUrl: nextProps.bucket.thumbnailUrl || '',
        locationName: nextProps.bucket.location.name
      })
    }
    if (nextProps.confirmWindow !== this.props.confirmWindow) {
      if (!nextProps.confirmWindow.open && nextProps.confirmWindow.confirmClicked) {
        console.log('confirm clicked')
        // ALL THE ROWS ARE LISTENING TO THE SAME CONFIRM WINDOW. IT WILL TRIGGER DELETE FOR ALL.
        this.deleteBucket()
      } else if (!nextProps.confirmWindow.open && !nextProps.confirmWindow.confirmClicked) {
        console.log('cancelled')
      }
    }
  }

  render () {
    let category = {
      'Activity': 'directions_run',
      'Food': 'restaurant',
      'Location': 'place',
      'Lodging': 'hotel',
      'Flight': 'flight',
      'Transport': 'directions_subway'
    }
    return (
      <div style={styles.bucketRowContainer}>
        <div style={{width: '100px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          {this.state.editing &&
            <select value={this.state.bucketCategory} onChange={e => this.setState({bucketCategory: e.target.value})}>
              <option value='Location'>Location</option>
              <option value='Activity'>Activity</option>
              <option value='Food'>Food</option>
              <option value='Lodging'>Lodging</option>
              <option value='Flight'>Flight</option>
              <option value='Transport'>Transport</option>
            </select>
          }
          {!this.state.editing &&
            <i className='material-icons' style={{fontSize: '24px'}}>{category[this.state.bucketCategory]}</i>
          }
          {this.state.editing && !this.state.visited &&
            <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}} onClick={() => this.setState({visited: true})}>
              <span>Not visited</span>
              <i className='material-icons' style={{fontSize: '24px'}}>check_box_outline_blank</i>
            </div>
          }
          {this.state.editing && this.state.visited &&
            <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}} onClick={() => this.setState({visited: false})}>
              <span>Visited</span>
              <i className='material-icons' style={{fontSize: '24px'}}>check_box</i>
            </div>
          }
          {!this.state.editing && !this.state.visited &&
            <div style={{display: 'flex', alignItems: 'center'}}>
              <span>Not visited</span>
              {/* <i className='material-icons' style={{fontSize: '24px'}}>check_box_outline_blank</i> */}
            </div>
          }
          {!this.state.editing && this.state.visited &&
            <div style={{display: 'flex', alignItems: 'center'}}>
              <span>Visited</span>
              {/* <i className='material-icons' style={{fontSize: '24px'}}>check_box</i> */}
            </div>
          }
          {/* <span style={{display: 'block'}}>10 adds</span> */}
        </div>
        <div style={{width: '60px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <img src={this.state.thumbnailUrl} style={{height: '60px', width: '60px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16)'}} />
        </div>
        <div style={{width: '260px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', paddingLeft: '24px'}}>
          <h6 style={{margin: '0 0 8px 0', fontFamily: 'EB Garamond, serif', fontWeight: 400, fontSize: '24px', color: 'rgb(60, 58, 68)', lineHeight: '32px'}}>{this.state.locationName}</h6>
          {!this.state.editing &&
            <h6 style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', color: 'rgb(60, 58, 68)', margin: 0, lineHeight: '20px'}}>{this.state.eventType}</h6>
          }
          {this.state.editing &&
            <input type='text' value={this.state.eventType} placeholder={'Event Type'} style={{width: '212px', height: '20px', fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', color: 'rgb(60, 58, 68)'}} onChange={e => this.setState({eventType: e.target.value})} />
          }
        </div>
        <div style={{width: '550px', height: '100%', display: 'flex', alignItems: 'center', padding: '0 24px'}}>
          {!this.state.editing &&
            <h6 style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', color: 'rgb(60, 58, 68)'}}>{this.state.notes}</h6>
          }
          {this.state.editing &&
            <textarea value={this.state.notes} placeholder={'Enter notes here'} style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', color: 'rgb(60, 58, 68)', height: '60px', width: 'calc(550px - 48px)', lineHeight: '20px', resize: 'none'}} onChange={e => this.setState({notes: e.target.value})} />
          }
        </div>
        <div style={{width: '105px', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          {/* <i className='material-icons' style={{fontSize: '24px', color: 'rgba(60, 58, 68, 0.7)', cursor: 'pointer'}}>clear</i> */}
          {!this.state.editing &&
            <i className='material-icons' style={{fontSize: '24px', color: 'rgba(60, 58, 68, 0.7)', cursor: 'pointer'}} onClick={() => this.enableEditing()}>edit</i>
          }
          {this.state.editing &&
            <div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <i className='material-icons' style={{fontSize: '24px', color: 'rgba(60, 58, 68, 0.7)', cursor: 'pointer', marginBottom: '16px'}} onClick={() => this.saveChanges()}>save</i>
              <i className='material-icons' style={{fontSize: '24px', color: 'rgba(60, 58, 68, 0.7)', cursor: 'pointer'}} onClick={() => this.confirmDelete()}>delete</i>
            </div>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    confirmWindow: state.confirmWindow
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openConfirmWindow: (input) => {
      dispatch(openConfirmWindow(input))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(updateBucket, {name: 'updateBucket'}),
  graphql(deleteBucket, {name: 'deleteBucket'})
)(onClickOutside(BucketRow)))
