import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { Editor, EditorState, ContentState } from 'draft-js'

import { updateEvent } from '../../actions/planner/eventsActions'
import { updateActiveEvent } from '../../actions/planner/activeEventActions'
import { changeActiveField } from '../../actions/planner/activeFieldActions'

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
    const value = getEventProp(column, events.filter(event => event.id === id)[0])

    this.state = {
      editorState: EditorState.createWithContent(value)
    }

    this.onChange = (editorState) => {
      this.setState({editorState: editorState})
      const contentState = editorState.getCurrentContent()
      this.props.updateEvent(id, property, contentState, false)
    }

    this.focus = (e) => {
      // check whether the click is within the text, or within the cell but outside of the text, if outside of text, move cursor to the end
      if (e.target.className === 'planner-table-cell') {
        this.editor.focus()
        this.setState({editorState: EditorState.moveFocusToEnd(this.state.editorState)})
      } else {
        this.editor.focus()
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.events.updatedFromSidebar || nextProps.column !== this.props.column) {
      const { column, id } = nextProps
      const { events } = nextProps.events
      const value = getEventProp(column, events.filter(event => event.id === id)[0])
      this.setState({editorState: EditorState.createWithContent(value)})
    }
  }

  shouldComponentUpdate (nextProps) {
    const { column, id } = this.props
    const { refetch, updatedId, updatedProperty } = this.props.events
    const property = eventPropertyNames[column]
    if (column !== nextProps.column) {
      return true
    } else if (refetch) {
      return true
    } else if (updatedId === id && updatedProperty === property) {
      return true
    } else if ((nextProps.activeEventId === id && nextProps.activeField === property) || (this.props.activeEventId === id && this.props.activeField === property)) {
      return true
    } else {
      return false
    }
  }

  render () {
    const { column, id } = this.props
    const property = eventPropertyNames[column]
    const isActive = this.props.activeEventId === id && this.props.activeField === property
    // const { events } = this.props.events

    // const value = getEventProp(column, events.filter(event => event.id === id)[0])

    return (
      <div className='planner-table-cell' onClick={this.focus} style={{cursor: 'text', minHeight: '83px', display: 'flex', alignItems: 'center', wordBreak: 'break-word', outline: isActive ? '1px solid #ed685a' : 'none', color: isActive ? '#ed685a' : 'rgba(60, 58, 68, 1)'}}>
        <Editor editorState={this.state.editorState} onChange={this.onChange} ref={(element) => { this.editor = element }} onFocus={() => {
          this.props.changeActiveField(property)
          this.props.updateActiveEvent(id)
        }} onBlur={() => this.setState({focusClicked: false})} />
      </div>
    )
  }
}
// onBlur={() => this.props.updateActiveEvent('')}
const mapStateToProps = (state) => {
  return {
    events: state.events,
    activeField: state.activeField,
    activeEventId: state.activeEventId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateEvent: (id, property, value, fromSidebar) => {
      return dispatch(updateEvent(id, property, value, fromSidebar))
    },
    updateActiveEvent: (id) => {
      return dispatch(updateActiveEvent(id))
    },
    changeActiveField: (field) => {
      return dispatch(changeActiveField(field))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventRowInfoCell)
