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
      editorFocus: false,
      cellFocus: false
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

  componentDidUpdate (prevProps) {
    if (prevProps.activeEventId !== this.props.activeEventId || prevProps.activeField !== this.props.activeField) {
      if (this.props.activeEventId === this.props.id && (this.props.activeField === 'startTime' || this.props.activeField === 'endTime')) {
        console.log('this is correct row n col')
        if (this.props.plannerFocus !== 'rightbar') {
          console.log('active cell changed, right bar not focused')
          this.cell.focus()
          // this.editor.focus()
          this.setState({cellFocus: true})
        }
      }
    }

    // if (prevProps.plannerFocus !== this.props.plannerFocus) {
    //   if (this.props.plannerFocus !== 'rightbar') {
    //     // console.log('planner focus changed, not rightbar')
    //     // console.log('activefield', nextProps.activeField)
    //     if (this.props.activeEventId === this.props.id && (this.props.activeField === 'startTime' || this.props.activeField === 'endTime')) {
    //       console.log('correct activeEventId, activeField is time, this cell id is', this.props.id)
    //       // CLICKING IN RIGHT BAR, THEN BACK INTO TIME CELL EXACTLY IS OK. CLICKING OUTSIDE OF TIME CELL FULFILS THIS IF, BUT FOCUS IS STILL NOT IN THIS CELL. FOCUS IS ON PARENT DIV MAYBE?
    //       // console.log('ref', this.cell)
    //       this.cell.focus()
    //       // this.editor.focus()
    //       // WHERE DID THE FOCUS GO
    //       // console.log('hasFocus', document.hasFocus(), 'activeElement', document.activeElement)
    //
    //       // check if they are the same nodes
    //       // console.log(document.activeElement === this.cell)
    //     }
    //   }
    // }
  }

  // componentWillReceiveProps (nextProps) {
  //   const { timeCellFocus, id } = nextProps
  //   // if (timeCellFocus && nextProps.activeEventId === id) {
  //   //   // this.props.setTimeCellFocus(false)
  //   //   this.editor.focus()
  //   // }
  //
  //   // TIMECELLFOCUS NOT CURRENTLY IN USE. CHECK ACTIVEFIELD TO SEE IF THIS IS CORRECT CELL TO FOCUS
  //   if (nextProps.activeEventId !== this.props.activeEventId) {
  //     if (nextProps.activeEventId === id && (nextProps.activeField === 'startTime' || nextProps.activeField === 'endTime')) {
  //       console.log('this is correct row n col')
  //       if (this.props.plannerFocus !== 'rightbar') {
  //         console.log('active cell changed, right bar not focused')
  //         this.cell.focus()
  //         this.editor.focus()
  //       }
  //     }
  //   }
  //
  //   if (nextProps.plannerFocus !== this.props.plannerFocus) {
  //     if (nextProps.plannerFocus !== 'rightbar') {
  //       // console.log('planner focus changed, not rightbar')
  //       // console.log('activefield', nextProps.activeField)
  //       if (nextProps.activeEventId === id && (nextProps.activeField === 'startTime' || nextProps.activeField === 'endTime')) {
  //         console.log('correct activeEventId, activeField is time, this cell id is', id)
  //         // CLICKING IN RIGHT BAR, THEN BACK INTO TIME CELL EXACTLY IS OK. CLICKING OUTSIDE OF TIME CELL FULFILS THIS IF, BUT FOCUS IS STILL NOT IN THIS CELL. FOCUS IS ON PARENT DIV MAYBE?
  //         // console.log('ref', this.cell)
  //         this.cell.focus()
  //         this.editor.focus()
  //       }
  //     }
  //   }
  // }

  // keydown is not firing after clicking outside rightbar (focus is not actually on cell)
  handleKeyDown (e, isActive, editorFocus) {
    // console.log('called');
    // if (e.keyCode <= 40 && e.keyCode >= 37 && isActive && !editorFocus) {
    //   this.handleArrowKeyDown(e.keyCode)
    // }
    if (e.key === 'Enter') {
      console.log('go to next row timecell')
      e.preventDefault() // idk why this
      let thisEventIndex = this.props.events.events.findIndex(e => {
        return e.id === this.props.id
      }) + 1
      if (thisEventIndex < this.props.events.events.length) {
        console.log('next id', (thisEventIndex + 1).toString())
        this.props.updateActiveEvent((thisEventIndex + 1).toString())
      }
    }

    if (e.key === 'ArrowRight') {
      // next col is whichever is first col (since time cannot be swopped)
      console.log('col state', this.props.columnState)
      this.props.changeActiveField(eventPropertyNames[this.props.columnState[0].name])
    }
    // NO ARROW LEFT SINCE TIME IS LEFTMOST COL (UNLESS WE WANT TO REVERSE TO PREVIOUS ROW LAST COL)
    if (e.key === 'ArrowDown') {
      // console.log('e', e)
      // go to next row if possible
      let thisEventIndex = this.props.events.events.findIndex(e => {
        return e.id === this.props.id
      }) + 1
      if (thisEventIndex < this.props.events.events.length) {
        // console.log('next id', (thisEventIndex + 1).toString())
        this.props.updateActiveEvent((thisEventIndex + 1).toString())
      }
    }
    if (e.key === 'ArrowUp') {
      // go up if possible
      let thisEventIndex = this.props.events.events.findIndex(e => {
        return e.id === this.props.id
      }) + 1
      if (thisEventIndex > 1) {
        // console.log('next id', (thisEventIndex - 1).toString())
        this.props.updateActiveEvent((thisEventIndex - 1).toString())
      }
    }
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

  // fired by div, not input field
  handleOnFocus () {
    this.props.updateEvent(null, null, null, false)
    this.props.changeActiveField('startTime')
    // if activeEventId is different, setActiveEventId, also open events right bar
    if (this.props.activeEventId !== this.props.id) {
      // this.props.setRightBarFocusedTab('event')
      this.props.updateActiveEvent(this.props.id)
    }
    this.setState({cellFocus: true})
  }

  handleCellOnBlur () {
    console.log('cell on blur')
    // need if else to check if the focus is moving from cell into input
    this.setState({cellFocus: false})
  }

  render () {
    const { id } = this.props
    const { events } = this.props.events
    const isActive = this.props.activeEventId === id && (this.props.activeField === 'startTime' || this.props.activeField === 'endTime') && this.state.cellFocus

    const startTime = events.filter(event => event.id === id)[0].startTime
    const endTime = events.filter(event => event.id === id)[0].endTime
    return (
      <div tabIndex='1' ref={(element) => { this.cell = element }} onKeyDown={(e) => this.handleKeyDown(e, isActive, this.state.editorFocus)} onFocus={() => this.handleOnFocus()} onBlur={() => this.handleCellOnBlur()} className='planner-table-cell' style={{cursor: 'text', minHeight: '83px', display: 'flex', flexDirection: 'column', alignItems: 'center', wordBreak: 'break-word', justifyContent: 'center', outline: isActive ? '1px solid #ed685a' : 'none', color: isActive ? '#ed685a' : 'rgba(60, 58, 68, 1)'}}>
        <input tabIndex='1' type='time' value={startTime} ref={(element) => { this.editor = element }} style={{outline: 'none', textAlign: 'center', backgroundColor: 'transparent'}} onFocus={() => this.setState({editorFocus: true, cellFocus: true})} onChange={(e) => this.handleChange(e, 'startTime')} onBlur={() => this.setState({editorFocus: false})} />
        {endTime && <React.Fragment>
          <div style={{height: '10px', borderRight: '1px solid rgba(60, 58, 68, 1)'}} />
          <input tabIndex='1' type='time' value={endTime} style={{outline: 'none', textAlign: 'center', backgroundColor: 'transparent'}} onFocus={() => this.setState({editorFocus: true, cellFocus: true})} onChange={(e) => this.handleChange(e, 'endTime')} onBlur={() => this.setState({editorFocus: false})} />
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
    timeCellFocus: state.timeCellFocus,
    plannerFocus: state.plannerFocus
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
