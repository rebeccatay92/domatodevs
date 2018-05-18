import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Editor, EditorState } from 'draft-js'

import { updateEvent } from '../../actions/planner/eventsActions'
import { updateActiveEvent } from '../../actions/planner/activeEventActions'
import { changeActiveField } from '../../actions/planner/activeFieldActions'

import _ from 'lodash'

class EventRowLocationCell extends Component {
  constructor (props) {
    super(props)
    const { events } = this.props.events
    const thisEvent = events.filter(e => {
      return e.id === this.props.id
    })[0]
    const locationContentState = thisEvent.location

    this.queryGooglePlaces = _.debounce(this.queryGooglePlaces, 500)

    this.state = {
      editorState: EditorState.createWithContent(locationContentState),
      queryStr: '',
      showDropdown: false,
      predictions: []
    }

    this.onChange = (editorState) => {
      this.setState({editorState: editorState})
      const contentState = editorState.getCurrentContent()
      // id, property, value, fromSidebar
      this.props.updateEvent(this.props.id, 'location', contentState, false)

      // ON CHANGE UPDATE QUERY STR
      const queryStrFromContentState = contentState.getPlainText()
      // console.log('plain text querystr', queryStrFromContentState)
      this.setState({
        queryStr: queryStrFromContentState,
        showDropdown: true // requires losing focus, or select result to close results dropdown
      })
      this.queryGooglePlaces(queryStrFromContentState)
    }

    this.focus = (e) => {
      if (e.target.className === 'planner-table-cell') {
        this.editor.focus()
        this.setState({editorState: EditorState.moveFocusToEnd(this.state.editorState)})
      } else {
        this.editor.focus()
      }
    }
  }

  queryGooglePlaces (queryStr) {
    if (!queryStr) return
    console.log('query google with', queryStr)

    let crossOriginUrl = `https://cors-anywhere.herokuapp.com/`
    let googlePlacesEndpoint = `${crossOriginUrl}https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${process.env.REACT_APP_GOOGLE_API_KEY}&language=en&input=${queryStr}`

    // var corsHeader = new Headers({
    //   'Allow-Access-Control-Origin': '*'
    // })

    // fetch(googlePlacesEndpoint)
    //   .then(response => {
    //     return response.json()
    //   })
    //   .then(json => {
    //     console.log('places response', json.predictions)
    //     this.setState({
    //       predictions: json.predictions
    //     })
    //   })
    //   .catch(err => {
    //     console.log('err', err)
    //   })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.events.updatedFromSidebar) {
      const thisEvent = nextProps.events.filter(e => {
        return e.id === nextProps.id
      })[0]
      const locationContentState = thisEvent.location
      this.setState({editorState: EditorState.createWithContent(locationContentState)})
    }
  }

  // IS THIS CORRECT?
  shouldComponentUpdate (nextProps) {
    const { refetch, updatedId, updatedProperty } = this.props.events
    if (refetch) {
      return true
    } else if (updatedId === this.props.id && updatedProperty === 'location') {
      return true
    } else if ((nextProps.activeEventId === this.props.id && nextProps.activeField === 'location') || (this.props.activeEventId === this.props.id && this.props.activeField === 'location')) {
      return true
    } else {
      return false
    }
  }

  render () {
    const isActive = this.props.activeEventId === this.props.id && this.props.activeField === 'location'
    return (
      <div className='planner-table-cell' onClick={this.focus} style={{cursor: 'text', minHeight: '83px', display: 'flex', alignItems: 'center', wordBreak: 'break-word', outline: isActive ? '1px solid #ed685a' : 'none', color: isActive ? '#ed685a' : 'rgba(60, 58, 68, 1)'}}>
        <Editor editorState={this.state.editorState} onChange={this.onChange} ref={element => { this.editor = element }} onFocus={() => {
          this.props.changeActiveField('location')
          this.props.updateActiveEvent(this.props.id)
        }} onBlur={() => this.setState({focusClicked: false})} />
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventRowLocationCell)
