import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { Editor, EditorState, ContentState } from 'draft-js'
import { allCurrenciesList } from '../../helpers/countriesToCurrencyList'

import { updateEvent } from '../../actions/planner/eventsActions'
import { updateActiveEvent } from '../../actions/planner/activeEventActions'
import { changeActiveField } from '../../actions/planner/activeFieldActions'
import { setRightBarFocusedTab } from '../../actions/planner/plannerViewActions'

import { updateEventBackend } from '../../apollo/event'

const eventPropertyNames = {
  Event: 'eventType',
  Price: 'cost',
  Notes: 'notes',
  'Booking Service': 'bookingService',
  'Confirmation Number': 'bookingConfirmation'
}

const getEventProp = (columnInput, eventInput) => {
  const eventProperties = {
    Currency: eventInput.currency,
    Event: eventInput.eventType,
    Price: eventInput.cost,
    Notes: eventInput.notes,
    'Booking Service': eventInput.bookingService,
    'Confirmation Number': eventInput.bookingConfirmation
  }

  return eventProperties[columnInput]
}

class EventRowInfoCell extends Component {
  constructor (props) {
    super(props)
    const { column, id } = props
    const { events } = this.props.events
    const value = getEventProp(column, events.filter(event => event.id === id)[0])

    this.state = {
      editorState: EditorState.createWithContent(value),
      initialValue: value
    }

    this.onChange = (editorState) => {
      const { column, id } = this.props
      const oldContentState = this.state.editorState.getCurrentContent()
      const newContentState = editorState.getCurrentContent()

      const oldText = oldContentState.getPlainText()
      const newText = newContentState.getPlainText()
      const property = eventPropertyNames[column]
      this.setState({editorState: editorState}, () => {
        if (newText !== oldText) {
          // id, property, value, fromSidebar
          this.props.updateEvent(id, property, newContentState, false)
        }
      })
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
    if (nextProps.events.updatedFromSidebar || nextProps.column !== this.props.column || nextProps.events.refetch) {
      const { column, id } = nextProps
      const { events } = nextProps.events
      const value = getEventProp(column, events.filter(event => event.id === id)[0])
      this.setState({editorState: EditorState.createWithContent(value)})
    }
  }

  shouldComponentUpdate (nextProps) {
    const { column, id } = nextProps
    const { refetch, updatedId, updatedProperty } = nextProps.events
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

  handleOnFocus () {
    const property = eventPropertyNames[this.props.column]
    this.props.changeActiveField(property)
    if (this.props.activeEventId !== this.props.id) {
      // this.props.setRightBarFocusedTab('event')
      this.props.updateActiveEvent(this.props.id)
    }
  }

  handleCellClick (e) {
    const property = eventPropertyNames[this.props.column]
    if (this.props.activeEventId !== this.props.id || this.props.activeField !== property) {
      this.handleOnFocus()
    } else {
      this.focus(e)
    }
  }

  handleKeyDown (e) {
    const { column, id } = this.props
    const property = eventPropertyNames[column]

    if (e.key === 'Escape') {
      const editorState = EditorState.createWithContent(this.state.initialValue)
      this.setState({
        editorState
      })
      this.props.updateEvent(id, property, this.state.initialValue, false)
    }
  }

  handleOnBlur () {
    const { id, column } = this.props
    const property = eventPropertyNames[column]
    this.setState({
      initialValue: this.state.editorState.getCurrentContent()
    }, () => {
      this.props.updateEventBackend({
        variables: {
          id,
          [property]: this.state.editorState.getCurrentContent().getPlainText()
        }
      })
    })
  }

  handleCurrencySelect (e) {
    const { id } = this.props
    this.props.updateEventBackend({
      variables: {
        id,
        currency: e.target.value
      }
    })
  }

  render () {
    const { column, id } = this.props
    const { events } = this.props.events
    const property = eventPropertyNames[column]
    const isActive = this.props.activeEventId === id && this.props.activeField === property
    const eventCurrency = getEventProp('Currency', events.filter(event => event.id === id)[0])

    // const value = getEventProp(column, events.filter(event => event.id === id)[0])

    return (
      <div onClick={(e) => this.handleCellClick(e)} style={{minHeight: '83px', display: 'flex', alignItems: 'center', wordBreak: 'break-word', outline: isActive ? '1px solid #ed685a' : 'none', color: isActive ? '#ed685a' : 'rgba(60, 58, 68, 1)', padding: '8px'}} onKeyDown={(e) => this.handleKeyDown(e)}>
        {column === 'Price' && <select onChange={(e) => this.handleCurrencySelect(e)} defaultValue={eventCurrency} onFocus={() => this.handleOnFocus()} style={{backgroundColor: 'transparent', border: 'none'}}>
          {allCurrenciesList().map((currency, i) => {
            return <option key={i} value={currency}>{currency}</option>
          })}
        </select>}
        <Editor editorState={this.state.editorState} onChange={this.onChange} ref={(element) => { this.editor = element }} onFocus={() => this.handleOnFocus()} onBlur={() => this.handleOnBlur()} />
      </div>
    )
  }
}

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
    },
    setRightBarFocusedTab: (tabName) => {
      return dispatch(setRightBarFocusedTab(tabName))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(updateEventBackend, {name: 'updateEventBackend'})
)(EventRowInfoCell))
