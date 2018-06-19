import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'

import { connect } from 'react-redux'
// import { updateEvent } from '../../../actions/planner/eventsActions'
// import { updateActiveEvent } from '../../../actions/planner/activeEventActions'
import { setRightBarFocusedTab } from '../../../actions/planner/plannerViewActions'
// import { clickDayCheckbox, setPopupToShow } from '../../../actions/planner/mapboxActions'
// import { changeActiveField } from '../../../actions/planner/activeFieldActions'
// import { openConfirmWindow } from '../../../actions/confirmWindowActions'

// import { updateEventBackend, deleteEvent } from '../../../apollo/event'
// import { changingLoadSequence } from '../../../apollo/changingLoadSequence'
// import { queryItinerary } from '../../../apollo/itinerary'

// import PlannerSideBarInfoField from './PlannerSideBarInfoField'
// import PlannerSideBarLocationNameField from './PlannerSideBarLocationNameField'
import EventRightBar from './EventRightBar'

// import DatePicker from 'react-datepicker'
// import CustomDateInput from '../CustomDateInput'
// import 'react-datepicker/dist/react-datepicker.css'

// import moment from 'moment'
// import { deleteEventResequence } from '../../../helpers/plannerLoadSequence'

import { PlannerRightBarStyles as styles } from '../../../Styles/PlannerRightBarStyles'

class PlannerRightBar extends Component {
  toggleRightBar (tabName) {
    let rightBar = this.props.plannerView.rightBar
    if (tabName === rightBar) {
      this.props.setRightBarFocusedTab('')
    } else {
      this.props.setRightBarFocusedTab(tabName)
    }
  }

