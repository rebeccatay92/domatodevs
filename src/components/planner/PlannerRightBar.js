import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import { connect } from 'react-redux'
import { updateEvent } from '../../actions/planner/eventsActions'
import { setRightBarFocusedTab } from '../../actions/planner/plannerViewActions'

import { updateEventBackend } from '../../apollo/event'

import PlannerSideBarInfoField from './PlannerSideBarInfoField'
import PlannerSideBarLocationNameField from './PlannerSideBarLocationNameField'

import DatePicker from 'react-datepicker'
// import CustomDatePicker from './CustomDatePicker'
import 'react-datepicker/dist/react-datepicker.css'

import moment from 'moment'

import { PlannerRightBarStyles as styles } from '../../Styles/PlannerRightBarStyles'

class PlannerRightBar extends Component {
  toggleRightBar (tabName) {
    let rightBar = this.props.plannerView.rightBar
    if (tabName === rightBar) {
      this.props.setRightBarFocusedTab('')
    } else {
      this.props.setRightBarFocusedTab(tabName)
    }
  }

  updateTime (e, field) {
    // console.log('event', e.target.value, field)
    let unixSecsFromMidnight
    if (e.target.value) {
      this.props.updateEvent(this.props.activeEventId, field, e.target.value, false)
      let hours = (e.target.value).substring(0, 2)
      let mins = (e.target.value).substring(3, 5)
      // console.log('hours', hours, 'mins', mins)
      unixSecsFromMidnight = hours * 3600 + mins * 60
    } else {
      this.props.updateEvent(this.props.activeEventId, field, '', false)
      unixSecsFromMidnight = null
    }
    this.props.updateEventBackend({
      variables: {
        id: this.props.activeEventId,
        [field]: unixSecsFromMidnight
      }
    })
  }

  selectDate (e) {
    console.log('e', e)
  }

  selectDay (e) {
    let startDay = e.target.value
  }

