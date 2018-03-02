import React, { Component } from 'react'

class ScheduleOfEvents extends Component {
  render () {
    const datesArr = this.props.dates || this.props.daysArr
    return (
      <div className='scheduleOfEvents' style={{position: 'relative', overflowY: 'scroll', height: '397px', marginTop: '48px'}}>
        {datesArr.map((date, i) => {
          return (
            <div key={i}>
              <p>
                <span style={{fontSize: '24px', fontWeight: '300'}}>Day {i + 1}</span>
                {this.props.dates && <span style={{fontSize: '16px', fontWeight: '300', marginLeft: '8px'}}>{date.toDateString().toUpperCase()}</span>}
              </p>
              {this.props.events.filter(event => {
                return event.day === i + 1
              }).map((event, i, array) => {
                let time, location, description
                const isLast = i === array.length - 1
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
                  <p key={i} style={{fontWeight: '300', fontSize: '16px', margin: isLast ? '0 0 24px 0 ' : '0 0 16px 0'}}>
                    <span>{time}</span>
                    <span style={{marginLeft: '16px'}}>{location}</span>
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
