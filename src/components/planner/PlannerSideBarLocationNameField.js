import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { graphql, compose } from 'react-apollo'
import { Editor, EditorState, ContentState } from 'draft-js'

import LocationCellDropdown from './LocationCellDropdown'

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

  handleClickOutside () {
    this.setState({
      showDropdown: false,
      showSpinner: false,
      predictions: []
    })
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
        let locationObj = {
          verified: true,
          name: name,
          address: address,
          latitude: latitude,
          longitude: longitude
        }
        this.props.updateEvent(this.props.id, 'locationName', nameContentState, false)
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

  // for editor only. prevents new lines
  handleReturn (event, editorState) {
    return 'handled'
  }

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
        // this.props.updateEvent(this.props.id, 'locationAddress', null, false)
        this.props.updateEvent(this.props.id, 'locationObj', locationObj, false)
      } else if (locationObj && !locationNameInEditor) {
        this.props.updateEvent(this.props.id, 'locationName', ContentState.createFromText(''), false)
        // this.props.updateEvent(this.props.id, 'locationAddress', ContentState.createFromText(''), false)
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

  render () {
    return (
      <div className={`ignoreRightBarLocation`} style={{cursor: 'text', position: 'relative'}} onKeyDown={e => this.handleKeyDown(e)}>
        <Editor editorState={this.state.editorState} onChange={this.onChange} onFocus={() => this.props.changeActiveField('location')} handleReturn={(event, editorState) => this.handleReturn()} />
        {this.state.showDropdown &&
          <LocationCellDropdown openedIn={'rightbar'} showSpinner={this.state.showSpinner} predictions={this.state.predictions} selectLocation={prediction => this.selectLocation(prediction)} handleClickOutside={() => this.handleClickOutside()} outsideClickIgnoreClass={`ignoreRightBarLocation`} />
        }
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
