import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Editor, EditorState } from 'draft-js'

import { updateEvent } from '../../actions/planner/eventsActions'
import { updateActiveEvent } from '../../actions/planner/activeEventActions'
import { changeActiveField } from '../../actions/planner/activeFieldActions'

import _ from 'lodash'

import { ClipLoader } from 'react-spinners'

class EventRowLocationCell extends Component {
  constructor (props) {
    super(props)
    const { events } = this.props.events
    const thisEvent = events.find(e => {
      return e.id === this.props.id
    })
    const locationContentState = thisEvent.location

    this.queryGooglePlaces = _.debounce(this.queryGooglePlaces, 500)

    this.state = {
      editorState: EditorState.createWithContent(locationContentState),
      queryStr: '',
      showDropdown: false,
      showSpinner: false,
      predictions: []
    }

    // FOR NOW, PREVENT QUERYING ON EACH CLICK/FOCUS/UNFOCUS BY COMPARING OLD PLAIN TEXT WITH INCOMING PLAIN TEXT.
    // THIS MEANS THE FIRST CLICK/TAB TO FOCUS WILL NOT CAUSE A DROPDOWN
    this.onChange = (editorState) => {
      let oldContentState = this.state.editorState.getCurrentContent()
      let newContentState = editorState.getCurrentContent()

      let oldText = oldContentState.getPlainText()
      let newText = newContentState.getPlainText()

      this.setState({editorState: editorState})
      // id, property, value, fromSidebar
      this.props.updateEvent(this.props.id, 'location', newContentState, false)

      // ONLY UPDATE QUERY STR IF STR IS DIFFERENT
      // IF BACKSPACE TO EMPTY STRING, SPINNER IS TRUE, BUT QUERY DOES NOT RUN. HENCE SPINNER WILL NOT SET BACK TO FALSE
      if (newText !== oldText) {
        // dont query useless fragments
        if (newText.length > 2) {
          this.setState({
            queryStr: newText,
            showDropdown: true,
            showSpinner: true,
            predictions: []
          })
          this.queryGooglePlaces(newText)
        } else {
          this.setState({
            queryStr: newText,
            showDropdown: false,
            showSpinner: false,
            predictions: []
          })
        }
      }
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
    if (queryStr.length <= 2) return // dont query for useless fragments. 'eg Si'
    console.log('query google with', queryStr)

    let crossOriginUrl = `https://cors-anywhere.herokuapp.com/`
    let googlePlacesEndpoint = `${crossOriginUrl}https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${process.env.REACT_APP_GOOGLE_API_KEY}&language=en&input=${queryStr}`

    // var corsHeader = new Headers({
    //   'Allow-Access-Control-Origin': '*'
    // })

    fetch(googlePlacesEndpoint)
      .then(response => {
        return response.json()
      })
      .then(json => {
        console.log('places response', json.predictions)
        this.setState({
          predictions: json.predictions,
          showSpinner: false
        })
      })
      .catch(err => {
        console.log('err', err)
      })
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
      <div className='planner-table-cell' onClick={this.focus} style={{position: 'relative', cursor: 'text', minHeight: '83px', display: 'flex', alignItems: 'center', wordBreak: 'break-word', outline: isActive ? '1px solid #ed685a' : 'none', color: isActive ? '#ed685a' : 'rgba(60, 58, 68, 1)'}}>
        <Editor editorState={this.state.editorState} onChange={this.onChange} ref={element => { this.editor = element }} onFocus={() => {
          this.props.changeActiveField('location')
          this.props.updateActiveEvent(this.props.id)
        }} onBlur={() => this.setState({focusClicked: false, showDropdown: false})} />
        {this.state.showDropdown &&
          <div style={{position: 'absolute', top: '83px', left: 0, background: 'white', width: '100%', border: '1px solid red', zIndex: '2', minHeight: '35px'}}>
            <ClipLoader color={'#000000'} size={35} loading={this.state.showSpinner} />
            {!this.state.showSpinner && this.state.predictions.length === 0 &&
              <h6 style={{background: 'white', margin: 0, cursor: 'pointer', minHeight: '35px', fontFamily: 'Roboto, san-serif', fontWeight: '300', fontSize: '16px', lineHeight: '24px', padding: '8px'}}>No results found</h6>
            }
            {!this.state.showSpinner && this.state.predictions.map((prediction, i) => {
              return <h6 key={i} style={{background: 'white', margin: 0, cursor: 'pointer', minHeight: '35px', fontFamily: 'Roboto, san-serif', fontWeight: '300', fontSize: '16px', lineHeight: '24px', padding: '8px'}}>{prediction.structured_formatting.main_text}</h6>
            })}
          </div>
        }
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
