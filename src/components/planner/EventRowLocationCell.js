import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Editor, EditorState, ContentState } from 'draft-js'

import LocationCellDropdown from './LocationCellDropdown'

import { updateEvent } from '../../actions/planner/eventsActions'
import { updateActiveEvent } from '../../actions/planner/activeEventActions'
import { changeActiveField } from '../../actions/planner/activeFieldActions'
import { setRightBarFocusedTab } from '../../actions/planner/plannerViewActions'

import _ from 'lodash'

class EventRowLocationCell extends Component {
  constructor (props) {
    super(props)
    const { events } = this.props.events
    const thisEvent = events.find(e => {
      return e.id === this.props.id
    })
    const locationContentState = thisEvent.locationName

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

    // ASYNC RACE. SELECT LOCATION SETSTATE TRIGGERS ONCHANGE, WHICH ALSO SETSTATE. HENCE, IN SELECT LOCATION -> DO NOT SET EDITOR STATE.
    this.onChange = (editorState) => {
      // console.log('EDITORSTATE ONCHANGE TRIGGERED')
      let oldContentState = this.state.editorState.getCurrentContent()
      let newContentState = editorState.getCurrentContent()

      let oldText = oldContentState.getPlainText()
      let newText = newContentState.getPlainText()

      if (newText !== oldText) {
        console.log('oldText', oldText, 'newText', newText)
      }

      this.setState({
        editorState: editorState
      }, () => {
        if (newText !== oldText) {
          // console.log('ONCHANGE SETSTATE FINISHED. DISPATCH REDUX IF TEXT CHANGED')
          // ONLY UPDATE REDUX IF THERE ARE DIFFERENCES IN CONTENT STATE
          // id, property, value, fromSidebar
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
    // fetch place details (name, address, latlng).
    let placeId = prediction.place_id
    let crossOriginUrl = `https://cors-anywhere.herokuapp.com/`
    let placeDetailsEndpoint = `${crossOriginUrl}https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.REACT_APP_GOOGLE_API_KEY}&language=en&&placeid=${placeId}`

    fetch(placeDetailsEndpoint)
      .then(response => {
        return response.json()
      })
      .then(json => {
        // console.log('result', json.result)
        let result = json.result
        let latitude = result.geometry.location.lat
        let longitude = result.geometry.location.lng
        let address = result.formatted_address
        let name = result.name
        // console.log('name', name, 'address', address, 'latlng', latitude, longitude)

        let nameContentState = ContentState.createFromText(name)
        let addressContentState = ContentState.createFromText(address)
        let locationObj = {
          verified: true,
          name: name,
          address: address,
          latitude: latitude,
          longitude: longitude
        }
        this.props.updateEvent(this.props.id, 'locationName', nameContentState, false)
        this.props.updateEvent(this.props.id, 'locationAddress', addressContentState, false)
        this.props.updateEvent(this.props.id, 'locationObj', locationObj, false)

        // console.log('SELECTLOCATION SETSTATE')
        this.setState({
          queryStr: name,
          showDropdown: false,
          showSpinner: false,
          predictions: []
          // DO NOT SET EDITOR STATE HERE. IT WILL TRIGGER ONCHANGE HANDLER. LEAVE IT TO COMPONENTWILLRECEIVEPROPS
        })
      })
      .catch(err => {
        console.log('err', err)
      })
  }

  handleClickOutside () {
    this.setState({
      showDropdown: false,
      showSpinner: false,
      predictions: []
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.events.updatedFromSidebar) {
      const thisEvent = nextProps.events.events.filter(e => {
        return e.id === nextProps.id
      })[0]
      const locationContentState = thisEvent.locationName
      this.setState({editorState: EditorState.createWithContent(locationContentState)})
    }

    // events is inside the events obj...
    // THIS UPDATES THE EDITOR STATE IF EVENT.LOCATIONNAME IN REDUX HAS CHANGED
    if (nextProps.events.events !== this.props.events.events) {
      // console.log('EVENTS ARR HAS CHANGED')
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

    // CHECK IF CELL FOCUS IS LOST. THEN SEND BACKEND THE LOCATIONOBJ
    let isPreviouslyActiveCell = (this.props.activeEventId === this.props.id && this.props.activeField === 'location')
    let isNotNextActiveCell = (nextProps.activeEventId !== nextProps.id || nextProps.activeField !== 'location')
    if (isPreviouslyActiveCell && isNotNextActiveCell) {
      console.log('ACTIVE LOCATION CELL LOST FOCUS')
      // click somewhere else, tab
      let thisEvent = nextProps.events.events.find(e => {
        return e.id === nextProps.id
      })
      console.log('locationObj to send backend', thisEvent.locationObj)
    }
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

  handleOnFocus () {
    this.props.changeActiveField('location')
    if (this.props.activeEventId !== this.props.id) {
      this.props.setRightBarFocusedTab('event')
      this.props.updateActiveEvent(this.props.id)
    }
  }

  // for editor only. prevents new lines
  handleReturn (event, editorState) {
    return 'handled'
  }

  // for component
  handleKeyDown (e) {
    // console.log(e.key)
    // esc will close dropdown, undo changes
    if (e.key === 'Escape') {
      console.log('esc')
      let thisEvent = this.props.events.events.find(e => {
        return e.id === this.props.id
      })
      let locationObj = thisEvent.locationObj
      let locationName = locationObj ? locationObj.name : ''
      let nameContentState = ContentState.createFromText(locationName)
      this.props.updateEvent(this.props.id, 'locationName', nameContentState, false)
      this.handleClickOutside()
    }
    // enter/tab confirms changes, constructs location obj
    if (e.key === 'Enter' || e.key === 'Tab') {
      console.log('enter/tab')
      let thisEvent = this.props.events.events.find(e => {
        return e.id === this.props.id
      })
      let locationObj = thisEvent.locationObj
      // console.log('thisEvent', thisEvent)
      let locationNameInEditor = thisEvent.locationName.getPlainText()
      // what about many spaces?
      // if no location, hv str -> create location with name only
      // if hv location, hv str -> change to unverified. check str is equal. verified, unverified
      // if hv location, no str -> clear the location
      // if no location, no str -> do nothing
      if (!locationObj && !locationNameInEditor) {
        // do nothing
      } else if (!locationObj && locationNameInEditor) {
        let locationObj = {
          verified: false,
          name: locationNameInEditor,
          address: null,
          latitude: null,
          longitude: null
        }
        this.props.updateEvent(this.props.id, 'locationAddress', null, false)
        this.props.updateEvent(this.props.id, 'locationObj', locationObj, false)
      } else if (locationObj && !locationNameInEditor) {
        this.props.updateEvent(this.props.id, 'locationName', ContentState.createFromText(''), false)
        this.props.updateEvent(this.props.id, 'locationAddress', ContentState.createFromText(''), false)
        this.props.updateEvent(this.props.id, 'locationObj', null, false)
      } else if (locationObj && locationNameInEditor) {
        // check if name matches
        if (locationObj.name !== locationNameInEditor) {
          let newLocationObj = {
            verified: false,
            name: locationNameInEditor,
            address: locationObj.address,
            latitude: locationObj.latitude,
            longitude: locationObj.longitude
          }
          this.props.updateEvent(this.props.id, 'locationObj', newLocationObj, false)
        }
      }

      this.handleClickOutside()
    }
  }

  // is this still needed?
  handleOnBlur (event) {
    this.setState({focusClicked: false})
  }

  render () {
    const isActive = this.props.activeEventId === this.props.id && this.props.activeField === 'location'
    return (
      <div className={`planner-table-cell ignoreLocationCell${this.props.id}`} onClick={this.focus} style={{position: 'relative', cursor: 'text', minHeight: '83px', display: 'flex', alignItems: 'center', wordBreak: 'break-word', outline: isActive ? '1px solid #ed685a' : 'none', color: isActive ? '#ed685a' : 'rgba(60, 58, 68, 1)'}} onKeyDown={e => this.handleKeyDown(e)}>
        <Editor editorState={this.state.editorState} onChange={this.onChange} ref={element => { this.editor = element }} onFocus={() => this.handleOnFocus()} onBlur={event => this.handleOnBlur(event)} handleReturn={(event, editorState) => this.handleReturn()} />
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
    },
    setRightBarFocusedTab: (tabName) => {
      return dispatch(setRightBarFocusedTab(tabName))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventRowLocationCell)
