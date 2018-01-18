// eventObj = {
//   startDay,
//   endDay,
//   startTime,
//   endTime
// }

// for each event, construct interval [startTime, endTime]. if day > 1, add days*86400
// lodging are 2 point intervals [start, start], [end, end]
// interval arr [[start,end], [start, end], [start, end]]
// eventIdArr [[Activity1], [Food2], [Lodging3]]

export function validateIntervals (eventsArr, eventObj, modelType) {
  var eventsAlreadyAdded = [] // 'Activity1'
  var intervalArr = []
  eventsArr.forEach(e => {
    if (e.type !== 'Flight') {
      var eventId = `${e.type}${e.modelId}`
    } else {
      eventId = `FlightInstance${e.Flight.FlightInstance.id}`
    }

    if (!eventsAlreadyAdded.includes(eventId)) {
      // if not alrdy in arr, find absolute start unix, absolute end unix. depends on models.
      var absoluteStartUnix = null
      var absoluteEndUnix = null
      if (e.type === 'Flight') {
        var instance = e.Flight.FlightInstance
        eventsAlreadyAdded.push(`FlightInstance${instance.id}`)
        var startDay = instance.startDay
        var startTime = instance.startTime
        var endDay = instance.endDay
        var endTime = instance.endTime
        absoluteStartUnix = (startDay - 1) * (86400) + startTime
        absoluteEndUnix = (endDay - 1) * 86400 + endTime
        var isPoint = absoluteStartUnix === absoluteEndUnix ? 'point' : 'duration'
        intervalArr.push([absoluteStartUnix, absoluteEndUnix, isPoint])
      } else if (e.type === 'Lodging') {
        // for lodging make 2 intervals (point)
        eventsAlreadyAdded.push(`${e.type}${e.modelId}`)
        eventsAlreadyAdded.push(`${e.type}${e.modelId}`)
        startDay = e[`${e.type}`].startDay
        startTime = e[`${e.type}`].startTime
        endDay = e[`${e.type}`].endDay
        endTime = e[`${e.type}`].endTime
        absoluteStartUnix = (startDay - 1) * (86400) + startTime
        absoluteEndUnix = (endDay - 1) * 86400 + endTime
        intervalArr.push([absoluteStartUnix, absoluteStartUnix, 'point'])
        intervalArr.push([absoluteEndUnix, absoluteEndUnix, 'point'])
      } else {
        eventsAlreadyAdded.push(`${e.type}${e.modelId}`)
        startDay = e[`${e.type}`].startDay
        startTime = e[`${e.type}`].startTime
        endDay = e[`${e.type}`].endDay
        endTime = e[`${e.type}`].endTime
        absoluteStartUnix = (startDay - 1) * (86400) + startTime
        absoluteEndUnix = (endDay - 1) * 86400 + endTime
        isPoint = absoluteStartUnix === absoluteEndUnix ? 'point' : 'duration'
        intervalArr.push([absoluteStartUnix, absoluteEndUnix, isPoint])
      }
    }
  })
  console.log('eventsAlreadyAdded', eventsAlreadyAdded)
  console.log('intervalArr', intervalArr)
  console.log('modelType', modelType)

  if (modelType !== 'Flight') {
    var incomingStartUnix = (eventObj.startDay - 1) * 86400 + eventObj.startTime
    var incomingEndUnix = (eventObj.endDay - 1) * 86400 + eventObj.endTime
    var incomingIsPointType = incomingStartUnix === incomingEndUnix ? 'point' : 'duration'
    var incomingInterval = [incomingStartUnix, incomingEndUnix, incomingIsPointType]
    console.log('incomingInterval', incomingInterval)

    for (var i = 0; i < intervalArr.length; i++) {
      var existing = intervalArr[i]
      var existingStart = existing[0]
      var existingEnd = existing[1]
      var isPoint = existing[2]
      var incomingStart = incomingInterval[0]
      var incomingEnd = incomingInterval[1]
      var incomingIsPoint = incomingInterval[2]

      if (incomingStart > existingStart && incomingStart < existingEnd) {
        // incoming start is inside an interval (excluding endpoints)
        console.log('ERROR: incoming start inside interval')
        return true
      }
      if (incomingEnd > existingStart && incomingEnd < existingEnd) {
        // incoming end is inside interval (excluding endpoint)
        console.log('ERROR: incoming end inside interval')
        return true
      }
      if (existingStart > incomingStart && existingStart < incomingEnd) {
        // existing start is in between incoming interval
        console.log('ERROR: existing start in between incoming interval')
        return true
      }
      if (existingEnd > incomingStart && existingEnd < incomingEnd) {
        // existing end is in between incoming interval
        console.log('ERROR: existing end in between incoming interval')
        return true
      }
      if (incomingStart === existingStart) {
        // if both are duration sure clash if they start at the same time
        if (incomingIsPoint === 'duration' && isPoint === 'duration') {
          console.log('ERROR: start times are exactly the same, and not point timings')
          return true
        }
      }
      if (incomingEnd === existingEnd) {
        if (incomingIsPoint === 'duration' && isPoint === 'duration') {
          console.log('ERROR: end times are exactly the same, and not point timings')
          return true
        }
      }
    }
  } else if (modelType === 'Flight') {
    for (var j = 0; j < eventObj.length; j++) {
      var flightInstance = eventObj[j]
      incomingStartUnix = (flightInstance.startDay - 1) * 86400 + flightInstance.startTime
      incomingEndUnix = (flightInstance.endDay - 1) * 86400 + flightInstance.endTime
      incomingIsPoint = incomingStartUnix === incomingEndUnix ? 'point' : 'duration'
      incomingInterval = [incomingStartUnix, incomingEndUnix, incomingIsPoint]
      console.log('incomingInterval', incomingInterval)

      for (var k = 0; k < intervalArr.length; k++) {
        existing = intervalArr[k]
        existingStart = existing[0]
        existingEnd = existing[1]
        isPoint = existing[2]
        incomingStart = incomingInterval[0]
        incomingEnd = incomingInterval[1]
        incomingIsPoint = incomingInterval[2]

        if (incomingStart > existingStart && incomingStart < existingEnd) {
          // incoming start is inside an interval (excluding endpoints)
          console.log('ERROR: incoming start inside interval')
          return true
        }
        if (incomingEnd > existingStart && incomingEnd < existingEnd) {
          // incoming end is inside interval (excluding endpoint)
          console.log('ERROR: incoming end inside interval')
          return true
        }
        if (existingStart > incomingStart && existingStart < incomingEnd) {
          // existing start is in between incoming interval
          console.log('ERROR: existing start in between incoming interval')
          return true
        }
        if (existingEnd > incomingStart && existingEnd < incomingEnd) {
          // existing end is in between incoming interval
          console.log('ERROR: existing end in between incoming interval')
          return true
        }
        if (incomingStart === existingStart) {
          // if both are duration sure clash if they start at the same time
          if (incomingIsPoint === 'duration' && isPoint === 'duration') {
            console.log('ERROR: start times are exactly the same, and not point timings')
            return true
          }
        }
        if (incomingEnd === existingEnd) {
          if (incomingIsPoint === 'duration' && isPoint === 'duration') {
            console.log('ERROR: end times are exactly the same, and not point timings')
            return true
          }
        }
      }
    }
  }
  // IN BETWEEN, EXCLUDING ENDPOINTS
  // clash if incomingInterval start is between preexisting interval, or incomingInterval end is between preexisting interval (not equals)
  // clash if either prexisting start/end is in between incoming start/end. exactly not counted
  // INCOMING STARTPOINT COINCIDE EXACTLY WITH PREEXISTING START
  // IF INCOMING IS A POINT DURATION, PREXISTING CAN HV A DURATION. NO OVERLAP
  // IF INCOMING HAS A DURATION, PREEXISTING MUST NOT HV A DURATION.

  // INCOMING ENDPOINT COINCIDE EXACTLY WITH PREEXISTING END POINT
  // IF INCOMING IS A POINT DURATION, PREXISTING CAN HV DURATION. NO OVERLAP.
  // IF INCOMING HAS DURATION, PREEXISTING MUST NOT HV A DURATION.
}
