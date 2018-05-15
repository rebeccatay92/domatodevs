import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'

import { updateEvent } from '../../actions/planner/eventsActions'
import { updateActiveEvent } from '../../actions/planner/activeEventActions'

class EventRowTimeCell extends Component {
  constructor (props) {
    super(props)

    this.focus = () => {
      this.editor.focus()
    }
  }

  handleChange (e) {
    const { id } = this.props
    this.props.updateEvent(id, 'startTime', e.target.value)
  }

  render () {
    const { id } = this.props
    const { events } = this.props.events
    const startTime = events.filter(event => event.id === id)[0].startTime
    return (
      <div className='planner-table-cell' onClick={this.focus} style={{cursor: 'text', minHeight: '83px', display: 'flex', alignItems: 'center', wordBreak: 'break-word', justifyContent: 'center'}}>
        <input type='time' value={startTime} ref={(element) => { this.editor = element }} style={{outline: 'none'}} onFocus={() => this.props.updateActiveEvent(id)} onChange={(e) => this.handleChange(e)} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.events
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateEvent: (id, property, value) => {
      return dispatch(updateEvent(id, property, value))
    },
    updateActiveEvent: (id) => {
      return dispatch(updateActiveEvent(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventRowTimeCell)