  render () {
    let thisEvent = this.props.events.events.find(e => {
      return e.id === this.props.activeEventId
    })
    let isVerified
    if (thisEvent) {
      var locationObj = thisEvent.locationObj
      if (locationObj) {
        isVerified = locationObj.verified ? 'TRUE' : 'FALSE'
      } else {
        isVerified = 'NO LOCATION'
      }
    }

    return (
      <div>
        {/* TABS */}
        <div style={this.props.plannerView.rightBar === '' ? styles.tabsContainer : {...styles.tabsContainer, right: '344px'}}>
          <div style={this.props.plannerView.rightBar === 'bucket' ? styles.tabClicked : styles.tabUnclicked} onClick={() => this.toggleRightBar('bucket')}>
            <span style={styles.tabText}>Bucket</span>
          </div>
          {this.props.activeEventId &&
            <div style={this.props.plannerView.rightBar === 'event' ? styles.tabClicked : styles.tabUnclicked} onClick={() => this.toggleRightBar('event')}>
              <span style={styles.tabText}>Event</span>
            </div>
          }
        </div>
        <div style={styles.sidebarContainer}>
          {this.props.plannerView.rightBar === 'bucket' &&
            <div style={styles.mainAreaContainer}>
              BUCKET
            </div>
          }

          {/* EVENT MAIN AREA */}
          {this.props.plannerView.rightBar === 'event' && this.props.activeEventId &&
            <div style={styles.mainAreaContainer}>
              <div style={styles.minHeightSection}>
                <div style={styles.iconSection}>
                  <i className='material-icons' style={styles.icon}>schedule</i>
                </div>
                <div style={styles.inputSection}>
                  <label style={styles.labelContainer}>
                    <span style={styles.labelText}>Day / Date</span>
                    {!this.props.datesArr &&
                      <select style={styles.dayDropdown} value={thisEvent.startDay} onChange={e => this.selectDay(e)}>
                        {this.props.daysArr.map((day, i) => {
                          return (
                            <option style={{margin: 0}} value={day} key={i}>Day {day}</option>
                          )
                        })}
                      </select>
                    }
                    {this.props.datesArr &&
                      <DatePicker dateFormat={'ddd, DD MMM YYYY'} selected={moment.unix(this.props.datesArr[thisEvent.startDay - 1])} minDate={moment.unix(this.props.datesArr[0])} maxDate={moment.unix(this.props.datesArr[this.props.datesArr.length - 1])} onChange={e => this.selectDate(e)} />
                    }
                  </label>
                  <label style={styles.labelContainer}>
                    <span style={styles.labelText}>Time</span>
                    <input type='time' style={styles.timeInput} value={thisEvent.startTime} onChange={e => this.updateTime(e, 'startTime')} />
                    <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '14px', color: 'rgba(60, 58, 68, 0.7)', margin: '0 5px 0 5px'}}>to</span>
                    <input type='time' style={styles.timeInput} value={thisEvent.endTime} onChange={e => this.updateTime(e, 'endTime')} />
                  </label>
                </div>
              </div>
              <hr style={styles.sectionDivider} />
              <div style={styles.minHeightSection}>
                <div style={styles.iconSection}>
                  <i className='material-icons' style={styles.icon}>event</i>
                </div>
                <div style={styles.inputSection}>
                  <label style={styles.labelContainer}>
                    <span style={styles.labelText}>Event Type</span>
                    {/* <input type='text' placeholder={'-'} style={styles.inputField} /> */}
                    <PlannerSideBarInfoField property='eventType' id={this.props.activeEventId} />
                  </label>
                </div>
              </div>
              <hr style={styles.sectionDivider} />
              <div style={styles.minHeightSection}>
                <div style={styles.iconSection}>
                  <i className='material-icons' style={styles.icon}>map</i>
                </div>
                <div style={styles.inputSection}>
                  <label style={styles.labelContainer}>
                    <span style={styles.labelText}>Location name</span>
                    {/* <input type='text' placeholder='-' style={styles.inputField} /> */}
                    <PlannerSideBarLocationNameField id={this.props.activeEventId} />
                  </label>
                  <label style={styles.labelContainer}>
                    <span style={styles.labelText}>Address</span>
                    <span style={styles.addressText}>{locationObj ? locationObj.address : ''}</span>
                    <span style={styles.labelText}>Verified</span>
                    <span>{isVerified}</span>
                  </label>
                  {/* <label style={styles.labelContainer}>
                    <span style={styles.labelText}>Opening Hours</span>
                    <input type='text' placeholder='-' style={styles.inputField} />
                  </label> */}
                </div>
              </div>
              <hr style={styles.sectionDivider} />
              <div style={styles.minHeightSection}>
                <div style={styles.iconSection}>
                  <i className='material-icons' style={styles.icon}>money</i>
                </div>
                <div style={styles.inputSection}>
                  <label style={styles.labelContainer}>
                    <span style={styles.labelText}>Cost</span>
                    {/* <input type='number' placeholder={'-'} style={styles.inputField} /> */}
                    <PlannerSideBarInfoField property='cost' id={this.props.activeEventId} />
                  </label>
                </div>
              </div>
              <hr style={styles.sectionDivider} />
              <div style={styles.minHeightSection}>
                <div style={styles.iconSection}>
                  <i className='material-icons' style={styles.icon}>credit_card</i>
                </div>
                <div style={styles.inputSection}>
                  <label style={styles.labelContainer}>
                    <span style={styles.labelText}>Booking service</span>
                    {/* <input type='text' placeholder={'-'} style={styles.inputField} /> */}
                    <PlannerSideBarInfoField property='bookingService' id={this.props.activeEventId} />
                  </label>
                  <label style={styles.labelContainer}>
                    <span style={styles.labelText}>Confirmation number</span>
                    {/* <input type='text' placeholder={'-'} style={styles.inputField} /> */}
                    <PlannerSideBarInfoField property='bookingConfirmation' id={this.props.activeEventId} />
                  </label>
                </div>
              </div>
              <hr style={styles.sectionDivider} />
              <div style={styles.minHeightSection}>
                <div style={styles.iconSection}>
                  <i className='material-icons' style={styles.icon}>edit</i>
                </div>
                <div style={styles.inputSection}>
                  <label style={styles.labelContainer}>
                    <span style={styles.labelText}>Notes</span>
                    {/* <textarea placeholder={'-'} style={styles.notesTextArea} /> */}
                    <PlannerSideBarInfoField property='notes' id={this.props.activeEventId} />
                  </label>
                </div>
              </div>
              {/* <hr style={styles.sectionDivider} />
              <div style={{width: '100%', display: 'flex'}}>
                <div style={styles.iconSection}>
                  <i className='material-icons' style={styles.icon}>attach_file</i>
                </div>
                <div style={styles.inputSection}>
                  <span style={styles.attachFileLabelText}>Attach a file</span>
                </div>
              </div> */}
            </div>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.events,
    activeEventId: state.activeEventId,
    plannerView: state.plannerView
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateEvent: (id, property, value) => {
      return dispatch(updateEvent(id, property, value))
    },
    setRightBarFocusedTab: (tabName) => {
      return dispatch(setRightBarFocusedTab(tabName))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(graphql(updateEventBackend, {name: 'updateEventBackend'})(PlannerRightBar))
