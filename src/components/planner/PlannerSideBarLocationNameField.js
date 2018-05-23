import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { graphql, compose } from 'react-apollo'
import { Editor, EditorState, ContentState } from 'draft-js'

import { updateEvent } from '../../actions/planner/eventsActions'
import { changeActiveField } from '../../actions/planner/activeFieldActions'

import _ from 'lodash'

class PlannerSideBarInfoField extends Component {
  constructor (props) {
    super(props)
    const { events } = this.props.events
    const thisEvent = events.find(e => {
      return e.id === this.props.id
    })
    let locationContentState = thisEvent.locationName

    this.queryGooglePlaces = _.debounce(this.queryGooglePlaces, 500)

    this.state = {
      editorState: EditorState.createWithContent(locationContentState),
      queryStr: '',
      showDropdown: false,
      showSpinner: false,
      predictions: []
    }

    this.onChange = (editorState) => {
      let oldContentState = this.state.editorState.getCurrentContent()
      let newContentState = editorState.getCurrentContent()

      let oldText = oldContentState.getPlainText()
      let newText = newContentState.getPlainText()

      this.setState({
        editorState: editorState
      }, () => {
        if (newText !== oldText) {
          this.props.updateEvent(this.props.id, 'locationName', newContentState, false)
        }
      })

      // ONLY UPDATE QUERY STR IF STR IS DIFFERENT
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
  }

  queryGooglePlaces (queryStr) {
    if (queryStr.length <= 2) return // dont query for useless fragments. 'eg Si'
    console.log('query google with', queryStr)

    let crossOriginUrl = `https://cors-anywhere.herokuapp.com/`
    let googlePlacesEndpoint = `${crossOriginUrl}https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${process.env.REACT_APP_GOOGLE_API_KEY}&language=en&input=${queryStr}`

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
    if (!nextProps.events.updatedFromSidebar) {
      let thisEvent = nextProps.events.events.find(e => {
        return e.id === nextProps.id
      })
      let locationContentState = thisEvent.locationName
      this.setState({editorState: EditorState.createWithContent(locationContentState)})
    }
    if (nextProps.events.events !== this.props.events.events) {
      // compare this event only
      let oldPropsThisEvent = this.props.events.events.find(e => {
        return e.id === this.props.id
      })
      let nextPropsThisEvent = nextProps.events.events.find(e => {
        return e.id === nextProps.id
      })
      if (nextPropsThisEvent.locationName !== oldPropsThisEvent.locationName) {
        const locationContentState = nextPropsThisEvent.locationName
        this.setState({editorState: EditorState.createWithContent(locationContentState)})
      }
    }
    // check cell focus
  }

  // for editor only. prevents new lines
  handleReturn (event, editorState) {
    return 'handled'
  }

  render () {
    return (
      <div style={{cursor: 'text'}}>
        <Editor editorState={this.state.editorState} onChange={this.onChange} onFocus={() => this.props.changeActiveField('location')} handleReturn={(event, editorState) => this.handleReturn()} />
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

export default connect(mapStateToProps, mapDispatchToProps)(PlannerSideBarInfoField)
