import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'

import { connect } from 'react-redux'
import { updateEvent } from '../../../actions/planner/eventsActions'
import { updateActiveEvent } from '../../../actions/planner/activeEventActions'
import { setRightBarFocusedTab, switchToMapView } from '../../../actions/planner/plannerViewActions'
import { clickDayCheckbox, setPopupToShow } from '../../../actions/planner/mapboxActions'
import { changeActiveField } from '../../../actions/planner/activeFieldActions'
import { openConfirmWindow } from '../../../actions/confirmWindowActions'
import { setFocusTo } from '../../../actions/planner/plannerFocusActions'

import onClickOutside from 'react-onclickoutside'

import { updateEventBackend, deleteEvent } from '../../../apollo/event'
import { changingLoadSequence } from '../../../apollo/changingLoadSequence'
import { queryItinerary } from '../../../apollo/itinerary'

import PlannerSideBarInfoField from './PlannerSideBarInfoField'
import PlannerSideBarLocationNameField from './PlannerSideBarLocationNameField'

import DatePicker from 'react-datepicker'
import CustomDateInput from '../CustomDateInput'
import 'react-datepicker/dist/react-datepicker.css'

import moment from 'moment'
import { deleteEventResequence } from '../../../helpers/plannerLoadSequence'

import { EventRightBarStyles as styles } from '../../../Styles/EventRightBarStyles'

