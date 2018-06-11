export function deleteDay (events, day) {
  // Assigning new day to events after deleted day excluding flights
  let newEventsArrWithNewDays = []
  events.forEach(event => {
    event.startDay > day && newEventsArrWithNewDays.push({EventId: event.id, startDay: event.startDay - 1, loadSequence: event.loadSequence})
  })
  return newEventsArrWithNewDays
}
