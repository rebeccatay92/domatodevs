import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Editor, EditorState, ContentState } from 'draft-js'

import LocationCellDropdown from './LocationCellDropdown'

import { updateEvent } from '../../actions/planner/eventsActions'
import { updateActiveEvent } from '../../actions/planner/activeEventActions'
import { changeActiveField } from '../../actions/planner/activeFieldActions'
import { setRightBarFocusedTab } from '../../actions/planner/plannerViewActions'

import { graphql, compose } from 'react-apollo'
import { updateEventBackend } from '../../apollo/event'

import _ from 'lodash'

const eventPropertyNames = {
  Event: 'eventType',
  Price: 'cost',
  Notes: 'notes',
  'Booking Service': 'bookingService',
  'Confirmation Number': 'bookingConfirmation',
  Location: 'location'
}

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
      predictions: [],
      overwriteContentState: false,
      cellFocus: true
    }

    this.onChange = (editorState) => {
      console.log('editor state onchange')
      let oldContentState = this.state.editorState.getCurrentContent()
      let newContentState = editorState.getCurrentContent()

      let oldText = oldContentState.getPlainText()
      let newText = newContentState.getPlainText()

      this.setState({
        editorState: editorState
      }, () => {
        if (newText !== oldText) {
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
      if (e.target.className === `planner-table-cell ignoreLocationCell${this.props.id}`) {
        console.log('move focus to end')
        this.setState({
          editorState: EditorState.moveFocusToEnd(this.state.editorState),
          cellFocus: true
        })
        this.editor.focus()
      } else {
        console.log('focus')
        this.editor.focus()
        this.setState({cellFocus: true})
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
        // console.log('place result', json.result)
        let result = json.result
        let latitude = result.geometry.location.lat
        let longitude = result.geometry.location.lng
        let address = result.formatted_address
        let name = result.name
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

        this.setState({
          queryStr: name,
          showDropdown: false,
          showSpinner: false,
          predictions: [],
          overwriteContentState: true
        }, () => {
          this.props.updateEvent(this.props.id, 'locationName', nameContentState, false)
          this.props.updateEvent(this.props.id, 'locationObj', locationObj, false)
        })
        this.props.updateEventBackend({
          variables: {
            id: this.props.id,
            locationData: locationObj
          }
        })
        // this.props.updateEventBackend({
        //   variables: {
        //     id: this.props.id,
        //     locationData: locationObj
        //   },
        //   refetchQueries: [{
        //     query: queryItinerary,
        //     variables: {
        //       id: this.props.events.events.find(e => {
        //         return e.id === this.props.id
        //       }).ItineraryId
        //     }
        //   }]
        // })
      })
      .catch(err => {
        console.log('err', err)
      })
  }

  // click outside of dropdown only
  handleClickOutside () {
    console.log('click outside')
    this.setState({
      showDropdown: false,
      showSpinner: false,
      predictions: [],
      cellClickedTwice: false,
      cellFocus: true
    })
  }

  componentWillReceiveProps (nextProps) {
    const property = eventPropertyNames[this.props.column]
    // KEEPS LOCATION CELL IN SYNC WITH RIGHTBAR
    if (nextProps.events.updatedFromSidebar || nextProps.column !== this.props.column || nextProps.events.refetch) {
      const thisEvent = nextProps.events.events.find(e => {
        return e.id === nextProps.id
      })
      const locationContentState = thisEvent.locationName
      this.setState({editorState: EditorState.createWithContent(locationContentState)})
    }

    // compare old event with new event. if local state overwriteContentState (for esc or dropdown select), set new editor state
    let oldPropsThisEvent = this.props.events.events.find(e => {
      return e.id === this.props.id
    })
    let nextPropsThisEvent = nextProps.events.events.find(e => {
      return e.id === nextProps.id
    })
    if (oldPropsThisEvent.locationName !== nextPropsThisEvent.locationName) {
      if (this.state.overwriteContentState) {
        let nameContentState = nextPropsThisEvent.locationName
        console.log('overwrite location name')
        this.setState({
          editorState: EditorState.moveFocusToEnd(EditorState.createWithContent(nameContentState)),
          overwriteContentState: false
        })
      }
    }

    // if event changed day/date (from right bar). current cell will receive new this.props.id.
    if (nextProps.id !== this.props.id) {
      const thisEvent = nextProps.events.events.find(e => {
        return e.id === nextProps.id
      })
      const locationContentState = thisEvent.locationName
      this.setState({editorState: EditorState.createWithContent(locationContentState)})
    }

    if (nextProps.activeEventId !== this.props.activeEventId || nextProps.activeField !== this.props.activeField) {
      if (nextProps.activeEventId === this.props.id && nextProps.activeField === 'location') {
        this.cell.focus()
        this.setState({cellFocus: true})
      }
    }

    if (nextProps.activeEventId !== this.props.activeEventId || nextProps.activeField !== this.props.activeField) {
      this.setState({cellClickedTwice: false})
    }
  }

  // on editor blur
  handleOnBlur () {
    // if dropdown is open, blur needs to be overriden
    // selectLocation -> send backend manually.
    if (!this.state.showDropdown) {
      this.setState({editorFocus: false})
      console.log('blur')
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
        console.log('set location data to null')
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
      console.log('locationDataForBackend', locationDataForBackend)
      let nameContentState = locationDataForBackend ? ContentState.createFromText(locationDataForBackend.name) : ContentState.createFromText('')

      this.props.updateEvent(this.props.id, 'locationName', nameContentState, false)
      this.props.updateEvent(this.props.id, 'locationObj', locationDataForBackend, false)

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

  // cell on focus
  handleOnFocus () {
    this.props.changeActiveField('location')
    if (this.props.activeEventId !== this.props.id) {
      // this.props.setRightBarFocusedTab('event')
      this.props.updateActiveEvent(this.props.id)
    }
    this.setState({cellFocus: true})
  }

  handleCellOnBlur () {
    console.log('cell on blur')
    this.setState({cellFocus: false})
    // if blurring, but entering editor, cellFocus should not turn to false
  }

  handleCellClick (e) {
    if (!this.state.cellClickedTwice) {
      this.setState({cellClickedTwice: true})
    } else {
      this.focus(e)
    }
    this.setState({cellFocus: true})
  }

  // for editor only
  handleReturn (event, editorState) {
    console.log('EDITOR HANDLE RETURN EVENT', event)
    return 'handled'
  }

  handleKeyDown (e, isActive, editorFocus) {
    // if (e.keyCode <= 40 && e.keyCode >= 37 && isActive && !editorFocus) {
    //   this.handleArrowKeyDown(e.keyCode)
    // }

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
        this.props.updateEvent(this.props.id, 'locationName', nameContentState, false)
        this.handleClickOutside()
      })
    }
    // enter/tab confirms changes, constructs location obj
    // need to split into 2. first enter triggers editing
    // 2nd enter confirms, goes to next row
    if (e.key === 'Enter' || e.key === 'Tab') {
      console.log('ENTER OR TAB FIRED', this.state)
      // IMPT: stops extra lines from being inserted into editor state from outside of editor focus
      if (e.key === 'Enter' && !this.state.cellClickedTwice) {
        e.preventDefault()
        console.log('cell not clicked twice')
        this.setState({
          cellClickedTwice: true
        }, () => {
          console.log('editor state', this.state.editorState.getCurrentContent().getPlainText())
          // this.editor.moveFocusToEnd
          this.editor.focus()
          // focus is at beginning
          this.setState({
            cellFocus: true,
            editorState: EditorState.moveFocusToEnd(this.state.editorState)
          })
        })
      }

      if (this.state.cellClickedTwice) {
        console.log('second enter to confirm, go next row?')
        this.editor.blur()
        this.handleClickOutside()
        // this.cell.focus()

        let thisEvent = this.props.events.events.find(e => {
          return e.id === this.props.id
        })
        let locationObj = thisEvent.locationObj
        // console.log('thisEvent', thisEvent)
        let locationNameInEditor = thisEvent.locationName.getPlainText()

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
          this.props.updateEvent(this.props.id, 'locationObj', locationObj, false)
        } else if (locationObj && !locationNameInEditor) {
          this.props.updateEvent(this.props.id, 'locationName', ContentState.createFromText(''), false)
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

        // go to next row
        let thisEventIndex = this.props.events.events.findIndex(e => {
          return e.id === this.props.id
        }) + 1
        console.log('this event index', thisEventIndex, 'max index', this.props.events.events.length)
        if (thisEventIndex < this.props.events.events.length) {
          console.log('next id', (thisEventIndex + 1).toString())
          this.props.updateActiveEvent((thisEventIndex + 1).toString())
        }
      }

    }
  }

  render () {
    // console.log('props id', this.props.id)
    const isActive = this.props.activeEventId === this.props.id && this.props.activeField === 'location' && this.state.cellFocus

    // THIS DIV MUST NOT HAVE ZINDEX, ELSE POSITION FIXED DROPDOWN BECOMES TRANSPARENT
    return (
      <div tabIndex='1' ref={(element) => { this.cell = element }} className={`planner-table-cell ignoreLocationCell${this.props.id}`} onFocus={(e) => this.handleOnFocus(e)} onBlur={() => this.handleCellOnBlur()} onClick={(e) => this.handleCellClick(e)} onContextMenu={(e) => this.handleOnFocus(e)} style={{position: 'relative', minHeight: '83px', display: 'flex', alignItems: 'center', wordBreak: 'break-word', outline: isActive ? '1px solid #ed685a' : 'none', color: isActive ? '#ed685a' : 'rgba(60, 58, 68, 1)', padding: '8px'}} onKeyDown={(e) => this.handleKeyDown(e, isActive, this.state.editorFocus)}>
        <Editor readOnly={!isActive} editorState={this.state.editorState} onChange={this.onChange} ref={element => { this.editor = element }} onFocus={() => this.setState({editorFocus: true, cellFocus: true})} onBlur={() => this.handleOnBlur()} handleReturn={(event, editorState) => this.handleReturn()} />
        {this.state.showDropdown &&
          <LocationCellDropdown openedIn={'table'} showSpinner={this.state.showSpinner} predictions={this.state.predictions} selectLocation={prediction => this.selectLocation(prediction)} handleClickOutside={() => this.handleClickOutside()} outsideClickIgnoreClass={`ignoreLocationCell${this.props.id}`} />
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

export default connect(mapStateToProps, mapDispatchToProps)(compose(
  graphql(updateEventBackend, {name: 'updateEventBackend'})
)(EventRowLocationCell))