class EventRightBar extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  updateTime (e, field) {
    // console.log('event', e.target.value, field)
    let unixSecsFromMidnight
    if (e.target.value) {
      this.props.updateEvent(this.props.activeEventId, field, e.target.value, true)
      let hours = (e.target.value).substring(0, 2)
      let mins = (e.target.value).substring(3, 5)
      // console.log('hours', hours, 'mins', mins)
      unixSecsFromMidnight = hours * 3600 + mins * 60
    } else {
      this.props.updateEvent(this.props.activeEventId, field, '', true)
      unixSecsFromMidnight = null
    }
    this.props.updateEventBackend({
      variables: {
        id: this.props.activeEventId,
        [field]: unixSecsFromMidnight
      }
    })
  }

  selectDayDate (e, type) {
    // type is either 'day' or 'date'
    let newStartDayInt

    if (type === 'day') {
      // dropdown value is string
      newStartDayInt = parseInt(e.target.value)
    } else if (type === 'date') {
      // selected date prop in datepicker must be .utc(). else clicking on currently selected date returns -8 hrs from utc midnight
      console.log('e', e)
      let unix = moment(e._d).unix()
      newStartDayInt = this.props.datesArr.indexOf(unix) + 1
    }

    let thisEvent = this.props.events.events.find(e => {
      return e.id === this.props.activeEventId
    })
    let currentStartDayInt = thisEvent.startDay

    if (currentStartDayInt !== newStartDayInt) {
      console.log('currentStartDayInt', currentStartDayInt, 'new', newStartDayInt)

      let newDayEvents = this.props.events.events.filter(e => {
        return e.startDay === newStartDayInt
      })
      let newLoadSequence = newDayEvents.length + 1

      // reassign load seqs for old day
      let allEventsInDay = this.props.events.events.filter(e => {
        return e.startDay === currentStartDayInt
      })
      let remainingEventsInDay = allEventsInDay.filter(e => {
        return e.id !== this.props.activeEventId
      })

      let loadSequenceChanges = []

      remainingEventsInDay.forEach((event, i) => {
        let correctSeq = i + 1
        if (event.loadSequence !== correctSeq) {
          loadSequenceChanges.push({
            EventId: event.id,
            startDay: event.startDay,
            loadSequence: correctSeq
          })
        }
      })

      console.log('changes', loadSequenceChanges)

      // send both reqs to backend
      let updateEventBackendPromise = this.props.updateEventBackend({
        variables: {
          id: this.props.activeEventId,
          startDay: newStartDayInt,
          loadSequence: newLoadSequence
        }
      })

      let updateLoadSequencesPromise = this.props.changingLoadSequence({
        variables: {
          input: loadSequenceChanges
        }
      })

      Promise.all([updateEventBackendPromise, updateLoadSequencesPromise])
        .then(responseArr => {
          this.props.data.refetch()
        })
    }
  }

  openInMap (activeEventId) {
    let thisEvent = this.props.events.events.find(e => {
      return e.id === this.props.activeEventId
    })
    let startDay = thisEvent.startDay

    this.props.switchToMapView()
    // this.props.setRightBarFocusedTab('event')

    let daysToShow = this.props.mapbox.daysToShow
    let isStartDayInDaysArr = daysToShow.includes(startDay)
    if (!isStartDayInDaysArr) {
      this.props.clickDayCheckbox(startDay)
    }

    this.props.setPopupToShow('event')
  }

  deleteEvent (activeEventId) {
    this.props.setRightBarFocusedTab('')
    this.props.setPopupToShow('')
    this.props.updateActiveEvent('')

    let loadSequenceChanges = deleteEventResequence(this.props.events.events, activeEventId)

    // console.log('changes', loadSequenceChanges)

    let deleteEventPromise = this.props.deleteEvent({
      variables: {id: activeEventId}
    })
    let changingLoadSequencePromise = this.props.changingLoadSequence({
      variables: {
        input: loadSequenceChanges
      }
    })

    Promise.all([deleteEventPromise, changingLoadSequencePromise])
      .then(response => {
        this.props.data.refetch()
      })
  }

  confirmDeleteEvent () {
    this.props.openConfirmWindow({
      message: 'Are you sure you want to delete this event?',
      secondaryMessage: '',
      confirmMessage: 'Yes'
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.confirmWindow !== this.props.confirmWindow) {
      if (!nextProps.confirmWindow.open && nextProps.confirmWindow.confirmClicked) {
        console.log('confirm clicked')
        this.deleteEvent(this.props.activeEventId)
      } else if (!nextProps.confirmWindow.open && !nextProps.confirmWindow.confirmClicked) {
        console.log('cancelled')
      }
    }
  }

  componentDidMount () {
    console.log('event side bar mounted')
    this.props.setFocusTo('rightbar')
  }

  componentWillUnmount () {
    console.log('unmount right bar')
    this.props.setFocusTo('')
  }

  onEventRightBarClick () {
    this.props.setFocusTo('rightbar')
  }

  handleClickOutside (evt) {
    // console.log('clicking outside of right bar', evt.target)
    // evt.preventDefault()
    // prevent click to focus on dom nodes. but cant change to other cell when right is open
    // if else to check click target is original focus?
    // evt.stopPropagation()
    this.props.setFocusTo('')
  }

  render () {
    let thisEvent = this.props.events.events.find(e => {
      return e.id === this.props.activeEventId
    })
    // let isVerified
    if (thisEvent) {
      var locationObj = thisEvent.locationObj
      // if (locationObj) {
      //   isVerified = locationObj.verified ? 'TRUE' : 'FALSE'
      // } else {
      //   isVerified = 'NO LOCATION'
      // }
    }

    return (
      <div tabIndex='1' style={styles.mainAreaContainer} onClick={() => this.onEventRightBarClick()}>
        <div style={styles.minHeightSection}>
          <div style={styles.iconSection}>
            <i className='material-icons' style={styles.icon}>schedule</i>
          </div>
          <div style={styles.inputSection}>
            <span style={styles.labelText}>Day / Date</span>
            {!this.props.datesArr &&
              <select style={styles.dayDropdown} value={thisEvent.startDay} onChange={e => this.selectDayDate(e, 'day')}>
                {this.props.daysArr.map((day, i) => {
                  return (
                    <option style={{margin: 0}} value={day} key={i}>Day {day}</option>
                  )
                })}
              </select>
            }
            {this.props.datesArr &&
              <DatePicker customInput={<CustomDateInput />} dateFormat={'ddd, DD MMM YYYY'} selected={moment.unix(this.props.datesArr[thisEvent.startDay - 1]).utc()} minDate={moment.unix(this.props.datesArr[0])} maxDate={moment.unix(this.props.datesArr[this.props.datesArr.length - 1])} onSelect={e => this.selectDayDate(e, 'date')} />
            }
            <label style={styles.labelContainer}>
              <span style={styles.labelText}>Time</span>
              <input type='time' style={styles.timeInput} value={thisEvent.startTime} onChange={e => this.updateTime(e, 'startTime')} onFocus={() => this.props.changeActiveField('startTime')}/>
              <span style={{fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '14px', color: 'rgba(60, 58, 68, 0.7)', margin: '0 5px 0 5px'}}>to</span>
              <input type='time' style={styles.timeInput} value={thisEvent.endTime} onChange={e => this.updateTime(e, 'endTime')} onFocus={() => this.props.changeActiveField('endTime')} />
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
              <PlannerSideBarLocationNameField id={this.props.activeEventId} locationObj={locationObj} />
            </label>
            <span style={styles.labelText}>Address</span>
            <div style={{display: 'flex', alignItems: 'center', minHeight: '35px'}}>
              {locationObj && locationObj.address &&
                <span style={styles.addressText}>{locationObj.address}</span>
              }
              {locationObj && !locationObj.address &&
                <span style={styles.addressText}>No address</span>
              }
              {!locationObj &&
                <span style={styles.addressText}>No location</span>
              }
            </div>
            {this.props.plannerView.tablePlanner &&
              <button style={{border: '2px solid rgb(67, 132, 150)', marginTop: '8px', outline: 'none', background: 'rgb(245, 245, 245)', fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px'}} onClick={() => this.openInMap(this.props.activeEventId)}>Open in Map</button>
            }
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
            </label>
            <PlannerSideBarInfoField property='cost' id={this.props.activeEventId} />
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
              <PlannerSideBarInfoField property='bookingService' id={this.props.activeEventId} />
            </label>
            <label style={styles.labelContainer}>
              <span style={styles.labelText}>Confirmation number</span>
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
              <PlannerSideBarInfoField property='notes' id={this.props.activeEventId} />
            </label>
          </div>
        </div>

        <button style={{border: '2px solid red', marginTop: '8px', outline: 'none', background: 'rgb(245, 245, 245)', fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: '14px'}} onClick={() => this.confirmDeleteEvent()}>Delete this event</button>
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
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.events,
    activeEventId: state.activeEventId,
    plannerView: state.plannerView,
    mapbox: state.mapbox,
    confirmWindow: state.confirmWindow
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateEvent: (id, property, value) => {
      dispatch(updateEvent(id, property, value))
    },
    setRightBarFocusedTab: (tabName) => {
      dispatch(setRightBarFocusedTab(tabName))
    },
    switchToMapView: () => {
      dispatch(switchToMapView())
    },
    clickDayCheckbox: (day) => {
      dispatch(clickDayCheckbox(day))
    },
    setPopupToShow: (name) => {
      dispatch(setPopupToShow(name))
    },
    updateActiveEvent: (id) => {
      dispatch(updateActiveEvent(id))
    },
    changeActiveField: (field) => {
      dispatch(changeActiveField(field))
    },
    openConfirmWindow: (input) => {
      dispatch(openConfirmWindow(input))
    },
    setFocusTo: (focus) => {
      dispatch(setFocusTo(focus))
    }
  }
}

const options = {
  options: props => ({
    variables: {
      id: props.itineraryId
    }
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(updateEventBackend, {name: 'updateEventBackend'}),
  graphql(changingLoadSequence, {name: 'changingLoadSequence'}),
  graphql(deleteEvent, {name: 'deleteEvent'}),
  graphql(queryItinerary, options)
)(onClickOutside(EventRightBar)))
