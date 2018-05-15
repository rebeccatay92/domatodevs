import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { Editor, EditorState } from 'draft-js'

import { updateEvent } from '../../actions/planner/eventsActions'
import { updateActiveEvent } from '../../actions/planner/activeEventActions'

const _ = require('lodash')

const eventPropertyNames = {
  Event: 'eventType',
  Price: 'cost',
  Notes: 'notes',
  Location: 'location'
}

const getEventProp = (columnInput, eventInput) => {
  const eventProperties = {
    Event: eventInput.eventType,
    Location: eventInput.location,
    Price: eventInput.cost,
    Notes: eventInput.notes
  }

  return eventProperties[columnInput]
}

class EventRowInfoCell extends Component {
  constructor (props) {
    super(props)
    const { column, id } = props
    const { events } = this.props.events
    const property = eventPropertyNames[column]

    // this.state = {
    //   editorState: EditorState.createEmpty()
    // }

    this.onChange = (editorState) => {
      this.props.updateEvent(id, property, editorState)
      // this.setState({editorState: editorState})
    }

    this.focus = (e) => {
      this.editor.focus()
      // check whether the click is within the text, or within the cell but outside of the text, if outside of text, move cursor to the end
      if (e.target.className === 'planner-table-cell') {
        const value = getEventProp(column, events.filter(event => event.id === id)[0])
        this.props.updateEvent(id, property, EditorState.moveFocusToEnd(value))
      }
    }
  }

  // shouldComponentUpdate (nextProps) {
  //   const { column, id } = this.props
  //   const { events } = this.props.events
  //   const property = eventPropertyNames[column]
  //   if (_.isEqual(nextProps.events.events.filter(event => event.id === id)[0][property], events.filter(event => event.id === id)[0][property])) {
  //     return false
  //   } else {
  //     return true
  //   }
  // }

  render () {
    const { column, id } = this.props
    const { events } = this.props.events

    const value = getEventProp(column, events.filter(event => event.id === id)[0])
    // console.log('events in infocells', events, 'index', index)
    // CHANGE TO USE EVENTID INSTEAD OF INDEX? _.FIND() / _.GET
    return (
      <div className='planner-table-cell' onClick={this.focus} style={{cursor: 'text', minHeight: '83px', display: 'flex', alignItems: 'center', wordBreak: 'break-word'}}>
        <Editor editorState={value} onChange={this.onChange} ref={(element) => { this.editor = element }} onBlur={() => this.props.updateActiveEvent('')} onFocus={() => this.props.updateActiveEvent(id)} />
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

export default connect(mapStateToProps, mapDispatchToProps)(EventRowInfoCell)
