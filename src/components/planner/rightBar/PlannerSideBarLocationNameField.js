import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Editor, EditorState, ContentState } from 'draft-js'

import LocationCellDropdown from '../LocationCellDropdown'

import { updateEvent } from '../../../actions/planner/eventsActions'
import { changeActiveField } from '../../../actions/planner/activeFieldActions'

import { graphql, compose } from 'react-apollo'
import { updateEventBackend } from '../../../apollo/event'
// import { queryItinerary } from '../../../apollo/itinerary'

import _ from 'lodash'

class PlannerSideBarLocationNameField extends Component {
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
      predictions: [],
      overwriteContentState: false
    }

    this.focus = (e) => {
      if (e.target.className === `ignoreRightBarLocation`) {
        // console.log('move focus to end')
        this.editor.focus()
        this.setState({editorState: EditorState.moveFocusToEnd(this.state.editorState)})
      } else {
        // console.log('focus')
        this.editor.focus()
      }
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
          this.props.updateEvent(this.props.id, 'locationName', newContentState, true)
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
    // console.log('query google with', queryStr)

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
        let countryCode
        let addressComponent = json.result.address_components.find(e => {
          return e.types.includes('country')
        })
        if (addressComponent) {
          countryCode = addressComponent.short_name
        }

        let nameContentState = ContentState.createFromText(name)
        let locationObj = {
          verified: true,
          name: name,
          address: address,
          latitude: latitude,
          longitude: longitude,
          countryCode: countryCode
        }

        // console.log('SELECTLOCATION SETSTATE')
        this.setState({
          queryStr: name,
          showDropdown: false,
          showSpinner: false,
          predictions: [],
          overwriteContentState: true
        }, () => {
          this.props.updateEvent(this.props.id, 'locationName', nameContentState, true)
          this.props.updateEvent(this.props.id, 'locationObj', locationObj, true)
        })
        this.props.updateEventBackend({
          variables: {
            id: this.props.id,
            locationData: locationObj
          }
          // refetchQueries: [{
          //   query: queryItinerary,
          //   variables: {
          //     id: this.props.events.events.find(e => {
          //       return e.id === this.props.id
          //     }).ItineraryId
          //   }
          // }]
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

    let oldPropsThisEvent = this.props.events.events.find(e => {
      return e.id === this.props.id
    })
    let nextPropsThisEvent = nextProps.events.events.find(e => {
      return e.id === nextProps.id
    })
    if (oldPropsThisEvent.locationName !== nextPropsThisEvent.locationName) {
      if (this.state.overwriteContentState) {
        let nameContentState = nextPropsThisEvent.locationName
        // console.log('overwrite location name')
        this.setState({
          editorState: EditorState.createWithContent(nameContentState),
          overwriteContentState: false
        })
      }
    }

    // IF LOCATION OBJ CHANGED, UPDATE EDITORSTATE WITH NEW NAME.
    if (oldPropsThisEvent.locationObj !== nextPropsThisEvent.locationObj) {
      let nameContentState = nextPropsThisEvent.locationObj ? ContentState.createFromText(nextPropsThisEvent.locationObj.name) : ContentState.createFromText('')

      this.setState({
        editorState: EditorState.createWithContent(nameContentState)
      })
    }

    // need to update location name if activeEventId changes
    if (nextProps.activeEventId !== this.props.activeEventId) {
      // console.log('active event id changed')
      let activeEvent = nextProps.events.events.find(e => {
        return e.id === nextProps.activeEventId
      })
      if (!activeEvent) return
      let nameContentState = activeEvent.locationName
      this.setState({
        editorState: EditorState.createWithContent(nameContentState)
      })
    }
  }

  handleOnBlur () {
    if (!this.state.showDropdown) {
      // console.log('blur')
      let thisEvent = this.props.events.events.find(e => {
        return e.id === this.props.id
      })

      var locationDataForBackend = thisEvent.locationObj
      let locationNameStr = thisEvent.locationName.getPlainText()
      if (!thisEvent.locationObj && !locationNameStr) {
        // do nothing
      } else if (!thisEvent.locationObj && locationNameStr) {
        let locationObj = {
          verified: false,
          name: locationNameStr,
          address: null,
          latitude: null,
          longitude: null
        }
        locationDataForBackend = locationObj
      } else if (thisEvent.locationObj && !locationNameStr) {
        locationDataForBackend = null
      } else if (thisEvent.locationObj && locationNameStr) {
        if (thisEvent.locationObj.name !== locationNameStr) {
          // modify location obj. always verified false
          let locationObj = {
            verified: false,
            name: locationNameStr,
            address: thisEvent.locationObj.address,
            latitude: thisEvent.locationObj.latitude,
            longitude: thisEvent.locationObj.longitude,
            countryCode: thisEvent.locationObj.countryCode
          }
          locationDataForBackend = locationObj
        }
      }

      // need to send backend the most updated locationObj
      // console.log('locationDataForBackend', locationDataForBackend)
      let nameContentState = locationDataForBackend ? ContentState.createFromText(locationDataForBackend.name) : ContentState.createFromText('')

      this.props.updateEvent(this.props.id, 'locationName', nameContentState, true)
      this.props.updateEvent(this.props.id, 'locationObj', locationDataForBackend, true)

      this.props.updateEventBackend({
        variables: {
          id: this.props.id,
          locationData: locationDataForBackend
        }
        // refetchQueries: [{
        //   query: queryItinerary,
        //   variables: {
        //     id: this.props.events.events.find(e => {
        //       return e.id === this.props.id
        //     }).ItineraryId
        //   }
        // }]
      })
    } // close if
  }

  // for editor only. prevents new lines
  handleReturn (event, editorState) {
    return 'handled'
  }

  handleKeyDown (e) {
    // console.log(e.key)
    // esc will close dropdown, undo changes
    if (e.key === 'Escape') {
      let thisEvent = this.props.events.events.find(e => {
        return e.id === this.props.id
      })
      let locationObj = thisEvent.locationObj
      let locationName = locationObj ? locationObj.name : ''
      let nameContentState = ContentState.createFromText(locationName)
      this.setState({
        overwriteContentState: true
      }, () => {
        this.props.updateEvent(this.props.id, 'locationName', nameContentState, true)
        this.handleClickOutside()
      })
    }
    // enter/tab confirms changes, constructs location obj
    if (e.key === 'Enter' || e.key === 'Tab') {
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
        this.props.updateEvent(this.props.id, 'locationObj', locationObj, true)
      } else if (locationObj && !locationNameInEditor) {
        this.props.updateEvent(this.props.id, 'locationName', ContentState.createFromText(''), true)
        this.props.updateEvent(this.props.id, 'locationObj', null, true)
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
          this.props.updateEvent(this.props.id, 'locationObj', newLocationObj, true)
        }
      }

      this.handleClickOutside()
    }
  }

  render () {
    return (
      <div className={`ignoreRightBarLocation`} onClick={this.focus} style={{position: 'relative', cursor: 'text', fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: '16px', color: 'rgb(60, 58, 68)', minHeight: '35px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}} onKeyDown={e => this.handleKeyDown(e)}>
        <div style={{display: 'flex'}}>
          <Editor editorState={this.state.editorState} onChange={this.onChange} ref={element => { this.editor = element }} onFocus={() => this.props.changeActiveField('location')} handleReturn={(event, editorState) => this.handleReturn()} onBlur={() => this.handleOnBlur()} />
          {this.props.locationObj &&
            <React.Fragment>
              {this.props.locationObj.verified &&
                <i className='material-icons' style={{color: 'rgb(67, 132, 150)', marginLeft: '10px'}}>check_circle</i>
              }
              {!this.props.locationObj.verified &&
                <i className='material-icons' style={{color: 'orange', marginLeft: '10px'}}>help</i>
              }
            </React.Fragment>
          }
        </div>
        {this.state.showDropdown &&
          <LocationCellDropdown openedIn={'rightBar'} showSpinner={this.state.showSpinner} predictions={this.state.predictions} selectLocation={prediction => this.selectLocation(prediction)} handleClickOutside={() => this.handleClickOutside()} outsideClickIgnoreClass={`ignoreRightBarLocation`} />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.events,
    activeEventId: state.activeEventId
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
)(PlannerSideBarLocationNameField))
