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

class EventRowInfoCell extends Component {
  constructor (props) {
    super(props)
    const { column, index } = props
    const property = eventPropertyNames[column]

    // this.state = {
    //   editorState: EditorState.createEmpty()
    // }

    this.onChange = (editorState) => {
      this.props.updateEvent(index, property, editorState)
      // this.setState({editorState: editorState})
    }

    this.focus = () => {
      this.editor.focus()
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
    const { column, index } = this.props
    const { events } = this.props.events
    const getEventProp = (columnInput, eventInput) => {
      const eventProperties = {
        Event: eventInput.eventType,
        Location: eventInput.location,
        Price: eventInput.cost,
        Notes: eventInput.notes
      }

      return eventProperties[columnInput]
    }

    const value = getEventProp(column, events[index])

    return (
      <div onClick={this.focus} style={{cursor: 'text', minHeight: '83px', display: 'flex', alignItems: 'center', wordBreak: 'break-word'}}>
        <Editor editorState={value} onChange={this.onChange} ref={(element) => { this.editor = element }} onBlur={() => this.props.updateActiveEvent('')} onFocus={() => this.props.updateActiveEvent(index)} />
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
    updateEvent: (index, property, value) => {
      return dispatch(updateEvent(index, property, value))
    },
    updateActiveEvent: (index) => {
      return dispatch(updateActiveEvent(index))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventRowInfoCell)