  render () {
    // let thisEvent = this.props.events.events.find(e => {
    //   return e.id === this.props.activeEventId
    // })
    // // let isVerified
    // if (thisEvent) {
    //   var locationObj = thisEvent.locationObj
    //   // if (locationObj) {
    //   //   isVerified = locationObj.verified ? 'TRUE' : 'FALSE'
    //   // } else {
    //   //   isVerified = 'NO LOCATION'
    //   // }
    // }

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
            <EventRightBar daysArr={this.props.daysArr} datesArr={this.props.datesArr} itineraryId={this.props.itineraryId} />
            // <div style={styles.mainAreaContainer}>
            //   <div style={styles.minHeightSection}>
            //     <div style={styles.iconSection}>
            //       <i className='material-icons' style={styles.icon}>schedule</i>
            //     </div>
            //     <div style={styles.inputSection}>
            //       <span style={styles.labelText}>Day / Date</span>
            //       {!this.props.datesArr &&
            //         <select style={styles.dayDropdown} value={thisEvent.startDay} onChange={e => this.selectDayDate(e, 'day')}>
            //           {this.props.daysArr.map((day, i) => {
            //             return (
            //               <option style={{margin: 0}} value={day} key={i}>Day {day}</option>
            //             )
            //           })}
            //         </select>
            //       }
            //       {this.props.datesArr &&
            //         <DatePicker customInput={<CustomDateInput />} dateFormat={'ddd, DD MMM YYYY'} selected={moment.unix(this.props.datesArr[thisEvent.startDay - 1]).utc()} minDate={moment.unix(this.props.datesArr[0])} maxDate={moment.unix(this.props.datesArr[this.props.datesArr.length - 1])} onSelect={e => this.selectDayDate(e, 'date')} />
            //       }
            //       <label style={styles.labelContainer}>
            //         <span style={styles.labelText}>Time</span>
            //         <input type='time' style={styles.timeInput} value={thisEvent.startTime} onChange={e => this.updateTime(e, 'startTime')} onFocus={() => this.props.changeActiveField('startTime')}/>
            //         <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '14px', color: 'rgba(60, 58, 68, 0.7)', margin: '0 5px 0 5px'}}>to</span>
            //         <input type='time' style={styles.timeInput} value={thisEvent.endTime} onChange={e => this.updateTime(e, 'endTime')} onFocus={() => this.props.changeActiveField('endTime')}/>
            //       </label>
            //     </div>
            //   </div>
            //   <hr style={styles.sectionDivider} />
            //   <div style={styles.minHeightSection}>
            //     <div style={styles.iconSection}>
            //       <i className='material-icons' style={styles.icon}>event</i>
            //     </div>
            //     <div style={styles.inputSection}>
            //       <label style={styles.labelContainer}>
            //         <span style={styles.labelText}>Event Type</span>
            //         <PlannerSideBarInfoField property='eventType' id={this.props.activeEventId} />
            //       </label>
            //     </div>
            //   </div>
            //   <hr style={styles.sectionDivider} />
            //   <div style={styles.minHeightSection}>
            //     <div style={styles.iconSection}>
            //       <i className='material-icons' style={styles.icon}>map</i>
            //     </div>
            //     <div style={styles.inputSection}>
            //       <label style={styles.labelContainer}>
            //         <span style={styles.labelText}>Location name</span>
            //         <PlannerSideBarLocationNameField id={this.props.activeEventId} locationObj={locationObj} />
            //       </label>
            //       <span style={styles.labelText}>Address</span>
            //       <div style={{display: 'flex', alignItems: 'center', minHeight: '35px'}}>
            //         {locationObj && locationObj.address &&
            //           <span style={styles.addressText}>{locationObj.address}</span>
            //         }
            //         {locationObj && !locationObj.address &&
            //           <span style={styles.addressText}>No address</span>
            //         }
            //         {!locationObj &&
            //           <span style={styles.addressText}>No location</span>
            //         }
            //       </div>
            //       {this.props.plannerView.tablePlanner &&
            //         <button style={{border: '2px solid rgb(67, 132, 150)', marginTop: '8px', outline: 'none', background: 'rgb(245, 245, 245)', fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px'}} onClick={() => this.openInMap(this.props.activeEventId)}>Open in Map</button>
            //       }
            //     </div>
            //   </div>
            //   <hr style={styles.sectionDivider} />
            //   <div style={styles.minHeightSection}>
            //     <div style={styles.iconSection}>
            //       <i className='material-icons' style={styles.icon}>money</i>
            //     </div>
            //     <div style={styles.inputSection}>
            //       <label style={styles.labelContainer}>
            //         <span style={styles.labelText}>Cost</span>
            //       </label>
            //       <PlannerSideBarInfoField property='cost' id={this.props.activeEventId} />
            //     </div>
            //   </div>
            //   <hr style={styles.sectionDivider} />
            //   <div style={styles.minHeightSection}>
            //     <div style={styles.iconSection}>
            //       <i className='material-icons' style={styles.icon}>credit_card</i>
            //     </div>
            //     <div style={styles.inputSection}>
            //       <label style={styles.labelContainer}>
            //         <span style={styles.labelText}>Booking service</span>
            //         <PlannerSideBarInfoField property='bookingService' id={this.props.activeEventId} />
            //       </label>
            //       <label style={styles.labelContainer}>
            //         <span style={styles.labelText}>Confirmation number</span>
            //         <PlannerSideBarInfoField property='bookingConfirmation' id={this.props.activeEventId} />
            //       </label>
            //     </div>
            //   </div>
            //   <hr style={styles.sectionDivider} />
            //   <div style={styles.minHeightSection}>
            //     <div style={styles.iconSection}>
            //       <i className='material-icons' style={styles.icon}>edit</i>
            //     </div>
            //     <div style={styles.inputSection}>
            //       <label style={styles.labelContainer}>
            //         <span style={styles.labelText}>Notes</span>
            //         <PlannerSideBarInfoField property='notes' id={this.props.activeEventId} />
            //       </label>
            //     </div>
            //   </div>
            //
            //   <button style={{border: '2px solid red', marginTop: '8px', outline: 'none', background: 'rgb(245, 245, 245)', fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px', position: 'absolute', bottom: '16px', right: '16px'}} onClick={() => this.confirmDeleteEvent()}>Delete this event</button>
            //   {/* <hr style={styles.sectionDivider} />
            //   <div style={{width: '100%', display: 'flex'}}>
            //     <div style={styles.iconSection}>
            //       <i className='material-icons' style={styles.icon}>attach_file</i>
            //     </div>
            //     <div style={styles.inputSection}>
            //       <span style={styles.attachFileLabelText}>Attach a file</span>
            //     </div>
            //   </div> */}
            // </div>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    // events: state.events,
    activeEventId: state.activeEventId,
    plannerView: state.plannerView
    // mapbox: state.mapbox,
    // confirmWindow: state.confirmWindow
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // updateEvent: (id, property, value) => {
    //   dispatch(updateEvent(id, property, value))
    // },
    setRightBarFocusedTab: (tabName) => {
      dispatch(setRightBarFocusedTab(tabName))
    }
    // switchToMapView: () => {
    //   dispatch(switchToMapView())
    // },
    // clickDayCheckbox: (day) => {
    //   dispatch(clickDayCheckbox(day))
    // },
    // setPopupToShow: (name) => {
    //   dispatch(setPopupToShow(name))
    // },
    // updateActiveEvent: (id) => {
    //   dispatch(updateActiveEvent(id))
    // },
    // changeActiveField: (field) => {
    //   dispatch(changeActiveField(field))
    // },
    // openConfirmWindow: (input) => {
    //   dispatch(openConfirmWindow(input))
    // }
  }
}

// const options = {
//   options: props => ({
//     variables: {
//       id: props.itineraryId
//     }
//   })
// }

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  // graphql(updateEventBackend, {name: 'updateEventBackend'}),
  // graphql(changingLoadSequence, {name: 'changingLoadSequence'}),
  // graphql(deleteEvent, {name: 'deleteEvent'}),
  // graphql(queryItinerary, options)
)(PlannerRightBar))
