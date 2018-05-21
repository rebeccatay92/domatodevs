function latestTime (eventsArr, day) {
  var dayEvents = eventsArr.filter(e => {
    return e.day === day
  })
  var latestTimeSoFar = 0

  dayEvents.forEach(event => {
    // activity and food time only reflects startTime
    if (event.type === 'Activity' || event.type === 'Food') {
      if (event[event.type].startTime > latestTimeSoFar) {
        latestTimeSoFar = event[event.type].startTime
      }
      if (event[event.type].endTime > latestTimeSoFar) {
        latestTimeSoFar = event[event.type].endTime
      }
    } else {
      if (event.time > latestTimeSoFar) {
        latestTimeSoFar = event.time
      }
    }
  })
  return latestTimeSoFar
}

export default latestTime
