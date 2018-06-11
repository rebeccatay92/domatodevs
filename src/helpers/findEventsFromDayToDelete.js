function findEventsFromDayToDelete (events, day) {
  const eventsToDelete = events.filter(event => {
    // if (event.type !== 'Flight') {
    //   return (event[event.type].startDay === day || event[event.type].endDay === day) && (typeof event.start !== 'boolean' || event.start)
    // } else {
    //   return (event.Flight.FlightInstance.startDay === day || event.Flight.FlightInstance.endDay === day) && event.start
    // }
    return event.startDay === day
  })
  return eventsToDelete.map(event => event.id)
}

export default findEventsFromDayToDelete
