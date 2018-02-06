import React, { Component } from 'react'
// import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import onClickOutside from 'react-onclickoutside'
import moment from 'moment'
import DatePicker from 'react-datepicker'

// import { initializePlanner } from '../actions/plannerActions'

import { itineraryDatesStyle } from '../Styles/styles'

import { updateItineraryDetails, queryItinerary } from '../apollo/itinerary'

class PlannerHeaderDates extends Component {
  constructor (props) {
    super(props)

    this.state = {
      editing: false,
      startDate: moment(this.props.startDate),
      endDate: moment(this.props.endDate),
      newStartDate: moment(this.props.startDate),
      newEndDate: moment(this.props.endDate)
    }
  }

  handleClickOutside (event) {
    if (event.target.localName === 'input' || event.target.className.includes('react-datepicker')) return
    this.setState({
      editing: false,
      newStartDate: moment(this.props.startDate),
      newEndDate: moment(this.props.endDate)
    })
  }

  handleKeyDown (e) {
    if (e.keyCode === 13) {
      this.handleEdit()
    }
  }

  handleEdit () {
    this.setState({
      editing: false
    })

    if (this.state.newStartDate === this.state.startDate && this.state.newEndDate === this.state.endDate) return

    this.setState({
      startDate: this.state.newStartDate,
      endDate: this.state.newEndDate
    })

    this.props.mutate({
      variables: {
        id: this.props.id,
        startDate: this.state.newStartDate.utc() / 1000,
        days: ((this.state.newEndDate.utc() - this.state.newStartDate.utc()) / 86400000) + 1
      },
      refetchQueries: [{
        query: queryItinerary,
        variables: { id: this.props.id }
      }]
    })
      // .then(response => this.props.data.refetch())
      // .then(response => this.props.initializePlanner(response.data.findItinerary.events))
  }

  render () {
    const startDateString = this.state.startDate.format('MMM D YYYY')
    const endDateString = this.state.endDate.format('MMM D YYYY')
    return (
      this.state.editing ? (
        <span style={{display: 'inline-block', width: '30%', position: 'relative', top: '-5px'}} onKeyDown={(e) => this.handleKeyDown(e)}>
          <div style={{display: 'inline-block', width: '40%'}}>
            <DatePicker
              selected={this.state.newStartDate}
              maxDate={this.state.newEndDate}
              onChange={(e) => this.setState({newStartDate: moment(e._d)})}
            />
          </div>
          <span style={{marginLeft: '-4%'}}> - </span>
          <div style={{display: 'inline-block', width: '40%'}}>
            <DatePicker
              selected={this.state.newEndDate}
              minDate={this.state.newStartDate}
              onChange={(e) => this.setState({newEndDate: moment(e._d)})}
            />
          </div>
        </span>
      ) : (this.props.startDate ?
        <p style={itineraryDatesStyle} className='itineraryInfo'><span title={'Start Date'} onClick={() => this.setState({editing: true})}>{startDateString.toUpperCase()}</span> - <span title={'End Date'} onClick={() => this.setState({editing: true})}>{endDateString.toUpperCase()}</span></p> : <p style={itineraryDatesStyle} className='itineraryInfo'><span title={'Start Date'} onClick={() => this.setState({editing: true})}>Set a start date</span></p>
      )
    )
  }
}

// const options = {
//   options: props => ({
//     variables: {
//       id: props.id
//     }
//   })
// }
//
// const mapDispatchToProps = (dispatch) => {
//   return {
//     initializePlanner: (activities) => {
//       dispatch(initializePlanner(activities))
//     }
//   }
// }

export default compose(
  graphql(updateItineraryDetails)
)(onClickOutside(PlannerHeaderDates))
