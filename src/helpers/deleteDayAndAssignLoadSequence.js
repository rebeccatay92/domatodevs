export function deleteDayAndAssignLoadSequence (events, day) {
  // Delete events from the specified day from eventsArr
  let flightBookingsToDelete = []
  events.forEach(event => {
    if (event.type === 'Flight') {
      if ((event.Flight.FlightInstance.startDay === day || event.Flight.FlightInstance.endDay === day) && event.start) {
        !flightBookingsToDelete.includes(event.modelId) && flightBookingsToDelete.push(event.modelId)
      }
    }
  })

  let eventsArrWithoutDeletedFlightBookings = events
  flightBookingsToDelete.forEach(flightBookingId => {
    const newArr = eventsArrWithoutDeletedFlightBookings.filter(event => {
      if (event.type === 'Flight') {
        return event.modelId !== flightBookingId
      } else {
        return true
      }
    })
    eventsArrWithoutDeletedFlightBookings = newArr
  })
  const newEventsArr = eventsArrWithoutDeletedFlightBookings.filter(event => {
    if (event.type !== 'Flight') {
      return (event[event.type].startDay !== day && event[event.type].endDay !== day)
    }
  })
  // Assigning new day to events after deleted day excluding flights
  const newEventsArrWithNewDays = newEventsArr.map(event => {
    if (event.type === 'Flight') return event
    else return {...event, ...event.day > day && {day: event.day - 1}}
  })
  // Assigning new load sequence to eventsArr
  let daysObj = {}
  const loadSeqInput = newEventsArrWithNewDays.map(event => {
    if (!daysObj[event.day]) daysObj[event.day] = 1
    else daysObj[event.day] = daysObj[event.day] + 1
    return ({
      ...{
        type: event.type === 'Flight' ? 'FlightInstance' : event.type,
        id: event.type === 'Flight' ? event.Flight.FlightInstance.id : event.modelId,
        loadSequence: daysObj[event.day],
        day: event.day
      },
      ...event.type !== 'Activity' && event.type !== 'Food' && {
        start: event.start
      },
      ...(event.type === 'Activity' || event.type === 'Food') && event[event.type].endDay > event[event.type].startDay && {
        diff: event[event.type].endDay - event[event.type].startDay
      }
    })
  })
  return loadSeqInput
}
