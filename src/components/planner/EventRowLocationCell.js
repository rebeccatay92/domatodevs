import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Editor, EditorState, ContentState } from 'draft-js'

import LocationCellDropdown from './LocationCellDropdown'

import { updateEvent } from '../../actions/planner/eventsActions'
import { updateActiveEvent } from '../../actions/planner/activeEventActions'
import { changeActiveField } from '../../actions/planner/activeFieldActions'

import _ from 'lodash'


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

    // ASYNC RACE. SELECT LOCATION SETSTATE TRIGGERS ONCHANGE, WHICH ALSO SETSTATE.
    this.onChange = (editorState) => {
      console.log('EDITORSTATE ONCHANGE TRIGGERED')
      let oldContentState = this.state.editorState.getCurrentContent()
      let newContentState = editorState.getCurrentContent()

      let oldText = oldContentState.getPlainText()
      let newText = newContentState.getPlainText()

      console.log('oldText', oldText, 'newText', newText)

      this.setState({
        editorState: editorState
      }, () => {
        // id, property, value, fromSidebar
        console.log('ONCHANGE SETSTATE FINISHED. DISPATCH REDUX')
        this.props.updateEvent(this.props.id, 'location', newContentState, false)
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

  selectLocation (prediction) {
    // console.log('this.state', this.state)
    console.log('CLICKED LOCATION', prediction)
    // close dropdown, change text, query place details
    let placeName = prediction.structured_formatting.main_text
    let placeId = prediction.place_id

    // find new editor state, content state, updateEvent using redux
    let updatedContentState = ContentState.createFromText(placeName)
    let updatedEditorState = EditorState.createWithContent(updatedContentState)

    // console.log('updated content state', updatedContentState.getPlainText())

    // SET STATE HERE IS ASYNC. THE ONCHANGE IS TRIGGERED WITH AN OLD EDITOR STATE BEFORE SETSTATE HERE FINISHES.
    console.log('SELECTLOCATION SETSTATE')
    this.setState({
      queryStr: placeName,
      showDropdown: false,
      showSpinner: false,
      predictions: [],
      editorState: updatedEditorState // editor state with new location name
    }, () => {
      console.log('SELECTLOCATION SETSTATE FINISHED', this.state.editorState.getCurrentContent().getPlainText())
      // this.props.updateEvent(this.props.id, 'location', updatedContentState, false) // update content state in redux
    })

    // fetch place details (name, address, latlng).
    // set locationData object to send to backend

    // let crossOriginUrl = `https://cors-anywhere.herokuapp.com/`
    // let placeDetailsEndpoint = `${crossOriginUrl}https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.REACT_APP_GOOGLE_API_KEY}&language=en&&placeid=${placeId}`
    //
    // fetch(placeDetailsEndpoint)
    //   .then(response => {
    //     return response.json()
    //   })
    //   .then(json => {
    //     // console.log('result', json.result)
    //     let result = json.result
    //     let latitude = result.geometry.location.lat
    //     let longitude = result.geometry.location.lng
    //     let address = result.formatted_address
    //     let name = result.name
    //     console.log('name', name, 'address', address, 'latlng', latitude, longitude)
    //   })
    //   .catch(err => {
    //     console.log('err', err)
    //   })
  }

  handleClickOutside () {
    this.setState({
      showDropdown: false,
      showSpinner: false,
      predictions: []
    })
  }

  handleKeyDown (e) {
    // console.log(e.key)
    if (e.key === 'Tab' || e.key === 'Escape') {
      this.handleClickOutside()
    }
    if (e.key === 'Enter') {
      console.log('enter was hit')
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.events.updatedFromSidebar) {
      const thisEvent = nextProps.events.filter(e => {
        return e.id === nextProps.id
      })[0]
      const locationContentState = thisEvent.location
      this.setState({editorState: EditorState.createWithContent(locationContentState)})
    }

    // events is inside the events obj...
    // if (nextProps.events.events !== this.props.events.events) {
    //   // console.log('EVENTS ARR HAS CHANGED')
    //   // compare this event only
    //   let oldPropsThisEvent = this.props.events.events.find(e => {
    //     return e.id === this.props.id
    //   })
    //   let nextPropsThisEvent = nextProps.events.events.find(e => {
    //     return e.id === nextProps.id
    //   })
    //   console.log('nextProps location text', nextPropsThisEvent.location.getPlainText())
    //   if (nextPropsThisEvent.location !== oldPropsThisEvent.location) {
    //     console.log('THIS EVENT HAS CHANGED. ID IS', nextProps.id, nextPropsThisEvent)
    //     const locationContentState = nextPropsThisEvent.location
    //     console.log('nextprops location text is', locationContentState.getPlainText())
    //     this.setState({editorState: EditorState.createWithContent(locationContentState)})
    //   }
    // }
  }

  // IS THIS CORRECT?
  // shouldComponentUpdate (nextProps) {
  //   const { refetch, updatedId, updatedProperty } = this.props.events
  //   if (refetch) {
  //     return true
  //   } else if (updatedId === this.props.id && updatedProperty === 'location') {
  //     return true
  //   } else if ((nextProps.activeEventId === this.props.id && nextProps.activeField === 'location') || (this.props.activeEventId === this.props.id && this.props.activeField === 'location')) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  render () {
    const isActive = this.props.activeEventId === this.props.id && this.props.activeField === 'location'
    return (
      <div className={`planner-table-cell ignoreLocationCell${this.props.id}`} onClick={this.focus} style={{position: 'relative', cursor: 'text', minHeight: '83px', display: 'flex', alignItems: 'center', wordBreak: 'break-word', outline: isActive ? '1px solid #ed685a' : 'none', color: isActive ? '#ed685a' : 'rgba(60, 58, 68, 1)'}} onKeyDown={e => this.handleKeyDown(e)}>
        <Editor editorState={this.state.editorState} onChange={this.onChange} ref={element => { this.editor = element }} onFocus={() => {
          this.props.changeActiveField('location')
          this.props.updateActiveEvent(this.props.id)
        }} onBlur={() => this.setState({focusClicked: false})} />
        {this.state.showDropdown &&
          <LocationCellDropdown showSpinner={this.state.showSpinner} predictions={this.state.predictions} selectLocation={prediction => this.selectLocation(prediction)} handleClickOutside={() => this.handleClickOutside()} outsideClickIgnoreClass={`ignoreLocationCell${this.props.id}`} />
          // ignore outside click classname depends on id. else clicking other editors wont be detected as 'outside'
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
