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

class EditFormFlightDetailsPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      instances: []
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.instances !== nextProps.instances) {
      this.setState({instances: nextProps.instances}, () => console.log('INSTANCES', this.state.instances))
    }
  }

  render () {
    var instances = this.state.instances
    return (
      <div style={{textAlign: 'center', fontSize: '18px', color: 'white', position: 'relative'}}>
        {instances.map((instance, i) => {
          var departureDate = this.props.dates[instance.startDay - 1]
          var arrivalDate = this.props.dates[instance.endDay - 1]
          var departureMoment = moment(departureDate).format('DD/MM/YYYY')
          var arrivalMoment = moment(arrivalDate).format('DD/MM/YYYY')

          var startTime = instance.startTime
          var startMoment = moment.unix(startTime).utc().format('HH:mm')
          var endTime = instance.endTime
          var endMoment = moment.unix(endTime).utc().format('HH:mm')

          var flightHours = Math.floor(instance.durationMins / 60)
          var flightHoursStr = flightHours ? flightHours + 'h' : null
          var flightMins = instance.durationMins % 60
          var flightMinsStr = flightMins ? flightMins + 'm' : null
          console.log('flightHours', flightHours, 'flightMins', flightMins)

          return (
            <table key={i} style={{width: '100%', tableLayout: 'fixed'}}>
              <tbody>
                <tr>
                  <td style={{width: '40%', textAlign: 'right', verticalAlign: 'top'}}>
                    <p style={pStyle}>{instance.departureIATA}</p>
                    <p style={infoStyle}>{instance.departureLocation.name}</p>
                    <p style={cityCountryStyle}>{instance.departureCityCountry}</p>
                    <p style={infoStyle}>{instance.departureTerminal}</p>
                    <p style={infoStyle}>{departureMoment} {startMoment}</p>
                  </td>

                  <td style={{width: '20%'}}>
                    <img src={`${process.env.PUBLIC_URL}/img/airlinelogos/${instance.airlineCode}.png`} style={{height: '24px'}} />
                    <p style={infoStyle}>{instance.airlineCode} {instance.flightNumber}</p>
                    <p style={infoStyle}>{flightHoursStr} {flightMinsStr}</p>
                  </td>

                  <td style={{width: '40%', textAlign: 'left', verticalAlign: 'top'}}>
                    <p style={pStyle}>{instance.arrivalIATA}</p>
                    <p style={infoStyle}>{instance.arrivalLocation.name}</p>
                    <p style={cityCountryStyle}>{instance.arrivalCityCountry}</p>
                    <p style={infoStyle}>{instance.arrivalTerminal}</p>
                    <p style={infoStyle}>{arrivalMoment} {endMoment}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          )
        })}
      </div>
    )
  }
}

export default EditFormFlightDetailsPage
