import React, { Component } from 'react'
import moment from 'moment'

const pStyle = {
  margin: '0'
}
const infoStyle = {...pStyle,
  ...{
    fontSize: '14px'
  }
}
const cityCountryStyle = {...pStyle,
  ...{
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    fontSize: '14px'
  }
}

class EditFormFlightDetailsInstance extends Component {
  render () {
    if (!this.props.instance) return null
    // console.log('instance', this.props.instance)

    var instance = this.props.instance
    // START AND END DAY MAY BE OUTSIDE OF DATES ARR.
    // console.log('props dates arr', this.props.dates)
    // dates arr props is date obj
    var departureDateUnix = moment(this.props.dates[0]).unix() + (instance.startDay - 1) * 86400
    var arrivalDateUnix = moment(this.props.dates[0]).unix() + (instance.endDay - 1) * 86400
    var departureMoment = moment.unix(departureDateUnix).utc().format('DD/MM/YYYY')
    var arrivalMoment = moment.unix(arrivalDateUnix).utc().format('DD/MM/YYYY')
    // console.log('departureMoment', departureMoment, 'arrivalMoment', arrivalMoment)
    var startTime = instance.startTime
    var startMoment = moment.unix(startTime).utc().format('HH:mm')
    var endTime = instance.endTime
    var endMoment = moment.unix(endTime).utc().format('HH:mm')

    var flightHours = Math.floor(instance.durationMins / 60)
    var flightHoursStr = flightHours ? flightHours + 'h' : null
    var flightMins = instance.durationMins % 60
    var flightMinsStr = flightMins ? flightMins + 'm' : null

    return (
      <tr>
        <td style={{width: '40%', textAlign: 'right', verticalAlign: 'top'}}>
          <p style={pStyle}>{instance.departureIATA}</p>
          <p style={infoStyle}>{instance.departureAirport}</p>
          <p style={cityCountryStyle}>{instance.departureCityCountry}</p>
          <p style={infoStyle}>Terminal {instance.departureTerminal}</p>
          <p style={infoStyle}>{departureMoment} {startMoment}</p>
        </td>

        <td style={{width: '20%'}}>
          <img src={`${process.env.PUBLIC_URL}/img/airlinelogos/${instance.airlineCode}.png`} style={{height: '24px'}} />
          <p style={infoStyle}>{instance.airlineCode} {instance.flightNumber}</p>
          <p style={infoStyle}>{flightHoursStr} {flightMinsStr}</p>
        </td>

        <td style={{width: '40%', textAlign: 'left', verticalAlign: 'top'}}>
          <p style={pStyle}>{instance.arrivalIATA}</p>
          <p style={infoStyle}>{instance.arrivalAirport}</p>
          <p style={cityCountryStyle}>{instance.arrivalCityCountry}</p>
          <p style={infoStyle}>Terminal {instance.arrivalTerminal}</p>
          <p style={infoStyle}>{arrivalMoment} {endMoment}</p>
        </td>
      </tr>
    )
  }
}

export default EditFormFlightDetailsInstance
