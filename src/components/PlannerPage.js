import React, { Component } from 'react'

import { graphql } from 'react-apollo'
import { queryItinerary } from '../apollo/itinerary'

import { connect } from 'react-redux'
import { toggleSpinner } from '../actions/spinnerActions'
import { initializeEvents } from '../actions/planner/eventsActions'

import { EditorState, convertFromRaw, ContentState } from 'draft-js'

import Planner from './Planner'

import PlannerLeftBar from './planner/PlannerLeftBar'
import PlannerRightBar from './planner/PlannerRightBar'
import PlannerBottomBar from './planner/PlannerBottomBar'

import MapboxMap from './planner/MapboxMap'

import _ from 'lodash'

function generateDatesUnixArr (startDateUnixSecs, numOfDaysInt) {
  let tempArr = []
  while (tempArr.length < numOfDaysInt) {
    tempArr.push(startDateUnixSecs + (tempArr.length * 86400))
  }
  return tempArr
}

class PlannerPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      plannerView: 'planner'
    }
    // MOVE PLANNER VIEW STATE INTO REDUX
  }

  changePlannerView () {
    this.setState({
      plannerView: this.state.plannerView === 'planner' ? 'map' : 'planner'
    })
  }

  // WILL SWITCH TO CONTENT STATE (MERGE YT)
  componentWillReceiveProps (nextProps) {
    if (this.props.data.findItinerary !== nextProps.data.findItinerary) {
      // console.log('nextProps allevents', nextProps.data.findItinerary.events)
      const allEvents = nextProps.data.findItinerary.events.map(event => {
        return {
          ...event,
          ...{
            startTime: new Date(event.startTime * 1000).toGMTString().substring(17, 22),
            eventType: event.eventType ? ContentState.createFromText(event.eventType) : ContentState.createFromText(''),
            location: ContentState.createFromText(''),
            currency: event.currency ? ContentState.createFromText(event.currency) : ContentState.createFromText(''),
            cost: event.cost ? ContentState.createFromText(event.cost) : ContentState.createFromText(''),
            notes: event.notes ? ContentState.createFromText(event.notes) : ContentState.createFromText(''),
            bookingService: event.bookingService ? ContentState.createFromText(event.bookingService) : ContentState.createFromText(''),
            bookingConfirmation: event.bookingConfirmation ? ContentState.createFromText(event.bookingConfirmation) : ContentState.createFromText('')
          }
        }
      })

      // TESTING REVERSING EDITOR STATE INTO PLAIN TEXT
      let testingJSON = '{"blocks":[{"key":"dhq60","text":"Visiting India had been my goal since a long time ago. Everyone had been discouraging me to go to India based on their impression.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"8r73d","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"8e8l1","text":"We had only 9 days and the highlight of the trip was Ladakh. We didn’t think it was possible to include).","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}'
      let editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(testingJSON)))
      let contentState = editorState.getCurrentContent()
      // console.log('content state', contentState)
      let plainText = contentState.getPlainText()
      // console.log('plaintext', plainText)

      // console.log('allEvents after draftjs mapping', allEvents)
      this.props.initializeEvents(allEvents)
      setTimeout(() => this.props.toggleSpinner(false), 750)
    }
  }

  // PUBLIC VS PRIVATE ROUTE: REPLACE COMPONENTS WITH A PUBLIC FACING COMPONENT?
  render () {
    if (this.props.data.loading) return (<h1>Loading</h1>)

    // CALCULATE DATES, DAYS HERE. DATES ARR IN UNIX (SECS).
    const startDateUnix = this.props.data.findItinerary.startDate
    const numOfDaysInt = this.props.data.findItinerary.days

    // [1, 2, 3 ...days] props to pass Planner
    let daysIntArr = _.range(1, numOfDaysInt + 1)

    // props to pass Planner. either null or []
    let datesUnixArr = null
    if (startDateUnix) {
      datesUnixArr = generateDatesUnixArr(startDateUnix, numOfDaysInt)
    }

    return (
      <div style={{width: '100vw', minHeight: 'calc(100vh - 52px)'}}>
        {/* STYLING FOR CENTERING IS IN PLANNER ITSELF */}
        {this.state.plannerView === 'planner' &&
          <Planner itineraryId={this.props.match.params.itineraryId} days={numOfDaysInt} daysArr={daysIntArr} datesArr={datesUnixArr} />
        }

        {/* CUSTOM LOCATION VIEW. ONLY HAS MAP + RIGHT SIDEBAR */}

        {/* MAP PLANNER VIEW. SWOP PLANNER OUT WITH PLANNER LEFT BAR, MAP COMPONENT */}
        {this.state.plannerView === 'map' &&
          <div style={{display: 'flex'}}>
            {/* LEFT BAR 376 PX ON 1920PX. */}
            <PlannerLeftBar itineraryId={this.props.match.params.itineraryId} days={numOfDaysInt} daysArr={daysIntArr} datesArr={datesUnixArr} />

            {/* <MapboxMap /> */}
          </div>
        }

        {/* ALWAYS VISIBLE REGARDLESS OF VIEW */}
        <PlannerRightBar />
        <PlannerBottomBar plannerView={this.state.plannerView} changePlannerView={() => this.changePlannerView()} />
      </div>
    )
  }
}

const options = {
  options: props => ({
    variables: {
      id: props.match.params.itineraryId
    }
  })
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeEvents: (events) => {
      dispatch(initializeEvents(events))
    },
    toggleSpinner: (spinner) => {
      dispatch(toggleSpinner(spinner))
    }
  }
}

export default connect(null, mapDispatchToProps)(graphql(queryItinerary, options)(PlannerPage))
