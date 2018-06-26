import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'

import { updateEvent } from '../../actions/planner/eventsActions'
import { updateActiveEvent } from '../../actions/planner/activeEventActions'
import { changeActiveField } from '../../actions/planner/activeFieldActions'
import { setRightBarFocusedTab } from '../../actions/planner/plannerViewActions'
// import { setTimeCellFocus } from '../../actions/planner/timeCellFocusActions'

import { updateEventBackend } from '../../apollo/event'

const eventPropertyNames = {
  Event: 'eventType',
  Price: 'cost',
  Notes: 'notes',
  'Booking Service': 'bookingService',
  'Confirmation Number': 'bookingConfirmation',
  Location: 'location'
}

class EventRowTimeCell extends Component {
  constructor (props) {
    super(props)

    this.state = {
      editorFocus: false
    }
  }

  handleChange (e, type) {
    const { id } = this.props
    let unixSecsFromMidnight
    if (e.target.value) {
      this.props.updateEvent(id, type, e.target.value)
      let hours = (e.target.value).substring(0, 2)
      let mins = (e.target.value).substring(3, 5)
      // console.log('hours', hours, 'mins', mins)
      unixSecsFromMidnight = hours * 3600 + mins * 60
    } else {
      this.props.updateEvent(id, type, '')
      unixSecsFromMidnight = null
    }
    this.props.updateEventBackend({
      variables: {
        id: id,
        [type]: unixSecsFromMidnight
      }
    })
  }

  shouldComponentUpdate (nextProps) {
    const { id } = nextProps
    const { refetch } = nextProps.events
    if ((nextProps.activeEventId === id && (nextProps.activeField === 'startTime' || nextProps.activeField === 'endTime')) || (this.props.activeEventId === id && (this.props.activeField === 'startTime' || this.props.activeField === 'endTime'))) {
      return true
    } else if (refetch) {
      return true
    } else return false
  }

  componentWillReceiveProps (nextProps) {
    const { timeCellFocus, id } = nextProps
    if (timeCellFocus && nextProps.activeEventId === id) {
      // this.props.setTimeCellFocus(false)
      this.editor.focus()
    }

    // if (nextProps.activeEventId === id && nextProps.activeField === 'startTime' && !this.state.editorFocus) {
    //   this.cell.focus()
    // }
  }

  handleKeyDown (e, isActive, editorFocus) {
    // console.log('called');
    // if (e.keyCode <= 40 && e.keyCode >= 37 && isActive && !editorFocus) {
    //   this.handleArrowKeyDown(e.keyCode)
    // }
  }

  // handleArrowKeyDown (key) {
  //   const { columnState, events, day, eventIndex } = this.props
  //   if (key === 37) {
  //     this.props.changeActiveField(eventPropertyNames[columnState[columnState.length - 1].name])
  //     this.cell.blur()
  //   } else if (key === 39) {
  //     this.props.changeActiveField(eventPropertyNames[columnState[0].name])
  //     this.cell.blur()
  //   } else if (key === 38) {
  //     const newActiveEvent = events.events.filter(event => event.startDay === day)[eventIndex - 1]
  //     newActiveEvent && this.props.updateActiveEvent(newActiveEvent.id)
  //     this.cell.blur()
  //   } else if (key === 40) {
  //     const newActiveEvent = events.events.filter(event => event.startDay === day)[eventIndex + 1]
  //     newActiveEvent && this.props.updateActiveEvent(newActiveEvent.id)
  //     this.cell.blur()
  //   }
  // }

  handleOnFocus () {
    this.props.updateEvent(null, null, null, false)
    this.props.changeActiveField('startTime')
    // if activeEventId is different, setActiveEventId, also open events right bar
    if (this.props.activeEventId !== this.props.id) {
      // this.props.setRightBarFocusedTab('event')
      this.props.updateActiveEvent(this.props.id)
    }
  }

  render () {
    const { id } = this.props
    const { events } = this.props.events
    const isActive = this.props.activeEventId === id && (this.props.activeField === 'startTime' || this.props.activeField === 'endTime')
    const startTime = events.filter(event => event.id === id)[0].startTime
    const endTime = events.filter(event => event.id === id)[0].endTime
    return (
      <div tabIndex='1' ref={(element) => { this.cell = element }} onKeyDown={(e) => this.handleKeyDown(e, isActive, this.state.editorFocus)} onFocus={() => this.handleOnFocus()} className='planner-table-cell' style={{cursor: 'text', minHeight: '83px', display: 'flex', flexDirection: 'column', alignItems: 'center', wordBreak: 'break-word', justifyContent: 'center', outline: isActive ? '1px solid #ed685a' : 'none', color: isActive ? '#ed685a' : 'rgba(60, 58, 68, 1)'}}>
        <input disabled={!isActive} type='time' value={startTime} ref={(element) => { this.editor = element }} style={{outline: 'none', textAlign: 'center', backgroundColor: 'transparent'}} onFocus={() => this.setState({editorFocus: true})} onChange={(e) => this.handleChange(e, 'startTime')} onBlur={() => this.setState({editorFocus: false})} />
        {endTime && <React.Fragment>
          <div style={{height: '10px', borderRight: '1px solid rgba(60, 58, 68, 1)'}} />
          <input disabled={!isActive} type='time' value={endTime} style={{outline: 'none', textAlign: 'center', backgroundColor: 'transparent'}} onFocus={() => this.setState({editorFocus: true})} onChange={(e) => this.handleChange(e, 'endTime')} onBlur={() => this.setState({editorFocus: false})} />
        </React.Fragment>}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.events,
    activeField: state.activeField,
    activeEventId: state.activeEventId,
    plannerView: state.plannerView,
    timeCellFocus: state.timeCellFocus
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateEvent: (id, property, value) => {
      return dispatch(updateEvent(id, property, value))
    },
    updateActiveEvent: (id) => {
      return dispatch(updateActiveEvent(id))
    },
    changeActiveField: (field) => {
      return dispatch(changeActiveField(field))
    },
    setRightBarFocusedTab: (tabName) => {
      return dispatch(setRightBarFocusedTab(tabName))
    }
    // setTimeCellFocus: (focus) => {
    //   dispatch(setTimeCellFocus(focus))
    // }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(updateEventBackend, {name: 'updateEventBackend'})
)(EventRowTimeCell))
