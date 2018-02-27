import React, { Component } from 'react'

class ScheduleOfEvents extends Component {
  render () {
    return (
      <div style={{position: 'relative', overflowY: 'scroll', height: '250px', marginTop: '30px'}}>
        {this.props.dates.map((date, i) => {
          return (
            <div>
              <p>
                <span style={{fontSize: '20px'}}>Day {i + 1}</span>
                <span style={{fontSize: '14px', marginLeft: '5px'}}>{date.toDateString().toUpperCase()}</span>
              </p>
              {this.props.events.filter(event => {
                return event.day === i + 1
              }).map(event => {
                let time, location, description
                if (event.type === 'Food' || event.type === 'Activity') {
                  time = new Date(event[event.type].startTime * 1000).toGMTString().substring(17, 22)
                  location = event[event.type].location.name
                  description = event[event.type].description
                } else if (event.start) {
                  if (event.type === 'Flight') {
                    time = new Date(event.Flight.FlightInstance.startTime * 1000).toGMTString().substring(17, 22)
                    location = event.Flight.FlightInstance.departureLocation.name
                    description = 'Flight Departure'
                  } else {
                    time = new Date(event[event.type].startTime * 1000).toGMTString().substring(17, 22)
                    location = event[event.type].location ? event[event.type].location.name : event[event.type].departureLocation.name
                    description = event[event.type].location ? 'Check In' : 'Departure'
                  }
                } else if (!event.start) {
                  if (event.type === 'Flight') {
                    time = new Date(event.Flight.FlightInstance.endTime * 1000).toGMTString().substring(17, 22)
                    location = event.Flight.FlightInstance.arrivalLocation.name
                    description = 'Flight Arrival'
                  } else {
                    time = new Date(event[event.type].endTime * 1000).toGMTString().substring(17, 22)
                    location = event[event.type].location ? event[event.type].location.name : event[event.type].arrivalLocation.name
                    description = event[event.type].location ? 'Check Out' : 'Arrival'
                  }
                }
                return (
                  <p style={{fontWeight: 'bold'}}>
                    <span>{time}</span>
                    <span style={{marginLeft: '5px'}}>{location}</span>
                    <span> - {description}</span>
                  </p>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }
}

export default ScheduleOfEvents
