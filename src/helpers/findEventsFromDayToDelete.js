function findEventsFromDayToDelete (events, day) {
  const eventsToDelete = events.filter(event => {
    return event.startDay === day
  })
  return eventsToDelete.map(event => event.id)
}

export default findEventsFromDayToDelete
