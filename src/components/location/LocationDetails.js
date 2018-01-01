import React, { Component } from 'react'
import moment from 'moment'

class LocationDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      address: null,
      telephone: null,
      // day of week int starts with sun 0
      dayOfWeekInt: null,
      dayOfWeekStr: null,
      openingHoursPeriods: null,
      openingHoursText: null
    }
}

  componentWillReceiveProps (nextProps) {
    console.log('nextProps', nextProps)
    
    if (this.props.googlePlaceDetails !== nextProps.googlePlaceDetails || this.props.day !== nextProps.day) {
      // reset location details
      this.setState({
        address: null,
        telephone: null,
        dayOfWeekInt: null,
        dayOfWeekStr: null,
        openingHoursPeriods: null,
        openingHoursText: null
      })

      console.log('googleplacedetails', nextProps.googlePlaceDetails)
      console.log('startDay', nextProps.day)

      this.setState({
        address: nextProps.googlePlaceDetails.formatted_address,
        telephone: nextProps.googlePlaceDetails.international_phone_number || nextProps.formatted_phone_number
      })

      // FIND DAY OF THE WEEK BASED ON DATES ARR AND STARTDAY
      // console.log('dates arr', nextProps.dates)
      var dateUnix = nextProps.dates[nextProps.day - 1]
      // console.log('dateunix', dateUnix)
      var momentTime = moment.utc(dateUnix)
      // console.log('moment', momentTime)

      var momentDayStr = momentTime.format('dddd')
      // console.log('day str', momentDayStr)
      this.setState({dayOfWeekStr: momentDayStr})

      var momentDayInt = momentTime.format('d')
      // console.log('day int', momentDayInt)
      this.setState({dayOfWeekInt: momentDayInt})

      if (nextProps.googlePlaceDetails.opening_hours && nextProps.googlePlaceDetails.opening_hours.periods[momentDayInt]) {
        this.setState({openingHoursPeriods: nextProps.googlePlaceDetails.opening_hours.periods[momentDayInt]})
      }

      if (nextProps.googlePlaceDetails.opening_hours && nextProps.googlePlaceDetails.opening_hours.weekday_text) {
        var str = nextProps.googlePlaceDetails.opening_hours.weekday_text.filter(e => {
          return e.indexOf(momentDayStr) > -1
        })
        this.setState({openingHoursText: str})
      }
    }
  }

  render () {
    return (
      <div style={{position: 'relative', border: '1px solid white'}}>
        <h6>Address: {this.state.address}</h6>
        <h6>Tel: {this.state.telephone}</h6>
        <h6>Opening: {this.state.openingHoursText}</h6>
      </div>
    )
  }
}

export default LocationDetails
