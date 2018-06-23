import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { Editor, EditorState, ContentState } from 'draft-js'
import { allCurrenciesList } from '../../../helpers/countriesToCurrencyList'

import { updateEvent } from '../../../actions/planner/eventsActions'
import { changeActiveField } from '../../../actions/planner/activeFieldActions'

import { updateEventBackend } from '../../../apollo/event'

class PlannerSideBarInfoField extends Component {
  constructor (props) {
    super(props)

    const { property, id } = props
    const { events } = props.events

    const contentState = events.filter(event => event.id === id)[0][property]

    this.state = {
      editorState: EditorState.createWithContent(contentState)
    }

    this.onChange = (editorState) => {
      this.setState({editorState: editorState})
      const contentState = editorState.getCurrentContent()
      this.props.updateEvent(id, property, contentState, true)
    }
  }

  // shouldComponentUpdate (nextProps) {
  //   const { id, property } = this.props
  //   const { refetch, updatedId, updatedProperty } = this.props.events
  //   if (refetch) {
  //     return true
  //   } else if (updatedId === id && updatedProperty === property) {
  //     return true
  //   } else if ((nextProps.activeEventId === id && nextProps.activeField === property) || (this.props.activeEventId === id && this.props.activeField === property)) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.events.updatedFromSidebar) {
      const { property, id } = nextProps
      const { events } = nextProps.events
      const contentState = events.filter(event => event.id === id)[0][property]
      this.setState({editorState: EditorState.createWithContent(contentState)})
    }
  }

  handleCurrencySelect (e) {
    const { id } = this.props
    this.props.updateEvent(id, 'currency', e.target.value, true)
    this.props.updateEventBackend({
      variables: {
        id,
        currency: e.target.value
      }
    })
  }

  handleOnBlur () {
    const { id, property } = this.props
    this.props.updateEventBackend({
      variables: {
        id,
        [property]: this.state.editorState.getCurrentContent().getPlainText()
      }
    })
  }

  render () {
    const { property, id } = this.props
    const { events } = this.props.events
    const eventCurrency = events.filter(event => event.id === id)[0].currency
    return (
      <div style={{cursor: 'text', fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', color: 'rgb(60, 58, 68)', minHeight: '35px', display: 'flex', alignItems: 'center'}} className={`sidebar-${property}`}>
        {property === 'cost' && <select onChange={(e) => this.handleCurrencySelect(e)} value={eventCurrency || ''} onFocus={() => this.props.changeActiveField(property)} style={{backgroundColor: 'transparent', border: 'none'}}>
          {allCurrenciesList().map((currency, i) => {
            return <option key={i} value={currency}>{currency}</option>
          })}
        </select>}
        <Editor editorState={this.state.editorState} onChange={this.onChange} onFocus={() => this.props.changeActiveField(property)} />
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
    updateEvent: (id, property, value, fromSidebar) => {
      return dispatch(updateEvent(id, property, value, fromSidebar))
    },
    changeActiveField: (field) => {
      return dispatch(changeActiveField(field))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(updateEventBackend, {name: 'updateEventBackend'})
)(PlannerSideBarInfoField))
