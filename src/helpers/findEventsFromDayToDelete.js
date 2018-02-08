function findEventsFromDayToDelete (events, day) {
  const eventsToDelete = events.filter(event => {
    if (event.type !== 'Flight') {
      return (event[event.type].startDay === day || event[event.type].endDay === day) && (typeof event.start !== 'boolean' || event.start)
    } else {
      return (event.Flight.FlightInstance.startDay === day || event.Flight.FlightInstance.endDay === day) && event.start
    }
  })
  return eventsToDelete.map(event => {
    if (event.type !== 'Flight') {
      return {
        type: event.type,
        id: event.modelId
      }
    } else {
      return {
        type: 'FlightBooking',
        id: event.modelId
      }
    }
  })
}

export default findEventsFromDayToDelete
