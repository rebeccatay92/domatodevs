import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateActiveEvent } from '../../actions/planner/activeEventActions'
import { setRightBarFocusedTab } from '../../actions/planner/plannerViewActions'
import { setPopupToShow } from '../../actions/planner/mapboxActions'

import Radium from 'radium'

class LeftBarEventRow extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  toggleActiveEvent (id) {
    if (this.props.activeEventId === id) {
      this.props.updateActiveEvent('')
      this.props.setPopupToShow('')
      if (this.props.plannerView.rightBar === '') {
        this.props.setRightBarFocusedTab('')
      } else if (this.props.plannerView.rightBar === 'event') {
        this.props.setRightBarFocusedTab('bucket')
      }
    } else {
      this.props.updateActiveEvent(id)
      this.props.setPopupToShow('event')
    }
  }

  render () {
    // console.log('this.props.event', this.props.event)
    let startTime = this.props.event.startTime
    let eventType = this.props.event.eventType.getPlainText()
    let locationObj = this.props.event.locationObj
    // console.log('startTime', startTime, 'type', eventType, 'location', locationObj)
    let isActiveEvent = this.props.activeEventId === this.props.event.id
    return (
      <div style={{display: 'flex', width: '100%', height: '83px', background: isActiveEvent ? 'rgb(245, 245, 245)' : 'white', cursor: 'pointer', ':hover': {background: 'rgb(245, 245, 245)'}}} onClick={() => this.toggleActiveEvent(this.props.event.id)}>
        <div style={{width: '50px', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          {locationObj && locationObj.address &&
            <i className='material-icons' style={{color: isActiveEvent ? 'red' : 'rgb(67, 132, 150)'}}>place</i>
          }
          {(!locationObj || !locationObj.address) &&
            <i className='material-icons' style={{color: isActiveEvent ? 'red' : 'rgb(67, 132, 150)'}}>not_listed_location</i>
          }
        </div>
        <div style={{width: '113px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <input type='time' value={startTime} style={{fontFamily: 'Roboto, sans-serif', fontWeight: '300', fontSize: '16px', color: 'rgba(60, 58, 68, 1)', outline: 'none', background: 'inherit'}} disabled />
          {this.props.event.endTime &&
            <React.Fragment>
              <div style={{width: '1px', height: '10px', borderRight: '1px solid rgb(60, 58, 68)'}} />
              <input type='time' value={this.props.event.endTime} style={{fontFamily: 'Roboto, sans-serif', fontWeight: '300', fontSize: '16px', color: 'rgba(60, 58, 68, 1)', outline: 'none', background: 'inherit'}} disabled />
            </React.Fragment>
          }
        </div>
        <div style={{width: '226px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <span>{eventType || '---'}</span>
          <span>{locationObj ? locationObj.name : '---'}</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    activeEventId: state.activeEventId,
    plannerView: state.plannerView
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateActiveEvent: (id) => {
      dispatch(updateActiveEvent(id))
    },
    setRightBarFocusedTab: (tabName) => {
      dispatch(setRightBarFocusedTab(tabName))
    },
    setPopupToShow: (name) => {
      dispatch(setPopupToShow(name))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(LeftBarEventRow))
